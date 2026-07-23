/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { 
  addBooking, 
  addContact, 
  getDb, 
  updateBookingStatus, 
  softDeleteBooking, 
  restoreBooking,
  updateContactStatus, 
  softDeleteContact,
  restoreContact,
  getActiveBookings,
  getDeletedBookings,
  getActiveContacts,
  getDeletedContacts,
  createSession,
  getSession,
  destroySession,
  validateUserCredentials,
  logAuditAction,
  calculatePricingEstimate,
  getSiteContent,
  updateSiteSection,
  getAllUsers,
  registerAdminUser,
  updateUserCredentials,
  DbActor
} from './src/server/db.ts';

// In-Memory Rate Limiter Middleware Factory
interface RateLimitOptions {
  windowMs: number;
  max: number;
  message: string;
}

function createRateLimiter(options: RateLimitOptions) {
  const requests = new Map<string, { count: number; resetTime: number }>();
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const record = requests.get(ip);

    if (!record || now > record.resetTime) {
      requests.set(ip, { count: 1, resetTime: now + options.windowMs });
      return next();
    }

    if (record.count >= options.max) {
      const retryAfterSeconds = Math.ceil((record.resetTime - now) / 1000);
      res.setHeader('Retry-After', retryAfterSeconds);
      return res.status(429).json({ error: options.message });
    }

    record.count++;
    next();
  };
}

const publicFormRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: 'Too many requests submitted from this IP address. Please wait 15 minutes before submitting another proposal.'
});

const adminLoginRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many authentication attempts. Royal Command Studio access restricted for 15 minutes.'
});

// Main server bootstrapping
async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parser
  app.use(express.json());

  // Simple custom cookie-parser middleware
  app.use((req, res, next) => {
    const cookieHeader = req.headers.cookie;
    const cookies: Record<string, string> = {};
    if (cookieHeader) {
      cookieHeader.split(';').forEach((cookie) => {
        const [key, value] = cookie.trim().split('=');
        if (key && value) {
          cookies[key] = decodeURIComponent(value);
        }
      });
    }
    (req as any).cookies = cookies;
    next();
  });

  // Admin session authentication check
  const adminAuthMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const sessionToken = (req as any).cookies.barmantra_session || req.headers.authorization?.split('Bearer ')[1];
    const session = getSession(sessionToken);
    
    if (session) {
      (req as any).user = {
        id: session.userId,
        email: session.email,
        name: session.name,
        role: session.role
      } as DbActor;
      next();
    } else {
      res.status(401).json({ error: 'Unauthorized. Royal clearance is missing or expired.' });
    }
  };

  // --- API ROUTE SYSTEM ---

  // Health & Uptime Diagnostics Endpoint
  const startTime = Date.now();
  app.get('/api/health', (req, res) => {
    try {
      const db = getDb();
      const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);
      const memoryUsage = process.memoryUsage();

      res.json({
        status: 'healthy',
        service: 'Barmantra Elite Full-Stack API',
        uptimeSeconds,
        timestamp: new Date().toISOString(),
        database: {
          status: 'connected',
          bookingsCount: db.bookings ? db.bookings.length : 0,
          contactsCount: db.contacts ? db.contacts.length : 0,
          auditLogsCount: db.auditLogs ? db.auditLogs.length : 0
        },
        system: {
          nodeVersion: process.version,
          memoryRssMb: Math.round(memoryUsage.rss / (1024 * 1024)),
          heapUsedMb: Math.round(memoryUsage.heapUsed / (1024 * 1024))
        }
      });
    } catch (err: any) {
      console.error('[HEALTH CHECK FAILED]:', err);
      res.status(500).json({
        status: 'unhealthy',
        service: 'Barmantra Elite Full-Stack API',
        error: err.message || 'Database access failure'
      });
    }
  });

  // Public: Server-side Pricing Calculator verification endpoint
  app.post('/api/pricing/calculate', (req, res) => {
    const { eventType, guestCount } = req.body;
    if (!eventType || !guestCount) {
      return res.status(400).json({ error: 'Event type and guest count are required.' });
    }
    const count = Number(guestCount);
    if (isNaN(count) || count <= 0) {
      return res.status(400).json({ error: 'Guest count must be a positive number.' });
    }

    const calculatedEstimate = calculatePricingEstimate(String(eventType), count);
    res.json({ success: true, pricingEstimate: calculatedEstimate, currency: 'INR' });
  });

  // Public: Submit a booking request (Rate Limited + Server Computed Pricing)
  app.post('/api/bookings', publicFormRateLimiter, (req, res) => {
    try {
      const { name, phone, email, eventType, eventDate, guestCount, message, pricingEstimate } = req.body;
      
      if (!name || !phone || !email || !eventType || !eventDate || !guestCount || !message) {
        return res.status(400).json({ error: 'All fields are strictly required.' });
      }
      
      const count = Number(guestCount);
      if (isNaN(count) || count <= 0) {
        return res.status(400).json({ error: 'Guest count must be a positive number.' });
      }

      // Server-side Independent Quote Computation
      const serverCalculatedPrice = calculatePricingEstimate(String(eventType), count);

      const booking = addBooking({
        name,
        phone,
        email,
        eventType,
        eventDate,
        guestCount: count,
        message
      });

      // Verify and lock price
      booking.pricingEstimate = serverCalculatedPrice;

      res.status(201).json({ 
        success: true, 
        message: 'Your inquiry has been stored securely in the Barmantra Ledger.', 
        booking 
      });
    } catch (err: any) {
      console.error('Failed to register booking:', err);
      res.status(500).json({ error: 'Database record failed to compile.' });
    }
  });

  // Public: Submit general contact inquiry (Rate Limited)
  app.post('/api/contacts', publicFormRateLimiter, (req, res) => {
    try {
      const { name, phone, email, eventType, eventDate, guestCount, message } = req.body;
      
      if (!name || !phone || !email || !eventType || !eventDate || !guestCount || !message) {
        return res.status(400).json({ error: 'All fields are strictly required.' });
      }

      const count = Number(guestCount);

      const contact = addContact({
        name,
        phone,
        email,
        eventType,
        eventDate,
        guestCount: count,
        message
      });

      res.status(201).json({ 
        success: true, 
        message: 'Your custom contact inquiry is received. Let the magic begin.', 
        contact 
      });
    } catch (err: any) {
      console.error('Failed to register contact:', err);
      res.status(500).json({ error: 'Database record failed to compile.' });
    }
  });

  // Public: AI custom cocktail suggestion
  app.post('/api/ai/suggest-cocktail', async (req, res) => {
    try {
      const { spirit, flavorProfile } = req.body;
      if (!spirit || !flavorProfile) {
        return res.status(400).json({ error: 'Spirit base and flavor profile are strictly required.' });
      }

      // Check if GEMINI_API_KEY exists. If not, use high-fidelity royal fallback mock
      if (!process.env.GEMINI_API_KEY) {
        console.log('GEMINI_API_KEY is not defined, utilizing luxury backup formulas...');
        const fallbacks: Record<string, any> = {
          'gin': {
            name: 'The Saffron Maharani G&T',
            history: 'Inspired by Maharani Gayatri Devi\'s summer evening soirées in Jaipur, this regal drink infuses Kashmiri saffron strands with local rose water, transforming a classic Gin & Tonic into a golden, botanical masterpiece.',
            ingredients: [
              '60ml Premium London Dry Gin',
              '15ml House-infused Saffron-Rose Syrup',
              '120ml Premium Indian Tonic Water',
              '3-4 Dried organic Jaipur rose buds',
              'A splash of fresh lime juice'
            ],
            instructions: [
              'Fill a crystal highball glass with large cubes of clear ice.',
              'Pour in the gin and our house saffron-rose botanical syrup, stirring gently.',
              'Top up with chilled tonic water.',
              'Garnish with dried rose buds and fine orange zest.'
            ],
            glassware: 'Swarovski Crystal Balloon Goblet',
            garnish: 'Bespoke hand-carved clear ice sphere with an organic marigold frozen inside, crowned with edible 24-karat gold leaf.'
          },
          'whiskey': {
            name: 'The Amber Palace Sour',
            history: 'Originating from the legendary banquets at Amber Fort, this rich, smoke-kissed cocktail merges aged single malt whiskey with warm cardamom-infused wildflower honey, evoking the ambient bonfire warmth of Rajasthani winters.',
            ingredients: [
              '60ml Single Malt Scotch Whiskey (Aged 12 Years)',
              '20ml Cardamom wildflower honey cordial',
              '25ml Freshly squeezed lemon juice',
              '2 dashes of Angostura bitters',
              'Oak smoke cloche infusion'
            ],
            instructions: [
              'Combine single malt, cardamom-honey cordial, and fresh lemon juice in a brass cocktail shaker with ice.',
              'Shake vigorously for 15 seconds until chilled.',
              'Double-strain into a heavy crystal tumbler over a single large ice block.',
              'Infuse under a wood-smoke glass dome cloche for 10 seconds before presentation.'
            ],
            glassware: 'Heavy Double Old Fashioned Crystal Tumbler',
            garnish: 'Bespoke laser-etched clear ice cube with the Barmantra emblem, paired with a burnt cinnamon quill.'
          },
          'vodka': {
            name: 'The Jaipur Marigold Sunset',
            history: 'A celebration of the Golden Hour at Nahargarh Fort. This crisp cocktail infuses premium wheat vodka with hand-pressed sweet lime and Jaipur marigold cordial, capturing the glowing marigold garlands that drape Jaipur\'s grand archways.',
            ingredients: [
              '50ml Premium French Wheat Vodka',
              '20ml Fresh sweet lime (Mousambi) juice',
              '15ml Organic marigold garland cordial',
              '4-5 Fresh garden mint leaves',
              'Sparkling club soda splash'
            ],
            instructions: [
              'Muddle mint leaves lightly with marigold cordial in a mixing glass.',
              'Add vodka, sweet lime juice, and shake with cracked ice.',
              'Strain into an elegant coupe glass.',
              'Top up with a splash of premium club soda.'
            ],
            glassware: 'Delicate Vintage Crystal Coupe',
            garnish: 'Floating organic marigold petal spray and a rim dusted with pink Himalayan salt and dried marigold dust.'
          },
          'tequila': {
            name: 'The Thar Desert Oasis Margarita',
            history: 'An elegant interpretation of Jaipur\'s caravan trails, merging the bold warmth of agave spirits with native desert botanicals and smoked cardamoms, representing the unexpected beauty of a hidden desert oasis.',
            ingredients: [
              '50ml Blanco Tequila (100% Agave)',
              '20ml Fresh lime juice',
              '15ml Agave nectar infused with organic black cardamom',
              'A dash of orange liqueur',
              'Chili-salt rim'
            ],
            instructions: [
              'Rim a coupe glass with a premium blend of sea salt, smoked paprika, and lime zest.',
              'Shake tequila, fresh lime juice, and black cardamom agave nectar with ice.',
              'Strain cleanly into the prepared glass.',
              'Serve immediately at sub-zero temperatures.'
            ],
            glassware: 'Gold-Trimmed Vintage Coupe',
            garnish: 'Thinly sliced dehydrated lime wheel and a single floating dried chili pod.'
          }
        };

        const spiritKey = (spirit || 'gin').toLowerCase();
        let result = fallbacks[spiritKey];
        if (!result) {
          result = fallbacks['gin'];
        }

        // Add user-requested flavor nuances to the recipe if possible
        if (flavorProfile && flavorProfile.trim() !== '') {
          result = {
            ...result,
            history: `${result.history} Infused with subtle, custom notes of ${flavorProfile} to perfectly align with your event palette.`
          };
        }

        return res.json({ success: true, drink: result, source: 'fallback' });
      }

      // Initialize Gemini Client
      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const modelName = 'gemini-3.5-flash';
      const promptText = `You are Kartik Arora, Founder & Master Mixologist of Barmantra, a luxury mobile bar company in Jaipur. 
Create a bespoke, ultra-premium signature cocktail suggestion for a luxury wedding or royal banquet.
Parameters:
- Base Spirit: ${spirit}
- Preferred Flavor Profile/Elements: ${flavorProfile}

The drink must combine high-end international spirits with authentic Rajasthani royal ingredients (e.g. saffron, organic marigolds, cardamom, local rose water, silver leaf, khus, sandalwood, earthen slow-infusions).
Generate a completely custom, beautiful cocktail recipe in JSON format fitting the requested profile. Provide poetic, storytelling historical descriptions that sound incredibly premium and luxurious.

Do NOT include any markdown code blocks (like \`\`\`json) or text other than the raw JSON output.`;

      const response = await ai.models.generateContent({
        model: modelName,
        contents: promptText,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: "Bespoke Royal cocktail name" },
              history: { type: Type.STRING, description: "A poetic, short historical story linking this drink to Rajasthani royalty or luxury Jaipur heritage" },
              ingredients: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "List of ingredients, including premium spirits and traditional Indian botanicals"
              },
              instructions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Step-by-step mixology curation instructions"
              },
              glassware: { type: Type.STRING, description: "Type of elegant glassware recommended (e.g., crystal coupe, gold-trimmed goblet)" },
              garnish: { type: Type.STRING, description: "Bespoke garnish suggestion (e.g. edible gold leaf, clear ice sphere with marigold frozen inside)" }
            },
            required: ["name", "history", "ingredients", "instructions", "glassware", "garnish"]
          }
        }
      });

      const responseText = response.text || '';
      const resultObj = JSON.parse(responseText.trim());
      res.json({ success: true, drink: resultObj, source: 'gemini' });

    } catch (err: any) {
      console.error('Failed to generate AI cocktail:', err);
      res.status(500).json({ error: 'AI mixologist was unable to concoct the beverage formula.' });
    }
  });

  // Admin: Login endpoint (Rate Limited & Hashed Account Verification)
  app.post('/api/admin/login', adminLoginRateLimiter, (req, res) => {
    const { email, password } = req.body;
    const loginEmail = email ? String(email).trim() : 'admin@barmantra.com';
    
    if (!password) {
      return res.status(400).json({ error: 'Password is strictly required.' });
    }

    const user = validateUserCredentials(loginEmail, String(password));

    if (user) {
      const token = createSession(user);
      const actor: DbActor = { id: user.id, email: user.email, name: user.name, role: user.role };
      logAuditAction('LOGIN', 'auth', actor, user.id, `Successful command studio login for ${user.email}`);

      // Set secure session cookie
      res.setHeader('Set-Cookie', `barmantra_session=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400`);
      res.json({ 
        success: true, 
        token, 
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
        message: 'Welcome to Barmantra Royal Command Studio.' 
      });
    } else {
      logAuditAction('LOGIN_FAILED', 'auth', null, undefined, `Failed login attempt for email: ${loginEmail}`);
      res.status(401).json({ error: 'Invalid royal credentials or access key. Intrusion recorded.' });
    }
  });

  // Admin: Logout endpoint
  app.post('/api/admin/logout', (req, res) => {
    const sessionToken = (req as any).cookies.barmantra_session;
    if (sessionToken) {
      destroySession(sessionToken);
    }
    res.setHeader('Set-Cookie', 'barmantra_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly');
    res.json({ success: true, message: 'Logged out successfully.' });
  });

  // Admin: Check Auth Status
  app.get('/api/admin/check-auth', (req, res) => {
    const sessionToken = (req as any).cookies.barmantra_session || req.headers.authorization?.split('Bearer ')[1];
    const session = getSession(sessionToken);
    if (session) {
      res.json({ 
        authenticated: true, 
        user: { id: session.userId, email: session.email, name: session.name, role: session.role } 
      });
    } else {
      res.json({ authenticated: false });
    }
  });

  // Admin SECURED: Get active bookings list
  app.get('/api/admin/bookings', adminAuthMiddleware, (req, res) => {
    res.json(getActiveBookings());
  });

  // Admin SECURED: Update booking status
  app.patch('/api/admin/bookings/:id/status', adminAuthMiddleware, (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const actor = (req as any).user as DbActor;
    
    if (!status || !['Pending', 'Approved', 'Contacted', 'Cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid booking status.' });
    }

    const updated = updateBookingStatus(id, status, actor);
    if (updated) {
      res.json({ success: true, booking: updated });
    } else {
      res.status(404).json({ error: 'Booking proposal not found.' });
    }
  });

  // Admin SECURED: Soft Delete booking (Move to Trash)
  app.delete('/api/admin/bookings/:id', adminAuthMiddleware, (req, res) => {
    const { id } = req.params;
    const actor = (req as any).user as DbActor;
    const deleted = softDeleteBooking(id, actor);
    if (deleted) {
      res.json({ success: true, message: 'Booking moved to trash with restore capability.', booking: deleted });
    } else {
      res.status(404).json({ error: 'Booking proposal not found or already deleted.' });
    }
  });

  // Admin SECURED: Restore soft deleted booking
  app.post('/api/admin/bookings/:id/restore', adminAuthMiddleware, (req, res) => {
    const { id } = req.params;
    const actor = (req as any).user as DbActor;
    const restored = restoreBooking(id, actor);
    if (restored) {
      res.json({ success: true, message: 'Booking restored to active ledger successfully.', booking: restored });
    } else {
      res.status(404).json({ error: 'Booking proposal not found in trash.' });
    }
  });

  // Admin SECURED: Get active contact submissions
  app.get('/api/admin/contacts', adminAuthMiddleware, (req, res) => {
    res.json(getActiveContacts());
  });

  // Admin SECURED: Update contact status
  app.patch('/api/admin/contacts/:id/status', adminAuthMiddleware, (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const actor = (req as any).user as DbActor;

    if (!status || !['Unread', 'Contacted', 'Resolved'].includes(status)) {
      return res.status(400).json({ error: 'Invalid contact status.' });
    }

    const updated = updateContactStatus(id, status, actor);
    if (updated) {
      res.json({ success: true, contact: updated });
    } else {
      res.status(404).json({ error: 'Contact inquiry not found.' });
    }
  });

  // Admin SECURED: Soft Delete contact inquiry
  app.delete('/api/admin/contacts/:id', adminAuthMiddleware, (req, res) => {
    const { id } = req.params;
    const actor = (req as any).user as DbActor;
    const deleted = softDeleteContact(id, actor);
    if (deleted) {
      res.json({ success: true, message: 'Inquiry moved to trash with restore capability.', contact: deleted });
    } else {
      res.status(404).json({ error: 'Contact inquiry not found or already deleted.' });
    }
  });

  // Admin SECURED: Restore soft deleted contact
  app.post('/api/admin/contacts/:id/restore', adminAuthMiddleware, (req, res) => {
    const { id } = req.params;
    const actor = (req as any).user as DbActor;
    const restored = restoreContact(id, actor);
    if (restored) {
      res.json({ success: true, message: 'Contact inquiry restored to active ledger successfully.', contact: restored });
    } else {
      res.status(404).json({ error: 'Contact inquiry not found in trash.' });
    }
  });

  // Admin SECURED: Trash / Soft Deleted items list
  app.get('/api/admin/trash', adminAuthMiddleware, (req, res) => {
    res.json({
      bookings: getDeletedBookings(),
      contacts: getDeletedContacts()
    });
  });

  // Admin SECURED: Audit Logs list
  app.get('/api/admin/audit-logs', adminAuthMiddleware, (req, res) => {
    const db = getDb();
    res.json(db.auditLogs || []);
  });

  // Admin SECURED: Analytics & stats summary
  app.get('/api/admin/stats', adminAuthMiddleware, (req, res) => {
    const activeBookings = getActiveBookings();
    const activeContacts = getActiveContacts();
    
    // Revenue counts based on Approved and Contacted bookings
    let totalRevenueEstimate = 0;
    let pendingCount = 0;
    let activeLeads = activeBookings.length + activeContacts.length;
    
    activeBookings.forEach((b) => {
      if (b.status === 'Approved' || b.status === 'Contacted') {
        totalRevenueEstimate += b.pricingEstimate;
      }
      if (b.status === 'Pending') {
        pendingCount++;
      }
    });

    // Count inquiries status
    let unreadInquiries = activeContacts.filter(c => c.status === 'Unread').length;

    // Popular events counts
    const eventCounts: Record<string, number> = {};
    activeBookings.forEach(b => {
      eventCounts[b.eventType] = (eventCounts[b.eventType] || 0) + 1;
    });

    res.json({
      totalRevenueEstimate,
      activeLeads,
      pendingCount,
      unreadInquiries,
      totalProposals: activeBookings.length,
      totalGeneralInquiries: activeContacts.length,
      eventBreakdown: eventCounts
    });
  });

  // --- DYNAMIC CMS CONTENT API ROUTES ---

  // Public: Get all dynamic site content (Settings, Hero, Services, Portfolio, Team, Testimonials, FAQs)
  app.get('/api/site-content', (req, res) => {
    res.json(getSiteContent());
  });

  // Admin SECURED: Update a specific dynamic CMS section
  app.put('/api/admin/site-content/:section', adminAuthMiddleware, (req, res) => {
    const { section } = req.params;
    const actor = (req as any).user as DbActor;
    const payload = req.body;

    if (!payload) {
      return res.status(400).json({ error: 'CMS payload is required.' });
    }

    const updated = updateSiteSection(section, payload, actor);
    if (updated) {
      res.json({ success: true, message: `Dynamic section '${section}' updated successfully.` });
    } else {
      res.status(400).json({ error: `Invalid CMS section name: ${section}` });
    }
  });

  // --- ADMIN USER & CREDENTIAL MANAGEMENT ROUTES ---

  // Admin SECURED: Get list of all admin users
  app.get('/api/admin/users', adminAuthMiddleware, (req, res) => {
    res.json(getAllUsers());
  });

  // Admin SECURED: Register a new admin/staff user
  app.post('/api/admin/register', adminAuthMiddleware, (req, res) => {
    const { email, password, name, role } = req.body;
    const actor = (req as any).user as DbActor;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are strictly required.' });
    }

    const result = registerAdminUser({ email, password, name, role }, actor);
    if (result.success) {
      res.status(201).json({ success: true, message: 'New admin account successfully registered.', user: result.user });
    } else {
      res.status(400).json({ error: result.error });
    }
  });

  // Admin SECURED: Update credentials/password for an admin account
  app.patch('/api/admin/users/:id/credentials', adminAuthMiddleware, (req, res) => {
    const { id } = req.params;
    const { email, name, password, role } = req.body;
    const actor = (req as any).user as DbActor;

    const result = updateUserCredentials(id, { email, name, password, role }, actor);
    if (result.success) {
      res.json({ success: true, message: 'User credentials updated successfully.' });
    } else {
      res.status(400).json({ error: result.error });
    }
  });


  // Static SEO routes
  app.get('/robots.txt', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'robots.txt'));
  });

  app.get('/sitemap.xml', (req, res) => {
    res.type('application/xml');
    res.sendFile(path.join(process.cwd(), 'public', 'sitemap.xml'));
  });

  // --- VITE DEV OR PRODUCTION STATIC SERVING ---

  if (process.env.NODE_ENV !== 'production') {
    // Mount Vite dev server middleware to let Vite handle HMR/assets in development
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve pre-compiled React build folder directly
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Listen on port 3000
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Barmantra Full-Stack server running on http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to boot full-stack server application:', error);
});
