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

