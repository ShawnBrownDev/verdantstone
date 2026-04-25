import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { neon } from "@neondatabase/serverless";
import { loadProjectEnv } from "./load-env.mjs";

async function run() {
  loadProjectEnv();
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set.");
  }

  const sql = neon(databaseUrl);
  const migrationsDir = resolve(process.cwd(), "db/migrations");
  const migrationFiles = (await readdir(migrationsDir))
    .filter((fileName) => fileName.endsWith(".sql"))
    .sort((a, b) => a.localeCompare(b));

  for (const fileName of migrationFiles) {
    const migrationPath = resolve(migrationsDir, fileName);
    const migrationSql = await readFile(migrationPath, "utf8");
    const statements = migrationSql
      .split(/;\s*\n/g)
      .map((statement) => statement.trim())
      .filter(Boolean);

    for (const statement of statements) {
      await sql.query(statement);
    }

    console.log(`Migration applied: ${fileName}`);
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
