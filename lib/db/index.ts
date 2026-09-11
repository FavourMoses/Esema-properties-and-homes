import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as dbSchema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL is not set. Add it to your .env.local (see .env.example)."
  );
}

// `prepare: false` is required for connection poolers like Supabase's
// Supavisor / PgBouncer in transaction mode, which serverless deployments
// (Vercel) rely on.
const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client, { schema: dbSchema });
export * as schema from "./schema";
