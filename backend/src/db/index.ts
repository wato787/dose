import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import type { BunSQLiteDatabase } from "drizzle-orm/bun-sqlite";
import * as schema from "./schema";

const sqlite = new Database(process.env.DATABASE_PATH || "sqlite.db");
export const db = drizzle(sqlite, { schema });

// 共通のDatabase型（dbとtxの両方で使用可能）
export type DatabaseType = BunSQLiteDatabase<typeof schema>;

