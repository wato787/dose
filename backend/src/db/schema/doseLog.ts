import { sqliteTable, integer } from "drizzle-orm/sqlite-core";
import { schedule } from "./schedule";

/**
 * 服用実績テーブル
 * スケジュールされた薬の服用実績（服用したかどうか）を記録
 */
export const doseLog = sqliteTable("dose_log", {
  doseLogId: integer("dose_log_id").primaryKey({ autoIncrement: true }),
  scheduleId: integer("schedule_id").notNull().references(() => schedule.scheduleId),
  recordDate: integer("record_date", { mode: "timestamp" }).notNull(),
  isTaken: integer("is_taken", { mode: "boolean" }).notNull(),
  takenAt: integer("taken_at", { mode: "timestamp" }),
});

