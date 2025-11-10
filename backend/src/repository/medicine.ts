import { and, eq } from "drizzle-orm";
import type { DatabaseType } from "../db";
import { medicine } from "../db/schema";
import type { NewMedicine } from "../db/schema/medicine";
import type { PaginationOptions } from "../types/pagination";

/**
 * Medicine Repository
 * 薬に関するデータベース操作を提供する関数群
 */
export const medicineRepository = {
  /**
   * ユーザーの薬一覧を取得
   * @param db データベースオブジェクト
   * @param userId ユーザーID
   * @param pagination ページネーションオプション
   * @returns 薬の配列
   */
  async findByUserId(db: DatabaseType, userId: string, pagination?: PaginationOptions) {
    const result = await db
      .select()
      .from(medicine)
      .where(eq(medicine.userId, userId))
      .limit(pagination?.limit ?? 100)
      .offset(pagination?.offset ?? 0);

    return result;
  },

  /**
   * ユーザーのアクティブな薬一覧を取得
   * @param db データベースオブジェクト
   * @param userId ユーザーID
   * @param isActive アクティブな薬のみ取得するかどうか
   * @param pagination ページネーションオプション
   * @returns 薬の配列
   */
  async findByUserIdAndIsActive(
    db: DatabaseType,
    userId: string,
    isActive: boolean,
    pagination?: PaginationOptions
  ) {
    const result = await db
      .select()
      .from(medicine)
      .where(and(eq(medicine.userId, userId), eq(medicine.isActive, isActive)))
      .limit(pagination?.limit ?? 100)
      .offset(pagination?.offset ?? 0);

    return result;
  },

  /**
   * 特定の薬をIDとユーザーIDで取得
   * @param db データベースオブジェクト
   * @param userId ユーザーID
   * @param medicineId 薬のID
   * @returns 薬のオブジェクト、見つからない場合はnull
   */
  async findByIdAndUserId(db: DatabaseType, userId: string, medicineId: number) {
    const result = await db
      .select()
      .from(medicine)
      .where(and(eq(medicine.medicineId, medicineId), eq(medicine.userId, userId)))
      .limit(1);

    return result[0] ?? null;
  },

  /**
   * 薬を作成
   * @param db データベースオブジェクト
   * @param data 作成データ
   * @returns 作成された薬のオブジェクト
   */
  async create(db: DatabaseType, data: Omit<NewMedicine, "medicineId" | "registeredAt">) {
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
   * @param db データベースオブジェクト
   * @param medicineId 薬のID
   * @param data 更新データ
   * @returns 更新された薬のオブジェクト、見つからない場合はnull
   */
  async update(
    db: DatabaseType,
    medicineId: number,
    data: Partial<Omit<NewMedicine, "medicineId" | "userId" | "registeredAt">>
  ) {
    const result = await db
      .update(medicine)
      .set(data)
      .where(eq(medicine.medicineId, medicineId))
      .returning();

    return result[0] ?? null;
  },

  /**
   * 薬を削除
   * @param db データベースオブジェクト
   * @param medicineId 薬のID
   * @returns 削除されたかどうか
   */
  async delete(db: DatabaseType, medicineId: number) {
    const result = await db.delete(medicine).where(eq(medicine.medicineId, medicineId)).returning();

    return result.length > 0;
  },
};
