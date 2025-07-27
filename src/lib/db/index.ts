import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema-postgres';

// Get database connection
function getDatabase() {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('DATABASE_URL environment variable not set');
    throw new Error('DATABASE_URL environment variable not set');
  }
  
  // Create postgres client
  const client = postgres(databaseUrl, {
    ssl: 'require',
    max: 1,
    idle_timeout: 20,
    max_lifetime: 60 * 30, // 30 minutes
  });
  
  return drizzle(client, { schema });
}

// Export database instance
export const db = getDatabase();