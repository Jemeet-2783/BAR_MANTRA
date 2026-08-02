/**
 * Barmantra — Luxury Bartending & Mixology Platform API Server
 */


import express from 'express';
import path from 'path';
import crypto from 'crypto';
import helmet from 'helmet';
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
  validateSession,
  destroySession,
  refreshJwtSessionToken,
  validateUserCredentials,
  logAuditAction,
  calculatePricingEstimate,
  getSiteContent,
  updateSiteSection,
  getAllUsers,
  registerAdminUser,
  updateUserCredentials,
  getPricingRules,
  updatePricingRules,
  purgeTrashItem,
  setUserDeactivated,
  forceUserPasswordReset,
  updateBookingPaymentLink,
  updateBookingPaymentSuccess,
  logBookingWhatsAppMessage,
  DbActor
} from './src/server/db.ts';
import { sendWhatsAppNotification } from './src/server/whatsappService.ts';
import { createPaymentOrder, verifyPaymentSignature } from './src/server/paymentService.ts';


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
  max: 30,
  message: 'Too many authentication attempts. Royal Command Studio access restricted for 15 minutes.'
});

// Main server bootstrapping
async function startServer() {
  const app = express();
  const PORT = 3000;

  // Global Helmet Production Security Layer
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:", "blob:", "https://images.unsplash.com", "https://res.cloudinary.com"],
        connectSrc: ["'self'", "https:"],
      }
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true
    },
    frameguard: {
      action: 'deny'
    },
    noSniff: true,
    referrerPolicy: {
      policy: 'strict-origin-when-cross-origin'
    }
  }));

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

  // Admin JWT & CSRF authentication middleware
  const adminAuthMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const sessionToken = (req as any).cookies.barmantra_access_token || (req as any).cookies.barmantra_session || req.headers.authorization?.split('Bearer ')[1];
    const csrfHeaderToken = (req.headers['x-csrf-token'] || req.headers['x-xsrf-token']) as string | undefined;
    const isStateChanging = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method.toUpperCase());

    const { session, error } = validateSession(sessionToken, csrfHeaderToken, isStateChanging);
    
    if (session) {
      (req as any).user = {
        id: session.userId,
        email: session.email,
        name: session.name,
        role: session.role
      } as DbActor;
      (req as any).sessionObj = session;
      next();
    } else {
      if (error && error.includes('CSRF')) {
        res.status(403).json({ error: `Forbidden. ${error}.` });
      } else {
        res.status(401).json({ error: `Unauthorized. ${error || 'Royal session missing or expired.'}` });
      }
    }
  };

  // Superadmin Role Enforcement Middleware
  const superadminOnlyMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const user = (req as any).user as DbActor | undefined;
    if (user && user.role === 'superadmin') {
      next();
    } else {
      res.status(403).json({ error: 'Access denied. Superadmin role privilege strictly required for this action.' });
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
      booking.depositAmount = Math.round(serverCalculatedPrice * 0.30);

      // Async WhatsApp notification dispatch (Client + Admin Alert)
      sendWhatsAppNotification({
        template: 'BOOKING_CONFIRMATION',
        recipientPhone: phone,
        data: {
          name,
          eventType,
          eventDate,
          guestCount: count,
          pricingEstimate: serverCalculatedPrice,
          depositAmount: booking.depositAmount
        }
      }).then(res => {
        logBookingWhatsAppMessage(booking.id, 'BOOKING_CONFIRMATION', phone, res.simulated ? 'Simulated' : 'Sent', res.messageSnippet);
      }).catch(err => {
        logBookingWhatsAppMessage(booking.id, 'BOOKING_CONFIRMATION', phone, 'Failed', err.message);
      });

      const adminPhone = process.env.WHATSAPP_ADMIN_NUMBER || '+919829012345';
      sendWhatsAppNotification({
        template: 'ADMIN_NEW_BOOKING_ALERT',
        recipientPhone: adminPhone,
        data: {
          name,
          eventType,
          eventDate,
          guestCount: count,
          pricingEstimate: serverCalculatedPrice
        }
      }).catch(() => {});

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

  // Public: Get booking pay info for client payment checkout view
  app.get('/api/public/bookings/:id/pay-info', (req, res) => {
    try {
      const db = getDb();
      const booking = db.bookings.find(b => b.id === req.params.id && !b.deletedAt);
      if (!booking) {
        return res.status(404).json({ error: 'Booking proposal not found.' });
      }

      const depositAmount = booking.depositAmount || Math.round(booking.pricingEstimate * 0.30);

      res.json({
        id: booking.id,
        name: booking.name,
        phone: booking.phone,
        email: booking.email,
        eventType: booking.eventType,
        eventDate: booking.eventDate,
        guestCount: booking.guestCount,
        pricingEstimate: booking.pricingEstimate,
        depositAmount,
        paymentStatus: booking.paymentStatus || 'Unpaid',
        paymentLink: booking.paymentLink,
        paidAt: booking.paidAt,
        paymentTransactionId: booking.paymentTransactionId,
        razorpayKeyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_barmantra_sandbox'
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to retrieve booking payment metadata.' });
    }
  });

  // Public/Webhook: Verify & complete deposit payment
  app.post('/api/payments/verify', async (req, res) => {
    try {
      const { bookingId, transactionId, orderId, signature, amount, gateway } = req.body;
      if (!bookingId || !transactionId) {
        return res.status(400).json({ error: 'Booking ID and transaction ID are required.' });
      }

      const isValid = verifyPaymentSignature(orderId || 'order_sb_', transactionId, signature || 'sig_sandbox_');
      if (!isValid) {
        return res.status(400).json({ error: 'Payment signature verification failed.' });
      }

      const db = getDb();
      const booking = db.bookings.find(b => b.id === bookingId);
      if (!booking) {
        return res.status(404).json({ error: 'Booking proposal not found.' });
      }

      const paidAmount = Number(amount) || booking.depositAmount || Math.round(booking.pricingEstimate * 0.30);
      const updatedBooking = updateBookingPaymentSuccess(bookingId, transactionId, paidAmount, gateway || 'Sandbox');

      if (updatedBooking) {
        // Send WhatsApp Payment Receipt Confirmation
        sendWhatsAppNotification({
          template: 'PAYMENT_RECEIPT_CONFIRMATION',
          recipientPhone: booking.phone,
          data: {
            name: booking.name,
            paidAmount,
            transactionId,
            bookingId
          }
        }).then(waRes => {
          logBookingWhatsAppMessage(bookingId, 'PAYMENT_RECEIPT_CONFIRMATION', booking.phone, waRes.simulated ? 'Simulated' : 'Sent', waRes.messageSnippet);
        }).catch(() => {});
      }

      res.json({
        success: true,
        message: 'Payment successfully verified and recorded.',
        booking: updatedBooking
      });
    } catch (err: any) {
      console.error('Payment verification failure:', err);
      res.status(500).json({ error: 'Payment processing error.' });
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

  function setAuthCookies(res: express.Response, accessToken: string, refreshToken: string) {
    const isProd = process.env.NODE_ENV === 'production';
    const secureFlag = isProd ? '; Secure' : '';
    res.setHeader('Set-Cookie', [
      `barmantra_access_token=${accessToken}; Path=/; HttpOnly; SameSite=Strict; Max-Age=900${secureFlag}`,
      `barmantra_refresh_token=${refreshToken}; Path=/; HttpOnly; SameSite=Strict; Max-Age=28800${secureFlag}`,
      `barmantra_session=${accessToken}; Path=/; HttpOnly; SameSite=Strict; Max-Age=28800${secureFlag}`
    ]);
  }

  // Admin: Login endpoint (Rate Limited & Hashed Account Verification)
  app.post('/api/admin/login', adminLoginRateLimiter, (req, res) => {
    const { email, password } = req.body;
    const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.socket.remoteAddress || '127.0.0.1';
    const userAgent = (req.headers['user-agent'] as string) || 'Unknown Client';
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Both email and password are strictly required.' });
    }

    const loginEmail = String(email).trim().toLowerCase();
    const user = validateUserCredentials(loginEmail, String(password));

    if (user) {
      const { token, refreshToken, csrfToken, expiresAt } = createSession(user);
      const actor: DbActor = { id: user.id, email: user.email, name: user.name, role: user.role };
      logAuditAction('LOGIN', 'auth', actor, user.id, `Successful command studio login for ${user.email}`, undefined, undefined, { ip: clientIp, userAgent });

      const isDefaultPass = (password === 'barmantra123' || password === 'staff123');

      // Set httpOnly secure JWT cookies
      setAuthCookies(res, token, refreshToken);

      res.json({ 
        success: true, 
        token,
        refreshToken,
        csrfToken,
        requiresPasswordChange: isDefaultPass,
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
        message: isDefaultPass 
          ? 'Default password detected. Please change your password to secure your admin account.'
          : 'Welcome to Barmantra Royal Command Studio.' 
      });
    } else {
      logAuditAction('LOGIN_FAILED', 'auth', null, undefined, `Failed login attempt for email: ${loginEmail}`, undefined, undefined, { ip: clientIp, userAgent });
      res.status(401).json({ error: 'Invalid admin credentials. Access denied.' });
    }
  });

  // Admin: JWT Access Token Refresh Endpoint
  app.post('/api/admin/refresh', (req, res) => {
    const refreshToken = (req as any).cookies?.barmantra_refresh_token || req.body?.refreshToken;
    const result = refreshJwtSessionToken(refreshToken);

    if (result.success && result.accessToken && result.refreshToken) {
      setAuthCookies(res, result.accessToken, result.refreshToken);
      res.json({
        success: true,
        token: result.accessToken,
        refreshToken: result.refreshToken,
        csrfToken: result.csrfToken,
        user: result.user
      });
    } else {
      res.status(401).json({ error: result.error || 'Refresh token invalid or session expired.' });
    }
  });

  // Admin SECURED: Password Change Endpoint
  app.post('/api/admin/change-password', adminAuthMiddleware, (req, res) => {
    const { newPassword } = req.body;
    const actor = (req as any).user as DbActor;

    if (!newPassword || String(newPassword).length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long.' });
    }

    if (newPassword === 'barmantra123' || newPassword === 'staff123') {
      return res.status(400).json({ error: 'Cannot use a generic default password. Please choose a custom secure password.' });
    }

    const result = forceUserPasswordReset(actor.id, String(newPassword), actor);
    if (result.success) {
      res.json({ success: true, message: 'Password updated successfully. Account is now secured.' });
    } else {
      res.status(400).json({ error: result.error || 'Failed to update password.' });
    }
  });

  // Public: Admin Access Sign-Up / Access Request
  app.post('/api/admin/request-access', (req, res) => {
    const { name, email, role, reason } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required to request admin access.' });
    }

    const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.socket.remoteAddress || '127.0.0.1';
    logAuditAction('LOGIN_FAILED', 'auth', null, undefined, `Admin access request from ${email} (${name})`, undefined, undefined, { ip: clientIp });

    res.json({
      success: true,
      message: 'Access request submitted. A Superadmin will review your application in the Admin Users panel.'
    });
  });

  // Admin: Logout endpoint
  app.post('/api/admin/logout', (req, res) => {
    const sessionToken = (req as any).cookies?.barmantra_access_token || (req as any).cookies?.barmantra_session || (req as any).cookies?.barmantra_refresh_token || req.headers.authorization?.split('Bearer ')[1];
    if (sessionToken) {
      const session = getSession(sessionToken);
      if (session) {
        const actor: DbActor = { id: session.userId, email: session.email, name: session.name, role: session.role };
        logAuditAction('LOGIN', 'auth', actor, session.userId, `Admin logged out: ${session.email}`);
      }
      destroySession(sessionToken);
    }
    res.setHeader('Set-Cookie', [
      'barmantra_access_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Strict',
      'barmantra_refresh_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Strict',
      'barmantra_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Strict'
    ]);
    res.json({ success: true, message: 'Logged out successfully.' });
  });

  // Admin: Check Auth Status
  app.get('/api/admin/check-auth', (req, res) => {
    const sessionToken = (req as any).cookies?.barmantra_access_token || (req as any).cookies?.barmantra_session || req.headers.authorization?.split('Bearer ')[1];
    const { session } = validateSession(sessionToken, undefined, false);
    if (session) {
      res.json({ 
        authenticated: true, 
        csrfToken: session.csrfToken,
        user: { id: session.userId, email: session.email, name: session.name, role: session.role } 
      });
    } else {
      const refreshToken = (req as any).cookies?.barmantra_refresh_token;
      if (refreshToken) {
        const refreshed = refreshJwtSessionToken(refreshToken);
        if (refreshed.success && refreshed.accessToken && refreshed.refreshToken) {
          setAuthCookies(res, refreshed.accessToken, refreshed.refreshToken);
          return res.json({
            authenticated: true,
            csrfToken: refreshed.csrfToken,
            user: refreshed.user
          });
        }
      }
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
      // If status changed to Approved, automatically dispatch payment request if payment link exists or generate sandbox payment link
      if (status === 'Approved') {
        const originUrl = `${req.protocol}://${req.get('host')}`;
        const depositAmount = updated.depositAmount || Math.round(updated.pricingEstimate * 0.30);
        createPaymentOrder({
          bookingId: updated.id,
          amount: depositAmount,
          customerName: updated.name,
          customerEmail: updated.email,
          customerPhone: updated.phone,
          description: `Barmantra Royal Event Deposit (30%) - ${updated.eventType}`,
          originUrl
        }).then(payOrder => {
          updateBookingPaymentLink(updated.id, payOrder.paymentLink, payOrder.gateway, actor);
          sendWhatsAppNotification({
            template: 'PROPOSAL_APPROVED_PAYMENT_REQUEST',
            recipientPhone: updated.phone,
            data: {
              name: updated.name,
              eventType: updated.eventType,
              eventDate: updated.eventDate,
              depositAmount,
              paymentLink: payOrder.paymentLink
            }
          }).then(waRes => {
            logBookingWhatsAppMessage(updated.id, 'PROPOSAL_APPROVED_PAYMENT_REQUEST', updated.phone, waRes.simulated ? 'Simulated' : 'Sent', waRes.messageSnippet, actor);
          }).catch(() => {});
        }).catch(() => {});
      }

      res.json({ success: true, booking: updated });
    } else {
      res.status(404).json({ error: 'Booking proposal not found.' });
    }
  });

  // Admin SECURED: Generate Payment Link
  app.post('/api/admin/bookings/:id/payment-link', adminAuthMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const actor = (req as any).user as DbActor;
      const db = getDb();
      const booking = db.bookings.find(b => b.id === id && !b.deletedAt);
      
      if (!booking) {
        return res.status(404).json({ error: 'Booking proposal not found.' });
      }

      const originUrl = `${req.protocol}://${req.get('host')}`;
      const depositAmount = booking.depositAmount || Math.round(booking.pricingEstimate * 0.30);

      const payOrder = await createPaymentOrder({
        bookingId: booking.id,
        amount: depositAmount,
        customerName: booking.name,
        customerEmail: booking.email,
        customerPhone: booking.phone,
        description: `Barmantra Royal Event Deposit - ${booking.eventType}`,
        originUrl
      });

      const updated = updateBookingPaymentLink(booking.id, payOrder.paymentLink, payOrder.gateway, actor);

      // Auto dispatch WhatsApp message with payment link
      sendWhatsAppNotification({
        template: 'PROPOSAL_APPROVED_PAYMENT_REQUEST',
        recipientPhone: booking.phone,
        data: {
          name: booking.name,
          eventType: booking.eventType,
          eventDate: booking.eventDate,
          depositAmount,
          paymentLink: payOrder.paymentLink
        }
      }).then(waRes => {
        logBookingWhatsAppMessage(booking.id, 'PROPOSAL_APPROVED_PAYMENT_REQUEST', booking.phone, waRes.simulated ? 'Simulated' : 'Sent', waRes.messageSnippet, actor);
      }).catch(() => {});

      res.json({
        success: true,
        message: 'Payment link generated and dispatched via WhatsApp.',
        paymentOrder: payOrder,
        booking: updated
      });
    } catch (err: any) {
      console.error('Failed to generate payment link:', err);
      res.status(500).json({ error: 'Payment link generation failed.' });
    }
  });

  // Admin SECURED: Send Manual / Template WhatsApp Message
  app.post('/api/admin/bookings/:id/send-whatsapp', adminAuthMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const { template, customMessage } = req.body;
      const actor = (req as any).user as DbActor;
      const db = getDb();
      const booking = db.bookings.find(b => b.id === id && !b.deletedAt);

      if (!booking) {
        return res.status(404).json({ error: 'Booking proposal not found.' });
      }

      const depositAmount = booking.depositAmount || Math.round(booking.pricingEstimate * 0.30);
      const originUrl = `${req.protocol}://${req.get('host')}`;
      const paymentLink = booking.paymentLink || `${originUrl}/#/pay/${booking.id}`;

      const waRes = await sendWhatsAppNotification({
        template: template || 'CUSTOM',
        recipientPhone: booking.phone,
        data: {
          name: booking.name,
          eventType: booking.eventType,
          eventDate: booking.eventDate,
          guestCount: booking.guestCount,
          pricingEstimate: booking.pricingEstimate,
          depositAmount,
          paymentLink,
          paidAmount: booking.paidAt ? depositAmount : undefined,
          transactionId: booking.paymentTransactionId,
          bookingId: booking.id,
          customMessage
        }
      });

      const updated = logBookingWhatsAppMessage(
        booking.id, 
        template || 'CUSTOM', 
        booking.phone, 
        waRes.simulated ? 'Simulated' : 'Sent', 
        waRes.messageSnippet,
        actor
      );

      res.json({
        success: true,
        message: `WhatsApp message dispatched (${waRes.simulated ? 'Simulated' : 'Live'}).`,
        result: waRes,
        booking: updated
      });
    } catch (err: any) {
      console.error('WhatsApp send error:', err);
      res.status(500).json({ error: 'WhatsApp dispatch failed.' });
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

  // Admin SECURED: Cloudinary Image Upload Endpoint
  app.post('/api/admin/upload-image', adminAuthMiddleware, async (req, res) => {
    try {
      const { image } = req.body;
      if (!image) {
        return res.status(400).json({ error: 'Image data is strictly required.' });
      }

      // Check server-side image size limit (5MB base64 ~ 7MB string)
      if (image.length > 7 * 1024 * 1024) {
        return res.status(400).json({ error: 'Image file size exceeds the 5MB server limit.' });
      }

      const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
      const apiKey = process.env.CLOUDINARY_API_KEY;
      const apiSecret = process.env.CLOUDINARY_API_SECRET;

      if (cloudName && apiKey && apiSecret) {
        // Upload to official Cloudinary account via REST API
        const timestamp = Math.floor(Date.now() / 1000);
        const folder = 'barmantra_assets';
        const strToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
        const signature = crypto.createHash('sha1').update(strToSign).digest('hex');

        const formData = new URLSearchParams();
        formData.append('file', image);
        formData.append('timestamp', String(timestamp));
        formData.append('api_key', apiKey);
        formData.append('signature', signature);
        formData.append('folder', folder);

        const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          body: formData
        });

        const cloudData = await cloudRes.json();
        if (cloudRes.ok && cloudData.secure_url) {
          return res.json({
            success: true,
            url: cloudData.secure_url,
            public_id: cloudData.public_id
          });
        }
      }

      // High-fidelity fallback storage if Cloudinary keys are not configured in environment
      const mockPublicId = `barmantra_asset_${Date.now()}`;
      res.json({
        success: true,
        url: image.startsWith('data:') ? image : `https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80`,
        public_id: mockPublicId
      });

    } catch (err: any) {
      console.error('Image upload failed:', err);
      res.status(500).json({ error: 'Server failed to process image upload.' });
    }
  });

  // Admin SECURED: Cloudinary Image Asset Permanent Removal Endpoint
  app.delete('/api/admin/delete-image', adminAuthMiddleware, async (req, res) => {
    try {
      const { public_id } = req.body;
      if (!public_id) {
        return res.status(400).json({ error: 'Cloudinary public_id is required.' });
      }

      const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
      const apiKey = process.env.CLOUDINARY_API_KEY;
      const apiSecret = process.env.CLOUDINARY_API_SECRET;

      if (cloudName && apiKey && apiSecret) {
        const timestamp = Math.floor(Date.now() / 1000);
        const strToSign = `public_id=${public_id}&timestamp=${timestamp}${apiSecret}`;
        const signature = crypto.createHash('sha1').update(strToSign).digest('hex');

        const formData = new URLSearchParams();
        formData.append('public_id', public_id);
        formData.append('timestamp', String(timestamp));
        formData.append('api_key', apiKey);
        formData.append('signature', signature);

        await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
          method: 'POST',
          body: formData
        });
      }

      const actor = (req as any).user as DbActor;
      logAuditAction('PURGE', 'cms', actor, public_id, `Permanently destroyed Cloudinary image asset: ${public_id}`);

      res.json({ success: true, message: 'Image asset destroyed on Cloudinary.' });
    } catch (err: any) {
      console.error('Failed to destroy Cloudinary image:', err);
      res.status(500).json({ error: 'Failed to destroy Cloudinary asset.' });
    }
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

  // Public & Admin: Get dynamic pricing rules
  app.get('/api/pricing/rules', (req, res) => {
    res.json(getPricingRules());
  });

  // Admin SECURED (Superadmin Only): Update dynamic pricing rules
  app.put('/api/admin/pricing/rules', adminAuthMiddleware, superadminOnlyMiddleware, (req, res) => {
    const actor = (req as any).user as DbActor;
    const { eventTypes, setupFee } = req.body;
    if (!eventTypes || !Array.isArray(eventTypes)) {
      return res.status(400).json({ error: 'eventTypes array is required.' });
    }
    const success = updatePricingRules({ eventTypes, setupFee: Number(setupFee || 25000) }, actor);
    if (success) {
      res.json({ success: true, message: 'Dynamic pricing rules updated successfully.' });
    } else {
      res.status(500).json({ error: 'Failed to save pricing rules.' });
    }
  });

  // Admin SECURED (Superadmin Only): Permanent purge from Trash Archive
  app.delete('/api/admin/trash/purge/:type/:id', adminAuthMiddleware, superadminOnlyMiddleware, (req, res) => {
    const actor = (req as any).user as DbActor;
    const { type, id } = req.params;
    if (type !== 'booking' && type !== 'contact') {
      return res.status(400).json({ error: 'Invalid entity type for purge.' });
    }
    const success = purgeTrashItem(type, id, actor);
    if (success) {
      res.json({ success: true, message: `Record ${id} permanently purged from database.` });
    } else {
      res.status(404).json({ error: 'Record not found in trash archive.' });
    }
  });

  // Admin SECURED (Superadmin Only): Deactivate / Reactivate User Account
  app.patch('/api/admin/users/:id/deactivate', adminAuthMiddleware, superadminOnlyMiddleware, (req, res) => {
    const actor = (req as any).user as DbActor;
    const { id } = req.params;
    const { isDeactivated } = req.body;
    const result = setUserDeactivated(id, Boolean(isDeactivated), actor);
    if (result.success) {
      res.json({ success: true, message: `User account ${isDeactivated ? 'deactivated' : 'reactivated'} successfully.` });
    } else {
      res.status(400).json({ error: result.error });
    }
  });

  // Admin SECURED (Superadmin Only): Force Password Reset for User Account
  app.post('/api/admin/users/:id/reset-password', adminAuthMiddleware, superadminOnlyMiddleware, (req, res) => {
    const actor = (req as any).user as DbActor;
    const { id } = req.params;
    const { newPassword } = req.body;
    if (!newPassword || newPassword.trim().length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }
    const result = forceUserPasswordReset(id, newPassword, actor);
    if (result.success) {
      res.json({ success: true, message: 'Password reset forced successfully.' });
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
