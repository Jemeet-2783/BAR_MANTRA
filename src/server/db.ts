/**
 * Barmantra — Database Ledger & OWASP Auth Engine
 */


import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from './config.ts';
import { withDbLock } from './dbWriteQueue.ts';



export type UserRole = 'superadmin' | 'admin' | 'staff';

export interface DbUser {
  id: string;
  email: string;
  passwordHash: string;
  salt: string;
  name: string;
  role: UserRole;
  createdAt: string;
  isDeactivated?: boolean;
  lastLoginIp?: string;
}

export interface DbBooking {
  id: string;
  name: string;
  phone: string;
  email: string;
  eventType: string;
  eventDate: string;
  guestCount: number;
  message: string;
  pricingEstimate: number;
  depositAmount?: number;
  paymentStatus?: 'Unpaid' | 'Deposit_Paid' | 'Fully_Paid' | 'Refunded';
  paymentGateway?: 'Razorpay' | 'Stripe' | 'Sandbox';
  paymentLink?: string;
  paymentTransactionId?: string;
  paidAt?: string;
  whatsappStatus?: 'Pending' | 'Sent' | 'Failed';
  whatsappLogs?: {
    id: string;
    timestamp: string;
    template: string;
    recipient: string;
    status: 'Sent' | 'Failed' | 'Simulated';
    messageSnippet: string;
  }[];
  status: 'Pending' | 'Approved' | 'Contacted' | 'Cancelled';
  createdAt: string;
  deletedAt?: string;
  deletedBy?: string;
}


export interface DbContact {
  id: string;
  name: string;
  phone: string;
  email: string;
  eventType: string;
  eventDate: string;
  guestCount: number;
  message: string;
  status: 'Unread' | 'Contacted' | 'Resolved';
  createdAt: string;
  deletedAt?: string;
  deletedBy?: string;
}

export interface DbSession {
  token: string;
  refreshToken?: string;
  userId: string;
  email: string;
  role: UserRole;
  name: string;
  expiresAt: string; // Absolute expiry (8 hours)
  createdAt: string;
  lastActiveAt: string; // Idle timeout (30 mins)
  csrfToken: string;
}

export interface DbActor {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface SiteSettings {
  siteTitle: string;
  heroHeadline: string;
  heroSubheadline: string;
  phone: string;
  email: string;
  address: string;
  tagline: string;
  whatsappNumber: string;
}

export interface HeroSlide {
  id: string;
  image: string;
  title: string;
}

export interface EventPricingRule {
  eventType: string;
  name: string;
  basePrice: number;
  perGuestRate: number;
}

export interface PricingRules {
  eventTypes: EventPricingRule[];
  setupFee: number;
}

export interface DbAuditLogEntry {
  id: string;
  timestamp: string;
  action: 'STATUS_UPDATE' | 'SOFT_DELETE' | 'RESTORE' | 'LOGIN' | 'LOGIN_FAILED' | 'CMS_UPDATE' | 'USER_CREATE' | 'CREDENTIALS_UPDATE' | 'PRICING_UPDATE' | 'PURGE' | 'USER_DEACTIVATE' | 'TOKEN_REFRESH' | 'PAYMENT_GENERATED' | 'PAYMENT_RECEIVED' | 'WHATSAPP_SENT' | 'WHATSAPP_FAILED';

  entityType: 'booking' | 'contact' | 'auth' | 'cms' | 'user' | 'pricing';
  entityId?: string;
  actor: DbActor | null;
  details?: string;
  beforeState?: any;
  afterState?: any;
}

export interface DatabaseSchema {
  users: DbUser[];
  bookings: DbBooking[];
  contacts: DbContact[];
  sessions: DbSession[];
  auditLogs: DbAuditLogEntry[];
  siteSettings?: SiteSettings;
  heroSlides?: HeroSlide[];
  services?: any[];
  portfolioItems?: any[];
  team?: any[];
  testimonials?: any[];
  faqs?: any[];
  pricingRules?: PricingRules;
}

const DB_FILE_PATH = path.resolve(process.cwd(), 'db.json');

// OWASP Recommended Cryptographic Password Hashing (600,000 Iterations PBKDF2-SHA256)
const PBKDF2_ITERATIONS = 600000;
const PBKDF2_ALGO = 'sha256';
const PBKDF2_KEYLEN = 64;
const HASH_PREFIX_V2 = '$pbkdf2$v2$600000$sha256$';

export function hashPassword(password: string, saltHex?: string): { hash: string; salt: string } {
  const salt = saltHex || crypto.randomBytes(16).toString('hex');
  const rawHash = crypto.pbkdf2Sync(password, salt, PBKDF2_ITERATIONS, PBKDF2_KEYLEN, PBKDF2_ALGO).toString('hex');
  const hash = `${HASH_PREFIX_V2}${rawHash}`;
  return { hash, salt };
}

export function verifyPassword(password: string, hash: string, salt: string): { isMatch: boolean; needsRehash: boolean } {
  if (hash.startsWith(HASH_PREFIX_V2)) {
    const rawHash = hash.replace(HASH_PREFIX_V2, '');
    const testHash = crypto.pbkdf2Sync(password, salt, PBKDF2_ITERATIONS, PBKDF2_KEYLEN, PBKDF2_ALGO).toString('hex');
    const isMatch = crypto.timingSafeEqual(Buffer.from(testHash, 'hex'), Buffer.from(rawHash, 'hex'));
    return { isMatch, needsRehash: false };
  } else {
    // Legacy 10,000 iteration PBKDF2-SHA512 verification fallback
    const testHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    const isMatch = crypto.timingSafeEqual(Buffer.from(testHash, 'hex'), Buffer.from(hash, 'hex'));
    return { isMatch, needsRehash: isMatch };
  }
}

// Initial default superadmin setup
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'barmantra123';
const defaultAdminHash = hashPassword(DEFAULT_ADMIN_PASSWORD);
const defaultStaffHash = hashPassword('staff123');

const INITIAL_USERS: DbUser[] = [
  {
    id: 'usr-superadmin',
    email: 'admin@barmantra.com',
    passwordHash: defaultAdminHash.hash,
    salt: defaultAdminHash.salt,
    name: 'Kartik Arora (Master Mixologist)',
    role: 'superadmin',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'usr-staff-1',
    email: 'events@barmantra.com',
    passwordHash: defaultStaffHash.hash,
    salt: defaultStaffHash.salt,
    name: 'Jaipur Events Team',
    role: 'staff',
    createdAt: '2026-01-01T00:00:00.000Z'
  }
];

export const DEFAULT_PRICING_RULES: PricingRules = {
  setupFee: 25000,
  eventTypes: [
    { eventType: 'wedding-bar', name: 'Royal Wedding Bar Curation', basePrice: 25000, perGuestRate: 2500 },
    { eventType: 'corporate-bar', name: 'Corporate Lounges & Brand Bars', basePrice: 25000, perGuestRate: 1800 },
    { eventType: 'private-bar', name: 'Boutique Private Soirée Bar', basePrice: 25000, perGuestRate: 1500 },
    { eventType: 'flair-bar', name: 'Interactive Flair Bar Show', basePrice: 25000, perGuestRate: 2000 },
    { eventType: 'masterclass', name: 'Private Cocktail Masterclass', basePrice: 20000, perGuestRate: 1200 }
  ]
};

// Helper to calculate realistic luxury beverage pricing estimate
export function calculatePricingEstimate(eventType: string, guestCount: number): number {
  const db = getDb();
  const rules = db.pricingRules || DEFAULT_PRICING_RULES;
  const normalizedType = eventType ? eventType.toLowerCase() : '';
  const rule = rules.eventTypes.find(r => normalizedType.includes(r.eventType.toLowerCase()) || r.eventType.toLowerCase().includes(normalizedType));

  const perGuestRate = rule ? rule.perGuestRate : 1500;
  const basePrice = rule ? rule.basePrice : (rules.setupFee !== undefined ? rules.setupFee : 25000);

  return basePrice + (guestCount * perGuestRate);
}

// Initial seed data to populate the admin panel beautifully on first run
const SEED_DATA: DatabaseSchema = {
  users: INITIAL_USERS,
  bookings: [
    {
      id: "b-1",
      name: "Aditya Singhania",
      phone: "+91 98290 12345",
      email: "aditya@singhaniagroup.com",
      eventType: "wedding-bar",
      eventDate: "2026-11-20",
      guestCount: 450,
      message: "Royal Wedding Cocktail Bar at Samode Palace. We require the premium Saffron Court theme with custom molecular mixology and 4 tandem fire-flair bartenders.",
      pricingEstimate: calculatePricingEstimate("wedding-bar", 450),
      status: "Approved",
      createdAt: "2026-07-15T14:32:00.000Z"
    },
    {
      id: "b-2",
      name: "Preeti Mehra",
      phone: "+91 91160 88432",
      email: "preeti.mehra@techventures.in",
      eventType: "corporate-bar",
      eventDate: "2026-09-05",
      guestCount: 200,
      message: "Annual Leadership Summit craft gin and martini lounge. Venue is Rambagh Palace Ballroom. Clean branding integration is critical.",
      pricingEstimate: calculatePricingEstimate("corporate-bar", 200),
      status: "Contacted",
      createdAt: "2026-07-16T09:15:00.000Z"
    },
    {
      id: "b-3",
      name: "Rajesh Sharda",
      phone: "+91 94140 76543",
      email: "sharda.hotels@outlook.com",
      eventType: "private-bar",
      eventDate: "2026-12-25",
      guestCount: 120,
      message: "Golden Anniversary Celebration. Needs a golden sitar whiskey lounge bar styled with deep marigolds and premium single malts for elite guests.",
      pricingEstimate: calculatePricingEstimate("private-bar", 120),
      status: "Pending",
      createdAt: "2026-07-18T18:40:00.000Z"
    },
    {
      id: "b-4",
      name: "Kabir Oberoi",
      phone: "+91 99990 44321",
      email: "kabir@oberoicreative.com",
      eventType: "flair-bar",
      eventDate: "2026-10-12",
      guestCount: 300,
      message: "Luxury Car Launch Cocktail Bar at JECC Jaipur. Highly interactive draft bars with dynamic lights, smoke effects, and tandem flair performance.",
      pricingEstimate: calculatePricingEstimate("flair-bar", 300),
      status: "Pending",
      createdAt: "2026-07-19T02:10:00.000Z"
    }
  ],
  contacts: [
    {
      id: "c-1",
      name: "Ananya Sen",
      phone: "+91 98300 45678",
      email: "ananya.sen@gmail.com",
      eventType: "wedding-bar",
      eventDate: "2026-12-05",
      guestCount: 350,
      message: "Hello Barmantra Team! We are hosting our wedding at Taj Jai Mahal Palace. Do you provide customized glassware, printed custom menus, and themed hostesses?",
      status: "Resolved",
      createdAt: "2026-07-14T11:05:00.000Z"
    },
    {
      id: "c-2",
      name: "Vikram Rathore",
      phone: "+91 97840 11223",
      email: "vikram@rathoreheritage.com",
      eventType: "bar-styling",
      eventDate: "2026-08-18",
      guestCount: 80,
      message: "Enquiring about a custom-crafted portable bar for a private sufi night at our ancestral haveli in Raja Park. Please send themes catalog.",
      status: "Contacted",
      createdAt: "2026-07-17T15:20:00.000Z"
    },
    {
      id: "c-3",
      name: "Meera Deshmukh",
      phone: "+91 88888 77777",
      email: "meera.d@vogueevents.co.in",
      eventType: "other",
      eventDate: "2026-10-30",
      guestCount: 600,
      message: "We are wedding planners curating a large royal wedding sequence. We'd love to partner with Barmantra for the 3 major nights. Requesting a professional meeting.",
      status: "Unread",
      createdAt: "2026-07-19T03:45:00.000Z"
    }
  ],
  sessions: [],
  auditLogs: []
};

const DEFAULT_SITE_SETTINGS: SiteSettings = {
  siteTitle: 'Barmantra | Luxury Mobile Bar & Mixology Jaipur',
  heroHeadline: 'Luxury Bar Experiences',
  heroSubheadline: 'We weave royal Rajasthani heritage, modern artisanal mixology, and immaculate bar showmanship into high-end celebrations that linger in memories forever.',
  phone: '+91 98290 12345',
  email: 'concierge@barmantra.com',
  address: 'Barmantra Royal Studio, Raja Park, Jaipur, Rajasthan 302004',
  tagline: 'The Premiere Luxury Bartending Service of Jaipur',
  whatsappNumber: '+919829012345'
};

const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    id: 'hs-1',
    image: 'https://image.wedmegood.com/resized/1000X/uploads/member/1146941/1739044123_image7938.jpg',
    title: 'Royal Wedding Bar Curation',
  },
  {
    id: 'hs-2',
    image: 'https://image.wedmegood.com/resized/1000X/uploads/member/1146941/1739044114_image9381.jpg',
    title: 'Exquisite Mixology Showcase',
  },
  {
    id: 'hs-3',
    image: 'https://image.wedmegood.com/resized/1000X/uploads/member/1146941/1739044120_image3892.jpg',
    title: 'Heritage Palace Lounge Bar',
  },
];

// Initialize or Read Database
export function getDb(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_FILE_PATH)) {
      saveDb(SEED_DATA);
      return SEED_DATA;
    }
    const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8');
    const data: DatabaseSchema = JSON.parse(raw);
    
    // Schema migrations for backward compatibility
    if (!data.users || data.users.length === 0) {
      data.users = INITIAL_USERS;
    }
    if (!data.auditLogs) {
      data.auditLogs = [];
    }
    if (!data.siteSettings) {
      data.siteSettings = DEFAULT_SITE_SETTINGS;
    }
    if (!data.heroSlides) {
      data.heroSlides = DEFAULT_HERO_SLIDES;
    }
    if (!data.pricingRules) {
      data.pricingRules = DEFAULT_PRICING_RULES;
    }

    return data;
  } catch (error) {
    console.error('Error reading database file, returning fallback seed data:', error);
    return SEED_DATA;
  }
}

// Save Database atomically
export function saveDb(data: DatabaseSchema): void {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    try {
      const tempPath = `${DB_FILE_PATH}.tmp`;
      fs.writeFileSync(tempPath, jsonString, 'utf-8');
      fs.renameSync(tempPath, DB_FILE_PATH);
    } catch {
      fs.writeFileSync(DB_FILE_PATH, jsonString, 'utf-8');
    }
  } catch (error) {
    console.error('Failed to write database file:', error);
  }
}

function appendAuditLog(
  db: DatabaseSchema,
  action: DbAuditLogEntry['action'],
  entityType: DbAuditLogEntry['entityType'],
  actor: DbActor | null,
  entityId?: string,
  details?: string,
  beforeState?: any,
  afterState?: any,
  meta?: { ip?: string; userAgent?: string }
): void {
  let detailStr = details || '';
  if (meta?.ip) {
    detailStr += ` [IP: ${meta.ip}]`;
  }
  if (meta?.userAgent) {
    detailStr += ` [UA: ${meta.userAgent.slice(0, 80)}]`;
  }

  const entry: DbAuditLogEntry = {
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    action,
    entityType,
    entityId,
    actor,
    details: detailStr,
    beforeState,
    afterState
  };
  db.auditLogs.unshift(entry);
  if (db.auditLogs.length > 500) {
    db.auditLogs = db.auditLogs.slice(0, 500);
  }
}

// Audit Logging helper
export function logAuditAction(
  action: DbAuditLogEntry['action'],
  entityType: DbAuditLogEntry['entityType'],
  actor: DbActor | null,
  entityId?: string,
  details?: string,
  beforeState?: any,
  afterState?: any,
  meta?: { ip?: string; userAgent?: string }
): Promise<void> {
  return withDbLock(db => {
    appendAuditLog(db, action, entityType, actor, entityId, details, beforeState, afterState, meta);
  });
}


// User & Authentication Helpers
export function findUserByEmail(email: string): DbUser | undefined {
  const db = getDb();
  return db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

export function validateUserCredentials(email: string, password: string): DbUser | null {
  const db = getDb();
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return null;
  if (user.isDeactivated) return null;

  const { isMatch, needsRehash } = verifyPassword(password, user.passwordHash, user.salt);
  if (!isMatch) return null;

  if (needsRehash) {
    console.log(`[OWASP SECURITY UPGRADE]: Transparently migrating password hash for user ${user.email} to 600,000 PBKDF2-SHA256 iterations.`);
    const updated = hashPassword(password);
    user.passwordHash = updated.hash;
    user.salt = updated.salt;
    saveDb(db);
  }

  return user;
}

// Session management (JWT + db.json lastActiveAt Idle Tracker)

export function createSession(user: DbUser): Promise<{ token: string; refreshToken: string; csrfToken: string; expiresAt: string; session: DbSession }> {
  return withDbLock(db => {
    const payload = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    };

    const token = jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '8h' });
    const csrfToken = `csrf_${crypto.randomBytes(32).toString('hex')}`;
    
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 8 * 60 * 60 * 1000).toISOString(); // 8 hours absolute lifetime
    const isoNow = now.toISOString();

    // Purge previous/expired sessions for this user
    db.sessions = db.sessions.filter(s => s.userId !== user.id && new Date(s.expiresAt) > now);

    const sessionObj: DbSession = {
      token,
      refreshToken,
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      expiresAt,
      createdAt: isoNow,
      lastActiveAt: isoNow,
      csrfToken
    };

    db.sessions.push(sessionObj);
    return { token, refreshToken, csrfToken, expiresAt, session: sessionObj };
  });
}

export async function validateSession(
  token: string | undefined,
  csrfHeaderToken?: string,
  isStateChanging: boolean = false
): Promise<{ session: DbSession | null; error?: string }> {
  if (!token) return { session: null, error: 'Session token missing' };
  
  // 1. Verify JWT signature & 15m access token expiration
  let decoded: any;
  try {
    decoded = jwt.verify(token, JWT_ACCESS_SECRET);
  } catch (err: any) {
    return { session: null, error: `Invalid or expired access token: ${err.message}` };
  }

  return withDbLock(db => {
    // 2. Check if user account is deactivated
    const user = db.users.find(u => u.id === decoded.userId);
    if (!user || user.isDeactivated) {
      db.sessions = db.sessions.filter(s => s.userId !== decoded.userId);
      return { session: null, error: 'User account has been deactivated' };
    }

    // 3. Match active session in db.json for idle & CSRF tracking
    const session = db.sessions.find(s => s.userId === decoded.userId || s.token === token);
    if (!session) {
      return { session: null, error: 'Session record not found' };
    }

    const nowMs = Date.now();
    const createdMs = new Date(session.createdAt || session.expiresAt).getTime();
    const lastActiveMs = new Date(session.lastActiveAt || session.createdAt || session.expiresAt).getTime();

    // 4. Absolute lifetime check (8 hours)
    const MAX_ABSOLUTE_MS = 8 * 60 * 60 * 1000;
    if (nowMs - createdMs > MAX_ABSOLUTE_MS || new Date(session.expiresAt).getTime() < nowMs) {
      db.sessions = db.sessions.filter(s => s.userId !== session.userId);
      return { session: null, error: 'Session expired (absolute lifetime limit reached)' };
    }

    // 5. Idle timeout check (30 minutes inactivity - REQUIRED LOCKED DECISION)
    const MAX_IDLE_MS = 30 * 60 * 1000;
    if (nowMs - lastActiveMs > MAX_IDLE_MS) {
      db.sessions = db.sessions.filter(s => s.userId !== session.userId);
      return { session: null, error: 'Session timed out due to 30 minutes of inactivity' };
    }

    // 6. CSRF Validation on state-changing requests (POST, PUT, PATCH, DELETE)
    if (isStateChanging) {
      if (!csrfHeaderToken || !session.csrfToken || csrfHeaderToken !== session.csrfToken) {
        return { session: null, error: 'CSRF token validation failed' };
      }
    }

    // Update last active timestamp on every successful request
    session.lastActiveAt = new Date().toISOString();
    return { session };
  });
}


export function refreshJwtSessionToken(refreshToken: string | undefined): Promise<{
  success: boolean;
  accessToken?: string;
  refreshToken?: string;
  csrfToken?: string;
  user?: DbActor;
  error?: string;
}> {
  if (!refreshToken) {
    return Promise.resolve({ success: false, error: 'Refresh token missing' });
  }

  let decoded: any;
  try {
    decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
  } catch (err: any) {
    return Promise.resolve({ success: false, error: `Invalid or expired refresh token: ${err.message}` });
  }

  return withDbLock(db => {
    const user = db.users.find(u => u.id === decoded.userId);
    if (!user || user.isDeactivated) {
      db.sessions = db.sessions.filter(s => s.userId !== decoded.userId);
      return { success: false, error: 'User account has been deactivated' };
    }

    const session = db.sessions.find(s => s.userId === decoded.userId || s.refreshToken === refreshToken);
    if (!session) {
      return { success: false, error: 'Session record not found' };
    }

    const nowMs = Date.now();
    const lastActiveMs = new Date(session.lastActiveAt || session.createdAt).getTime();

    // Check 30-min idle timeout
    const MAX_IDLE_MS = 30 * 60 * 1000;
    if (nowMs - lastActiveMs > MAX_IDLE_MS) {
      db.sessions = db.sessions.filter(s => s.userId !== session.userId);
      return { success: false, error: 'Session timed out due to 30 minutes of inactivity' };
    }

    // Generate fresh JWT token pair
    const payload = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    };

    const newAccessToken = jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: '15m' });
    const newRefreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '8h' });

    session.token = newAccessToken;
    session.refreshToken = newRefreshToken;
    session.lastActiveAt = new Date().toISOString();

    const actor: DbActor = { id: user.id, email: user.email, name: user.name, role: user.role };
    appendAuditLog(db, 'TOKEN_REFRESH', 'auth', actor, user.id, `JWT access token refreshed for ${user.email}`);

    return {
      success: true,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      csrfToken: session.csrfToken,
      user: actor
    };
  });
}

export async function getSession(token: string | undefined): Promise<DbSession | null> {
  const result = await validateSession(token, undefined, false);
  return result.session;
}


export function destroySession(tokenOrUserId: string): Promise<void> {
  return withDbLock(db => {
    db.sessions = db.sessions.filter(s => s.token !== tokenOrUserId && s.userId !== tokenOrUserId && s.refreshToken !== tokenOrUserId);
  });
}


// Database Actions for Bookings
export function getActiveBookings(): DbBooking[] {
  const db = getDb();
  return db.bookings.filter(b => !b.deletedAt);
}

export function getDeletedBookings(): DbBooking[] {
  const db = getDb();
  return db.bookings.filter(b => !!b.deletedAt);
}

export function addBooking(booking: Omit<DbBooking, 'id' | 'pricingEstimate' | 'status' | 'createdAt'>): Promise<DbBooking> {
  return withDbLock(db => {
    const estimate = calculatePricingEstimate(booking.eventType, booking.guestCount);
    const depositAmount = Math.round(estimate * 0.30); // 30% retainer deposit
    const newBooking: DbBooking = {
      ...booking,
      id: `b-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      pricingEstimate: estimate,
      depositAmount,
      paymentStatus: 'Unpaid',
      paymentGateway: 'Sandbox',
      whatsappStatus: 'Pending',
      whatsappLogs: [],
      status: 'Pending',
      createdAt: new Date().toISOString()
    };
    
    db.bookings.unshift(newBooking);
    return newBooking;
  });
}

export function updateBookingPaymentLink(id: string, paymentLink: string, gateway: 'Razorpay' | 'Stripe' | 'Sandbox', actor?: DbActor): Promise<DbBooking | null> {
  return withDbLock(db => {
    const booking = db.bookings.find(b => b.id === id);
    if (booking) {
      booking.paymentLink = paymentLink;
      booking.paymentGateway = gateway;
      if (actor) {
        appendAuditLog(db, 'PAYMENT_GENERATED', 'booking', actor, id, `Payment link generated (${gateway}): ${paymentLink}`);
      }
      return booking;
    }
    return null;
  });
}

export function updateBookingPaymentSuccess(id: string, transactionId: string, paidAmount: number, gateway: string, actor?: DbActor): Promise<DbBooking | null> {
  return withDbLock(db => {
    const booking = db.bookings.find(b => b.id === id);
    if (booking) {
      booking.paymentStatus = paidAmount >= booking.pricingEstimate ? 'Fully_Paid' : 'Deposit_Paid';
      booking.paymentTransactionId = transactionId;
      booking.paidAt = new Date().toISOString();
      booking.status = 'Approved';
      appendAuditLog(db, 'PAYMENT_RECEIVED', 'booking', actor || null, id, `Payment received via ${gateway}. Transaction ID: ${transactionId}, Amount: ₹${paidAmount.toLocaleString('en-IN')}`);
      return booking;
    }
    return null;
  });
}

export function logBookingWhatsAppMessage(
  id: string, 
  template: string, 
  recipient: string, 
  status: 'Sent' | 'Failed' | 'Simulated', 
  messageSnippet: string,
  actor?: DbActor
): Promise<DbBooking | null> {
  return withDbLock(db => {
    const booking = db.bookings.find(b => b.id === id);
    if (booking) {
      if (!booking.whatsappLogs) booking.whatsappLogs = [];
      const entry = {
        id: `wa-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        timestamp: new Date().toISOString(),
        template,
        recipient,
        status,
        messageSnippet
      };
      booking.whatsappLogs.unshift(entry);
      booking.whatsappStatus = status === 'Failed' ? 'Failed' : 'Sent';
      appendAuditLog(
        db,
        status === 'Failed' ? 'WHATSAPP_FAILED' : 'WHATSAPP_SENT', 
        'booking', 
        actor || null, 
        id, 
        `WhatsApp message dispatched (${template}) to ${recipient}: status ${status}`
      );
      return booking;
    }
    return null;
  });
}


export function updateBookingStatus(id: string, status: DbBooking['status'], actor: DbActor): Promise<DbBooking | null> {
  return withDbLock(db => {
    const booking = db.bookings.find(b => b.id === id);
    if (booking) {
      const beforeState = { status: booking.status };
      booking.status = status;
      appendAuditLog(db, 'STATUS_UPDATE', 'booking', actor, id, `Status updated to ${status}`, beforeState, { status });
      return booking;
    }
    return null;
  });
}

export function softDeleteBooking(id: string, actor: DbActor): Promise<DbBooking | null> {
  return withDbLock(db => {
    const booking = db.bookings.find(b => b.id === id);
    if (booking && !booking.deletedAt) {
      booking.deletedAt = new Date().toISOString();
      booking.deletedBy = actor.email;
      appendAuditLog(db, 'SOFT_DELETE', 'booking', actor, id, `Booking proposal soft deleted by ${actor.name}`);
      return booking;
    }
    return null;
  });
}

export function restoreBooking(id: string, actor: DbActor): Promise<DbBooking | null> {
  return withDbLock(db => {
    const booking = db.bookings.find(b => b.id === id);
    if (booking && booking.deletedAt) {
      delete booking.deletedAt;
      delete booking.deletedBy;
      appendAuditLog(db, 'RESTORE', 'booking', actor, id, `Booking proposal restored by ${actor.name}`);
      return booking;
    }
    return null;
  });
}

// Database Actions for Contacts
export function getActiveContacts(): DbContact[] {
  const db = getDb();
  return db.contacts.filter(c => !c.deletedAt);
}

export function getDeletedContacts(): DbContact[] {
  const db = getDb();
  return db.contacts.filter(c => !!c.deletedAt);
}

export function addContact(contact: Omit<DbContact, 'id' | 'status' | 'createdAt'>): Promise<DbContact> {
  return withDbLock(db => {
    const newContact: DbContact = {
      ...contact,
      id: `c-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      status: 'Unread',
      createdAt: new Date().toISOString()
    };
    
    db.contacts.unshift(newContact);
    return newContact;
  });
}

export function updateContactStatus(id: string, status: DbContact['status'], actor: DbActor): Promise<DbContact | null> {
  return withDbLock(db => {
    const contact = db.contacts.find(c => c.id === id);
    if (contact) {
      const beforeState = { status: contact.status };
      contact.status = status;
      appendAuditLog(db, 'STATUS_UPDATE', 'contact', actor, id, `Contact status updated to ${status}`, beforeState, { status });
      return contact;
    }
    return null;
  });
}

export function softDeleteContact(id: string, actor: DbActor): Promise<DbContact | null> {
  return withDbLock(db => {
    const contact = db.contacts.find(c => c.id === id);
    if (contact && !contact.deletedAt) {
      contact.deletedAt = new Date().toISOString();
      contact.deletedBy = actor.email;
      appendAuditLog(db, 'SOFT_DELETE', 'contact', actor, id, `Contact inquiry soft deleted by ${actor.name}`);
      return contact;
    }
    return null;
  });
}

export function restoreContact(id: string, actor: DbActor): Promise<DbContact | null> {
  return withDbLock(db => {
    const contact = db.contacts.find(c => c.id === id);
    if (contact && contact.deletedAt) {
      delete contact.deletedAt;
      delete contact.deletedBy;
      appendAuditLog(db, 'RESTORE', 'contact', actor, id, `Contact inquiry restored by ${actor.name}`);
      return contact;
    }
    return null;
  });
}

// --- CMS DYNAMIC CONTENT HELPERS ---
export function getSiteContent(): Record<string, any> {
  const db = getDb();
  return {
    siteSettings: db.siteSettings || DEFAULT_SITE_SETTINGS,
    heroSlides: db.heroSlides || DEFAULT_HERO_SLIDES,
    services: db.services || null,
    portfolioItems: db.portfolioItems || null,
    team: db.team || null,
    testimonials: db.testimonials || null,
    faqs: db.faqs || null,
  };
}

export function updateSiteSection(section: string, payload: any, actor: DbActor): Promise<boolean> {
  return withDbLock(db => {
    const validSections = ['siteSettings', 'heroSlides', 'services', 'portfolioItems', 'team', 'testimonials', 'faqs'];
    if (!validSections.includes(section)) return false;

    const beforeState = (db as any)[section];
    (db as any)[section] = payload;

    appendAuditLog(db, 'CMS_UPDATE', 'cms', actor, section, `Updated dynamic CMS section: ${section}`, beforeState, payload);
    return true;
  });
}

// --- ADMIN USER & CREDENTIAL MANAGEMENT HELPERS ---
export function getAllUsers(): DbUser[] {
  const db = getDb();
  return db.users.map(u => ({
    id: u.id,
    email: u.email,
    passwordHash: '***PROTECTED***',
    salt: '***PROTECTED***',
    name: u.name,
    role: u.role,
    createdAt: u.createdAt
  }));
}

export function registerAdminUser(
  userData: { email: string; password: string; name: string; role: UserRole },
  actor: DbActor | null
): Promise<{ success: boolean; user?: DbUser; error?: string }> {
  return withDbLock(db => {
    const existing = db.users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existing) {
      return { success: false, error: 'User with this email already exists in Royal Studio.' };
    }

    const { hash, salt } = hashPassword(userData.password);
    const newUser: DbUser = {
      id: `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      email: userData.email.trim(),
      passwordHash: hash,
      salt,
      name: userData.name.trim(),
      role: userData.role || 'staff',
      createdAt: new Date().toISOString()
    };

    db.users.push(newUser);

    appendAuditLog(db, 'USER_CREATE', 'user', actor, newUser.id, `Created new admin account: ${newUser.email} (${newUser.role})`);
    return { success: true, user: newUser };
  });
}

export function updateUserCredentials(
  userId: string,
  updates: { email?: string; name?: string; password?: string; role?: UserRole },
  actor: DbActor
): Promise<{ success: boolean; user?: DbUser; error?: string }> {
  return withDbLock(db => {
    const user = db.users.find(u => u.id === userId);
    if (!user) {
      return { success: false, error: 'Target user record not found.' };
    }

    if (updates.email && updates.email.toLowerCase() !== user.email.toLowerCase()) {
      const existing = db.users.find(u => u.email.toLowerCase() === updates.email!.toLowerCase());
      if (existing) {
        return { success: false, error: 'Email is already in use by another user.' };
      }
      user.email = updates.email.trim();
    }

    if (updates.name) {
      user.name = updates.name.trim();
    }

    if (updates.role && actor.role === 'superadmin') {
      user.role = updates.role;
    }

    if (updates.password && updates.password.trim() !== '') {
      const { hash, salt } = hashPassword(updates.password);
      user.passwordHash = hash;
      user.salt = salt;
    }

    appendAuditLog(db, 'CREDENTIALS_UPDATE', 'user', actor, userId, `Updated credentials for ${user.email}`);
    return { success: true, user };
  });
}

// --- DYNAMIC PRICING ENGINE HELPERS ---
export function getPricingRules(): PricingRules {
  const db = getDb();
  return db.pricingRules || DEFAULT_PRICING_RULES;
}

export function updatePricingRules(rules: PricingRules, actor: DbActor): Promise<boolean> {
  return withDbLock(db => {
    const beforeState = db.pricingRules || DEFAULT_PRICING_RULES;
    db.pricingRules = rules;

    appendAuditLog(db, 'PRICING_UPDATE', 'pricing', actor, 'pricing-rules', `Updated dynamic event pricing rules & per-guest rates`, beforeState, rules);
    return true;
  });
}

// --- TRASH PURGE HELPER (SUPERADMIN ONLY) ---
export function purgeTrashItem(type: 'booking' | 'contact', id: string, actor: DbActor): Promise<boolean> {
  return withDbLock(db => {
    if (type === 'booking') {
      const idx = db.bookings.findIndex(b => b.id === id && !!b.deletedAt);
      if (idx !== -1) {
        const removed = db.bookings.splice(idx, 1)[0];
        appendAuditLog(db, 'PURGE', 'booking', actor, id, `Permanently purged deleted proposal for ${removed.name}`);
        return true;
      }
    } else if (type === 'contact') {
      const idx = db.contacts.findIndex(c => c.id === id && !!c.deletedAt);
      if (idx !== -1) {
        const removed = db.contacts.splice(idx, 1)[0];
        appendAuditLog(db, 'PURGE', 'contact', actor, id, `Permanently purged deleted inquiry for ${removed.name}`);
        return true;
      }
    }
    return false;
  });
}

// --- USER DEACTIVATION & FORCED PASSWORD RESET HELPERS (SUPERADMIN ONLY) ---
export function setUserDeactivated(userId: string, isDeactivated: boolean, actor: DbActor): Promise<{ success: boolean; error?: string }> {
  return withDbLock(db => {
    const user = db.users.find(u => u.id === userId);
    if (!user) return { success: false, error: 'User record not found.' };

    user.isDeactivated = isDeactivated;
    if (isDeactivated) {
      // Invalidate all active sessions for this deactivated user immediately
      db.sessions = db.sessions.filter(s => s.userId !== userId);
    }

    appendAuditLog(db, 'USER_DEACTIVATE', 'user', actor, userId, `${isDeactivated ? 'Deactivated' : 'Reactivated'} admin account: ${user.email}`);
    return { success: true };
  });
}

export function forceUserPasswordReset(userId: string, newPassword: string, actor: DbActor): Promise<{ success: boolean; error?: string }> {
  return withDbLock(db => {
    const user = db.users.find(u => u.id === userId);
    if (!user) return { success: false, error: 'User record not found.' };

    const { hash, salt } = hashPassword(newPassword);
    user.passwordHash = hash;
    user.salt = salt;

    // Invalidate active sessions forcing re-login with new password
    db.sessions = db.sessions.filter(s => s.userId !== userId);

    appendAuditLog(db, 'CREDENTIALS_UPDATE', 'user', actor, userId, `Forced password reset for ${user.email}`);
    return { success: true };
  });
}



