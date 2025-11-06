import { z } from "zod";

/**
 * スケジュールの取得用クエリパラメータスキーマ
 */
export const findScheduleQuerySchema = z.object({
  // オプション: フィルタリング用
  medicineId: z.string().optional().transform((val) => (val ? parseInt(val, 10) : undefined)),
  // ページネーション用
  limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : undefined)),
  offset: z.string().optional().transform((val) => (val ? parseInt(val, 10) : undefined)),
});

/**
 * スケジュールの作成用リクエストボディスキーマ
 */
export const createScheduleSchema = z.object({
  medicineId: z.number().min(1, "Medicine ID is required"),
  time: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, "Time must be in HH:MM format"),
  frequencyType: z.enum(["DAILY", "WEEKLY", "CUSTOM"]).optional().default("DAILY"),
  startDate: z.coerce.date(),
});

/**
 * スケジュールの更新用リクエストボディスキーマ
 */
export const updateScheduleSchema = z.object({
  medicineId: z.number().min(1, "Medicine ID is required").optional(),
  time: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, "Time must be in HH:MM format").optional(),
  frequencyType: z.enum(["DAILY", "WEEKLY", "CUSTOM"]).optional(),
  startDate: z.coerce.date().optional(),
});

/**
 * スケジュールのレスポンススキーマ
 */
export const scheduleResponseSchema = z.object({
  scheduleId: z.number(),
  medicineId: z.number(),
  time: z.string(),
  frequencyType: z.enum(["DAILY", "WEEKLY", "CUSTOM"]),
  startDate: z.date(),
});

