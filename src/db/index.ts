import { drizzle as drizzleNodePg } from 'drizzle-orm/node-postgres';
import { drizzle as drizzleNeonHttp } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { Pool } from 'pg';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

// Neon is reachable over HTTPS as well as the Postgres wire protocol. Use the HTTP driver for
// Neon hosts so this works from environments that only allow outbound HTTPS (and so serverless
// runtimes don't hold a pool open); fall back to node-postgres for a plain local Postgres.
const isNeon = /\.neon\.tech/.test(connectionString);

export const db = isNeon
  ? drizzleNeonHttp(neon(connectionString), { schema })
  : drizzleNodePg(new Pool({ connectionString }), { schema });
