import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';

// For now, keep it simple with SQLite for development
// We'll switch to PostgreSQL schema in production deployment
const sqlite = new Database('./dev.db');
export const db = drizzle(sqlite, { schema });