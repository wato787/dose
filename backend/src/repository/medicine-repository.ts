import { db } from "../db";
import { medicine } from "../db/schema";
import { eq, and, SQL } from "drizzle-orm";

/**
 * 薬の作成データ
 */
export interface CreateMedicineData {
  userId: string;
  name: string;
  description?: string | null;
  isActive?: boolean;
}

/**
 * 薬の更新データ
 */
export interface UpdateMedicineData {
  name?: string;
  description?: string | null;
  isActive?: boolean;
}

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

  /**
   * 薬を作成
   * @param data 作成データ
   * @returns 作成された薬のオブジェクト
   */
  async create(data: CreateMedicineData) {
    const result = await db
      .insert(medicine)
      .values({
        userId: data.userId,
        name: data.name,
        description: data.description ?? null,
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
    data: UpdateMedicineData
  ) {
    const updateData: Partial<typeof medicine.$inferInsert> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    const result = await db
      .update(medicine)
      .set(updateData)
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

