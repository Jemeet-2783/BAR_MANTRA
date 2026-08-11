  /**
 * Barmantra — Sequential Database Write Queue (In-Memory Mutex)
 */

import { getDb, saveDb, type DatabaseSchema } from './db.ts';


let queue: Promise<any> = Promise.resolve();

/**
 * Serializes all db.json reads, mutations, and writes to prevent race conditions.
 * Ensures that mutator receives the freshest DatabaseSchema from disk,
 * executes the mutation, and saves the updated state atomically.
 */
export function withDbLock<T>(mutator: (db: DatabaseSchema) => Promise<T> | T): Promise<T> {
  const resultPromise = queue.then(async () => {
    const db = getDb();
    const result = await mutator(db);
    saveDb(db);
    return result;
  });

  // Keep the queue chain alive even if a mutator fails
  queue = resultPromise.catch(() => {});

  return resultPromise;
}
