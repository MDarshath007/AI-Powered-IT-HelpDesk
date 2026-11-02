import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { config } from './index.js';

// Ensure the data directory exists before opening SQLite database
const dbDir = path.dirname(config.dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Open SQLite database connection
const db = new Database(config.dbPath);

// Enable WAL mode (Write-Ahead Logging) and Foreign Key constraints
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

/**
 * Initializes required database schema and tables.
 * Can be safely called multiple times (uses CREATE TABLE IF NOT EXISTS).
 */
export const initDatabase = () => {
  const schema = `
    CREATE TABLE IF NOT EXISTS tickets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      priority TEXT NOT NULL CHECK(priority IN ('low', 'medium', 'high')),
      status TEXT NOT NULL DEFAULT 'open' CHECK(status IN ('open', 'in_progress', 'resolved')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `;

  db.exec(schema);
  console.log(`[Database] SQLite database initialized successfully at: ${config.dbPath}`);
};

export { db };
export default db;
