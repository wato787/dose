import { z } from "zod";

/**
 * カスタム項目の取得用クエリパラメータスキーマ
 */
export const findCustomItemQuerySchema = z.object({
  // オプション: フィルタリング用
  medicineId: z.string().optional().transform((val) => (val ? parseInt(val, 10) : undefined)),
  // ページネーション用
  limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : undefined)),
  offset: z.string().optional().transform((val) => (val ? parseInt(val, 10) : undefined)),
});

/**
 * カスタム項目の作成用リクエストボディスキーマ
 */
export const createCustomItemSchema = z.object({
  medicineId: z.number().nullable().optional(),
  itemName: z.string().min(1, "Item name is required"),
  dataType: z.enum(["BOOL", "NUMBER", "TEXT", "RATING"], {
    errorMap: () => ({ message: "Data type must be BOOL, NUMBER, TEXT, or RATING" }),
  }),
  isRequired: z.boolean().optional().default(false),
});

/**
 * カスタム項目の更新用リクエストボディスキーマ
 */
export const updateCustomItemSchema = z.object({
  medicineId: z.number().nullable().optional(),
  itemName: z.string().min(1, "Item name is required").optional(),
  dataType: z.enum(["BOOL", "NUMBER", "TEXT", "RATING"], {
    errorMap: () => ({ message: "Data type must be BOOL, NUMBER, TEXT, or RATING" }),
  }).optional(),
  isRequired: z.boolean().optional(),
});

/**
 * カスタム項目のレスポンススキーマ
 */
export const customItemResponseSchema = z.object({
  customItemId: z.number(),
  medicineId: z.number().nullable(),
  itemName: z.string(),
  dataType: z.enum(["BOOL", "NUMBER", "TEXT", "RATING"]),
  isRequired: z.boolean(),
});

