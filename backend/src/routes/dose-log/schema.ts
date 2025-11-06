import { z } from "zod";

/**
 * 服用ログの取得用クエリパラメータスキーマ
 */
export const findDoseLogQuerySchema = z.object({
  // オプション: フィルタリング用
  scheduleId: z.string().optional().transform((val) => (val ? parseInt(val, 10) : undefined)),
  // ページネーション用
  limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : undefined)),
  offset: z.string().optional().transform((val) => (val ? parseInt(val, 10) : undefined)),
});

/**
 * 服用ログの作成用リクエストボディスキーマ
 */
export const createDoseLogSchema = z.object({
  scheduleId: z.number().min(1, "Schedule ID is required"),
  recordDate: z.coerce.date(),
  isTaken: z.boolean(),
  takenAt: z.coerce.date().nullable().optional(),
});

/**
 * 服用ログの更新用リクエストボディスキーマ
 */
export const updateDoseLogSchema = z.object({
  scheduleId: z.number().min(1, "Schedule ID is required").optional(),
  recordDate: z.coerce.date().optional(),
  isTaken: z.boolean().optional(),
  takenAt: z.coerce.date().nullable().optional(),
});

/**
 * 服用ログのレスポンススキーマ
 */
export const doseLogResponseSchema = z.object({
  doseLogId: z.number(),
  scheduleId: z.number(),
  recordDate: z.date(),
  isTaken: z.boolean(),
  takenAt: z.date().nullable(),
});

