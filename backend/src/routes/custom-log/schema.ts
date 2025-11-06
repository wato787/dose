import { z } from "zod";

/**
 * カスタムログの取得用クエリパラメータスキーマ
 */
export const findCustomLogQuerySchema = z.object({
  // オプション: フィルタリング用
  customItemId: z.string().optional().transform((val) => (val ? parseInt(val, 10) : undefined)),
  // ページネーション用
  limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : undefined)),
  offset: z.string().optional().transform((val) => (val ? parseInt(val, 10) : undefined)),
});

/**
 * カスタムログの作成用リクエストボディスキーマ
 */
export const createCustomLogSchema = z.object({
  customItemId: z.number().min(1, "Custom item ID is required"),
  recordDate: z.coerce.date(),
  value: z.string().min(1, "Value is required"),
});

/**
 * カスタムログの更新用リクエストボディスキーマ
 */
export const updateCustomLogSchema = z.object({
  customItemId: z.number().min(1, "Custom item ID is required").optional(),
  recordDate: z.coerce.date().optional(),
  value: z.string().min(1, "Value is required").optional(),
});

/**
 * カスタムログのレスポンススキーマ
 */
export const customLogResponseSchema = z.object({
  customLogId: z.number(),
  customItemId: z.number(),
  recordDate: z.date(),
  value: z.string(),
});

