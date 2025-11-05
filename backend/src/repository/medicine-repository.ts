import { db } from "../db";
import { medicine } from "../db/schema";
import type { NewMedicine } from "../db/schema/medicine";
import type { PaginationOptions } from "../types/pagination";
import { eq, and, SQL } from "drizzle-orm";

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
   * @param userId ユーザーID
   * @param isActive アクティブな薬のみ取得するかどうか
   * @param pagination ページネーションオプション
   * @returns 薬の配列
   */
  async find(userId: string, isActive?: boolean, pagination?: PaginationOptions) {
    const conditions: SQL[] = [eq(medicine.userId, userId)];

    if (isActive !== undefined) {
      conditions.push(eq(medicine.isActive, isActive));
    }

    const result = await db
      .select()
      .from(medicine)
      .where(and(...conditions))
      .limit(pagination?.limit ?? 100)
      .offset(pagination?.offset ?? 0);

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

  /**
   * 薬を作成
   * @param data 作成データ
   * @returns 作成された薬のオブジェクト
   */
  async create(data: Omit<NewMedicine, "medicineId" | "registeredAt">) {
    const result = await db
      .insert(medicine)
      .values({
        userId: data.userId,
        name: data.name,
        description: data.description,
        isActive: data.isActive ?? true,
      })
      .returning();

    return result[0];
  },

  /**
   * 薬を更新
   * @param medicineId 薬のID
   * @param userId ユーザーID
   * @param data 更新データ
   * @returns 更新された薬のオブジェクト、見つからない場合はnull
   */
  async update(
    medicineId: number,
    userId: string,
    data: Partial<Omit<NewMedicine, "medicineId" | "userId" | "registeredAt">>
  ) {
    const result = await db
      .update(medicine)
      .set(data)
      .where(
        and(
          eq(medicine.medicineId, medicineId),
          eq(medicine.userId, userId)
        )
      )
      .returning();

    return result[0] ?? null;
  },

  /**
   * 薬を削除
   * @param medicineId 薬のID
   * @param userId ユーザーID
   * @returns 削除されたかどうか
   */
  async delete(medicineId: number, userId: string) {
    const result = await db
      .delete(medicine)
      .where(
        and(
          eq(medicine.medicineId, medicineId),
          eq(medicine.userId, userId)
        )
      )
      .returning();

    return result.length > 0;
  },
};

