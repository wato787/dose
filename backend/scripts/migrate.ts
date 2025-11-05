import { drizzle } from "drizzle-orm/bun-sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { Database } from "bun:sqlite";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const dbPath = process.env.DATABASE_PATH || "sqlite.db";
const sqlite = new Database(dbPath);
const db = drizzle(sqlite);

// Bun の import.meta.dir が使えない場合は、代替手段を使用
const __dirname = typeof import.meta.dir !== "undefined" 
  ? import.meta.dir 
  : dirname(fileURLToPath(import.meta.url));
const migrationsFolder = join(__dirname, "../drizzle");

console.log("Running migrations...");
console.log(`Database: ${dbPath}`);
console.log(`Migrations folder: ${migrationsFolder}`);

migrate(db, { migrationsFolder });

console.log("✓ Migration completed successfully!");

sqlite.close();

