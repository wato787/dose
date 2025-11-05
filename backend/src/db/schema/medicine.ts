import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { user } from "./betterAuth";

/**
 * 薬の基本情報テーブル
 * ユーザーが登録する薬/サプリメントのマスターデータ
 */
export const medicine = sqliteTable("medicine", {
  medicineId: integer("medicine_id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }), // better-authのuserテーブルを参照
  name: text("name").notNull(),
  description: text("description"),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  registeredAt: integer("registered_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export type Medicine = typeof medicine.$inferSelect;
export type NewMedicine = typeof medicine.$inferInsert;

