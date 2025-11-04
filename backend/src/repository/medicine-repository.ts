import { db } from "../db";
import { medicine } from "../schema";
import { eq, and, SQL } from "drizzle-orm";

/**
 * 薬の取得条件
 */
export interface FindMedicineOptions {
  userId: string;
  isActive?: boolean;
  limit?: number;
  offset?: number;
}

/**
 * 薬のIDとユーザーIDによる検索条件
 */
export interface FindMedicineByIdOptions {
  userId: string;
  medicineId: number;
}

/**
 * Medicine Repository
 * 薬に関するデータベース操作を提供する関数群
 */
export const medicineRepository = {
  /**
   * ユーザーの薬一覧を取得
   * @param options 検索条件
   * @returns 薬の配列
   */
  async find(options: FindMedicineOptions) {
    const conditions: SQL[] = [eq(medicine.userId, options.userId)];

    if (options.isActive !== undefined) {
      conditions.push(eq(medicine.isActive, options.isActive));
    }

    const result = await db
      .select()
      .from(medicine)
      .where(and(...conditions))
      .limit(options.limit ?? 100)
      .offset(options.offset ?? 0);

    return result;
  },

  /**
   * 特定の薬をIDで取得
   * @param options 検索条件
   * @returns 薬のオブジェクト、見つからない場合はnull
   */
  async findById(options: FindMedicineByIdOptions) {
    const result = await db
      .select()
      .from(medicine)
      .where(
        and(
          eq(medicine.medicineId, options.medicineId),
          eq(medicine.userId, options.userId)
        )
      )
      .limit(1);

    return result[0] ?? null;
  },
};

