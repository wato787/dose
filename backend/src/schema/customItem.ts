import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { medicine } from "./medicine";

/**
 * カスタムチェック項目設定テーブル
 * 薬に紐づく、または独立した、ユーザーが自由に設定できる追加の記録項目
 */
export const customItem = sqliteTable("custom_item", {
  customItemId: integer("custom_item_id").primaryKey({ autoIncrement: true }),
  medicineId: integer("medicine_id").references(() => medicine.medicineId), // NULL可 - 薬に紐づかない場合
  itemName: text("item_name").notNull(),
  dataType: text("data_type", { enum: ["BOOL", "NUMBER", "TEXT", "RATING"] }).notNull(),
  isRequired: integer("is_required", { mode: "boolean" }).notNull().default(false),
});

