/**
 * Barmantra — MongoDB Database Engine & Seed Migration Service
 */

import { MongoClient, Db } from 'mongodb';
import * as fs from 'fs';
import * as path from 'path';
import { DatabaseSchema } from './db.ts';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/barmantra';
const DB_NAME = process.env.MONGODB_DB_NAME || 'barmantra';

let client: MongoClient | null = null;
let dbInstance: Db | null = null;
let isConnected = false;

const ALL_COLLECTION_NAMES = [
  'bookings',
  'contacts',
  'users',
  'site_content',
  'pricing_rules',
  'audit_logs',
  'sessions'
];

export async function initMongoDb(): Promise<boolean> {
  try {
    console.log(`[MongoDB Engine] Connecting to ${MONGODB_URI}...`);
    client = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 3000,
    });
    await client.connect();
    dbInstance = client.db(DB_NAME);
    isConnected = true;
    console.log(`[MongoDB Engine] Successfully connected to MongoDB database "${DB_NAME}".`);

    // Ensure all 7 collections are created so they appear in MongoDB Compass
    await ensureAllCollectionsExist();

    // Perform auto-seed migration from db.json if collections are empty
    await seedMongoFromDbJson();

    return true;
  } catch (err: any) {
    console.warn(`[MongoDB Engine Warning] Could not connect to local/atlas MongoDB (${err.message}). Defaulting to resilient db.json file storage.`);
    isConnected = false;
    dbInstance = null;
    return false;
  }
}

export function isMongoConnected(): boolean {
  return isConnected && dbInstance !== null;
}

export function getMongoDb(): Db | null {
  return dbInstance;
}

/**
 * Ensures all 7 collection names exist in MongoDB Compass
 */
async function ensureAllCollectionsExist(): Promise<void> {
  if (!dbInstance) return;

  try {
    const existingColls = await dbInstance.listCollections().toArray();
    const existingNames = new Set(existingColls.map(c => c.name));

    for (const colName of ALL_COLLECTION_NAMES) {
      if (!existingNames.has(colName)) {
        await dbInstance.createCollection(colName);
        console.log(`[MongoDB Engine] Created collection "${colName}" in database "${DB_NAME}".`);
      }
    }
  } catch (err: any) {
    console.warn('[MongoDB Engine Warning] Error listing/creating collections:', err.message);
  }
}

/**
 * Reads local db.json and seeds empty MongoDB collections
 */
async function seedMongoFromDbJson(): Promise<void> {
  if (!dbInstance) return;

  try {
    const dbFilePath = path.resolve(process.cwd(), 'db.json');
    if (!fs.existsSync(dbFilePath)) return;

    const fileContent = fs.readFileSync(dbFilePath, 'utf-8');
    const dbJson: DatabaseSchema = JSON.parse(fileContent);

    // 1. Bookings Collection
    const bookingsColl = dbInstance.collection('bookings');
    const bookingsCount = await bookingsColl.countDocuments();
    if (bookingsCount === 0 && dbJson.bookings && dbJson.bookings.length > 0) {
      const docs = dbJson.bookings.map(b => ({ ...b, _id: b.id }));
      await bookingsColl.insertMany(docs as any);
      console.log(`[MongoDB Migration] Seeded ${docs.length} bookings into MongoDB "bookings" collection.`);
    }

    // 2. Contacts Collection
    const contactsColl = dbInstance.collection('contacts');
    const contactsCount = await contactsColl.countDocuments();
    if (contactsCount === 0 && dbJson.contacts && dbJson.contacts.length > 0) {
      const docs = dbJson.contacts.map(c => ({ ...c, _id: c.id }));
      await contactsColl.insertMany(docs as any);
      console.log(`[MongoDB Migration] Seeded ${docs.length} contacts into MongoDB "contacts" collection.`);
    }

    // 3. Users Collection
    const usersColl = dbInstance.collection('users');
    const usersCount = await usersColl.countDocuments();
    if (usersCount === 0 && dbJson.users && dbJson.users.length > 0) {
      const docs = dbJson.users.map(u => ({ ...u, _id: u.id }));
      await usersColl.insertMany(docs as any);
      console.log(`[MongoDB Migration] Seeded ${docs.length} admin users into MongoDB "users" collection.`);
    }

    // 4. Site Content Collection
    const siteContentColl = dbInstance.collection('site_content');
    const siteContentCount = await siteContentColl.countDocuments();
    if (siteContentCount === 0) {
      const contentDoc = {
        _id: 'default_cms',
        siteSettings: dbJson.siteSettings,
        heroSlides: dbJson.heroSlides,
        services: dbJson.services,
        portfolioItems: dbJson.portfolioItems,
        team: dbJson.team,
        testimonials: dbJson.testimonials,
        faqs: dbJson.faqs,
      };
      await siteContentColl.insertOne(contentDoc as any);
      console.log(`[MongoDB Migration] Seeded dynamic CMS content into MongoDB "site_content" collection.`);
    }

    // 5. Pricing Rules Collection
    const pricingRulesColl = dbInstance.collection('pricing_rules');
    const pricingCount = await pricingRulesColl.countDocuments();
    if (pricingCount === 0 && dbJson.pricingRules) {
      const rulesDoc = { _id: 'default_pricing', ...dbJson.pricingRules };
      await pricingRulesColl.insertOne(rulesDoc as any);
      console.log(`[MongoDB Migration] Seeded pricing rules into MongoDB "pricing_rules" collection.`);
    }

    // 6. Audit Logs Collection
    const auditLogsColl = dbInstance.collection('audit_logs');
    const auditCount = await auditLogsColl.countDocuments();
    if (auditCount === 0 && dbJson.auditLogs && dbJson.auditLogs.length > 0) {
      const docs = dbJson.auditLogs.map(a => ({ ...a, _id: a.id }));
      await auditLogsColl.insertMany(docs as any);
      console.log(`[MongoDB Migration] Seeded ${docs.length} audit logs into MongoDB "audit_logs" collection.`);
    }

    // 7. Sessions Collection
    const sessionsColl = dbInstance.collection('sessions');
    const sessionsCount = await sessionsColl.countDocuments();
    if (sessionsCount === 0 && dbJson.sessions && dbJson.sessions.length > 0) {
      const docs = dbJson.sessions.map(s => ({ ...s, _id: s.token }));
      await sessionsColl.insertMany(docs as any);
      console.log(`[MongoDB Migration] Seeded active sessions into MongoDB "sessions" collection.`);
    }

    // Perform an initial full sync to make sure all collections have data documents
    await syncDbToMongo(dbJson);

  } catch (err: any) {
    console.error('[MongoDB Migration Error] Failed to seed MongoDB collections:', err.message);
  }
}

/**
 * Helper to sync full database snapshot to MongoDB asynchronously
 */
export async function syncDbToMongo(dbData: DatabaseSchema): Promise<void> {
  if (!dbInstance) return;

  try {
    // 1. Sync Bookings
    if (dbData.bookings) {
      const coll = dbInstance.collection('bookings');
      for (const item of dbData.bookings) {
        await coll.replaceOne({ _id: item.id as any }, { ...item, _id: item.id } as any, { upsert: true });
      }
    }

    // 2. Sync Contacts
    if (dbData.contacts) {
      const coll = dbInstance.collection('contacts');
      for (const item of dbData.contacts) {
        await coll.replaceOne({ _id: item.id as any }, { ...item, _id: item.id } as any, { upsert: true });
      }
    }

    // 3. Sync Users
    if (dbData.users) {
      const coll = dbInstance.collection('users');
      for (const item of dbData.users) {
        await coll.replaceOne({ _id: item.id as any }, { ...item, _id: item.id } as any, { upsert: true });
      }
    }

    // 4. Sync Audit Logs
    if (dbData.auditLogs) {
      const coll = dbInstance.collection('audit_logs');
      for (const item of dbData.auditLogs) {
        await coll.replaceOne({ _id: item.id as any }, { ...item, _id: item.id } as any, { upsert: true });
      }
    }

    // 5. Sync Site Content
    const siteColl = dbInstance.collection('site_content');
    await siteColl.replaceOne(
      { _id: 'default_cms' as any },
      {
        _id: 'default_cms',
        siteSettings: dbData.siteSettings,
        heroSlides: dbData.heroSlides,
        services: dbData.services,
        portfolioItems: dbData.portfolioItems,
        team: dbData.team,
        testimonials: dbData.testimonials,
        faqs: dbData.faqs,
      } as any,
      { upsert: true }
    );

    // 6. Sync Pricing Rules
    if (dbData.pricingRules) {
      const pricingColl = dbInstance.collection('pricing_rules');
      await pricingColl.replaceOne(
        { _id: 'default_pricing' as any },
        { _id: 'default_pricing', ...dbData.pricingRules } as any,
        { upsert: true }
      );
    }

  } catch (err: any) {
    console.error('[MongoDB Sync Warning]: Failed to sync record to MongoDB:', err.message);
  }
}
