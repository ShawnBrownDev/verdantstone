import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

let sql: NeonQueryFunction<false, false> | null = null;

/**
 * Returns a Neon SQL client (tagged template). Lazily created so importing this
 * module does not throw when `DATABASE_URL` is unset (e.g. during static analysis).
 * Call from Server Components, Route Handlers, or Server Actions only.
 */
export function getSql(): NeonQueryFunction<false, false> {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Add your Neon connection string to .env.local (see .env.example).",
    );
  }
  if (!sql) {
    sql = neon(url);
  }
  return sql;
}
