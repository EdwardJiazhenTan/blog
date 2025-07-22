import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';
import path from 'path';
import fs from 'fs';
import os from 'os';

// Database connection with error handling
let dbInstance: ReturnType<typeof drizzle> | null = null;

const initDatabase = () => {
  if (dbInstance) return dbInstance;
  
  try {
    // Use temp directory in production for better reliability
    const dbPath = process.env.NODE_ENV === 'production' 
      ? path.join(os.tmpdir(), 'blog-production.db')
      : './dev.db';
    
    console.log(`Initializing database at: ${dbPath}`);
    
    // Ensure directory exists
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Initialize SQLite with error handling
    const sqlite = new Database(dbPath, { 
      verbose: process.env.NODE_ENV === 'development' ? console.log : undefined,
      fileMustExist: false
    });
    
    // Configure SQLite for better reliability
    sqlite.pragma('journal_mode = WAL');
    sqlite.pragma('synchronous = NORMAL');
    sqlite.pragma('foreign_keys = ON');
    
    dbInstance = drizzle(sqlite, { schema });
    
    // Always ensure tables exist when initializing
    ensureTablesExist(sqlite);
    
    console.log('Database initialized successfully');
    return dbInstance;
  } catch (error) {
    console.error('Database initialization failed:', error);
    // Return null to trigger fallback in API routes
    return null;
  }
};

// Ensure database tables exist 
const ensureTablesExist = (sqlite: InstanceType<typeof Database>) => {
  try {
    // Create tables if they don't exist
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS profiles (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        full_name TEXT,
        bio TEXT,
        created_at INTEGER DEFAULT (unixepoch()),
        updated_at INTEGER DEFAULT (unixepoch())
      );

      CREATE TABLE IF NOT EXISTS posts (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        content TEXT NOT NULL,
        excerpt TEXT,
        published BOOLEAN DEFAULT 0,
        featured BOOLEAN DEFAULT 0,
        featured_image TEXT,
        author_id TEXT NOT NULL,
        created_at INTEGER DEFAULT (unixepoch()),
        updated_at INTEGER DEFAULT (unixepoch()),
        published_at INTEGER,
        FOREIGN KEY (author_id) REFERENCES profiles(id)
      );

      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        description TEXT,
        created_at INTEGER DEFAULT (unixepoch())
      );

      CREATE TABLE IF NOT EXISTS tags (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        created_at INTEGER DEFAULT (unixepoch())
      );

      CREATE TABLE IF NOT EXISTS post_categories (
        post_id TEXT NOT NULL,
        category_id TEXT NOT NULL,
        PRIMARY KEY (post_id, category_id),
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS post_tags (
        post_id TEXT NOT NULL,
        tag_id TEXT NOT NULL,
        PRIMARY KEY (post_id, tag_id),
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
        FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS comments (
        id TEXT PRIMARY KEY,
        post_id TEXT NOT NULL,
        author_name TEXT NOT NULL,
        author_email TEXT NOT NULL,
        content TEXT NOT NULL,
        approved BOOLEAN DEFAULT 0,
        created_at INTEGER DEFAULT (unixepoch()),
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
      );
    `);

    // Create admin profile if it doesn't exist
    const adminExists = sqlite.prepare('SELECT COUNT(*) as count FROM profiles WHERE username = ?').get('admin');
    if (!adminExists || (adminExists as any)?.count === 0) {
      sqlite.prepare(`
        INSERT OR IGNORE INTO profiles (id, username, full_name, bio, created_at, updated_at)
        VALUES ('admin_001', 'admin', 'Blog Administrator', 'Admin user for blog management', unixepoch(), unixepoch())
      `).run();
      console.log('Created admin profile');
    }
    
    console.log('Database tables ensured');
  } catch (error) {
    console.error('Failed to ensure tables exist:', error);
  }
};

export const db = initDatabase();