import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { customItem } from "./customItem";

/**
 * カスタム項目の値テーブル
 * カスタム項目の実際の値を記録（例：出血チェックの値、体温など）
 */
export const customLog = sqliteTable("custom_log", {
  customLogId: integer("custom_log_id").primaryKey({ autoIncrement: true }),
  customItemId: integer("custom_item_id")
    .notNull()
    .references(() => customItem.customItemId),
  recordDate: integer("record_date", { mode: "timestamp" }).notNull(),
  value: text("value").notNull(), // BOOL/NUMBER/TEXT/RATINGに対応するためTEXT型で保存
});

export type CustomLog = typeof customLog.$inferSelect;
export type NewCustomLog = typeof customLog.$inferInsert;
