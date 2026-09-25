import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
let database: DatabaseSync;
export function db() {
  if (!database) {
    const file=resolve(/* turbopackIgnore: true */ process.env.DATABASE_PATH || './data/aevra.sqlite');
    mkdirSync(dirname(file),{recursive:true});
    database=new DatabaseSync(file);
    database.exec(`PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000;
      CREATE TABLE IF NOT EXISTS subscribers (email TEXT PRIMARY KEY, token TEXT NOT NULL, created_at TEXT NOT NULL, consent_version TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS limits (key TEXT PRIMARY KEY, count INTEGER NOT NULL, expires INTEGER NOT NULL);`);
  }
  return database;
}

