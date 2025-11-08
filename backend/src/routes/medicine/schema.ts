import { z } from "zod";

/**
 * 薬の取得用クエリパラメータスキーマ
 */
export const findMedicineQuerySchema = z.object({
  // オプション: フィルタリング用
  isActive: z.string().optional().transform((val) => val === "true"),
  // ページネーション用（将来的に使用）
  limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : undefined)),
  offset: z.string().optional().transform((val) => (val ? parseInt(val, 10) : undefined)),
});

/**
 * スケジュールの作成用スキーマ
 */
export const scheduleInputSchema = z.object({
  time: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, "Time must be in HH:MM format"),
  frequencyType: z.enum(["DAILY", "WEEKLY", "CUSTOM"]).optional().default("DAILY"),
  startDate: z.coerce.date(),
});

/**
 * カスタム項目の作成用スキーマ
 */
export const customItemInputSchema = z.object({
  itemName: z.string().min(1, "Item name is required"),
  dataType: z.enum(["BOOL", "NUMBER", "TEXT", "RATING"], {
    errorMap: () => ({ message: "Data type must be BOOL, NUMBER, TEXT, or RATING" }),
  }),
  isRequired: z.boolean().optional().default(false),
});

/**
 * 薬の作成用リクエストボディスキーマ
 */
export const createMedicineSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional().nullable(),
  isActive: z.boolean().optional().default(true),
  schedule: scheduleInputSchema.optional(),
  customItems: z.array(customItemInputSchema).optional().default([]),
});

/**
 * 薬の更新用リクエストボディスキーマ
 */
export const updateMedicineSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  description: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  schedule: scheduleInputSchema.optional(),
  customItems: z.array(customItemInputSchema).optional(),
});

/**
 * 薬のレスポンススキーマ
 */
export const medicineResponseSchema = z.object({
  medicineId: z.number(),
  userId: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  isActive: z.boolean(),
  registeredAt: z.date(),
});

