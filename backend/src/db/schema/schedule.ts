import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { medicine } from "./medicine";

/**
 * 薬の服用スケジュールテーブル
 * 薬の服用時間や頻度を管理する設定
 */
export const schedule = sqliteTable("schedule", {
  scheduleId: integer("schedule_id").primaryKey({ autoIncrement: true }),
  medicineId: integer("medicine_id")
    .notNull()
    .references(() => medicine.medicineId),
  time: text("time").notNull(), // 服用予定時刻（例: "08:00", "23:00"）
  frequencyType: text("frequency_type", { enum: ["DAILY", "WEEKLY", "CUSTOM"] })
    .notNull()
    .default("DAILY"),
  startDate: integer("start_date", { mode: "timestamp" }).notNull(),
});

export type Schedule = typeof schedule.$inferSelect;
export type NewSchedule = typeof schedule.$inferInsert;
