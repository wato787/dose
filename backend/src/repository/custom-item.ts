import { customItem, medicine } from "../db/schema";
import type { NewCustomItem } from "../db/schema/customItem";
import type { PaginationOptions } from "../types/pagination";
import { eq, and, isNull, or } from "drizzle-orm";
import type { DatabaseType } from "../db";

/**
 * CustomItem Repository
 * カスタム項目に関するデータベース操作を提供する関数群
 */
export const customItemRepository = {
  /**
   * ユーザーのカスタム項目一覧を取得
   * @param db データベースオブジェクト
   * @param userId ユーザーID
   * @param pagination ページネーションオプション
   * @returns カスタム項目の配列
   */
  async findByUserId(db: DatabaseType, userId: string, pagination?: PaginationOptions) {
    const result = await db
      .select({
        customItemId: customItem.customItemId,
        medicineId: customItem.medicineId,
        itemName: customItem.itemName,
        dataType: customItem.dataType,
        isRequired: customItem.isRequired,
      })
      .from(customItem)
      .leftJoin(medicine, eq(customItem.medicineId, medicine.medicineId))
      .where(
        or(
          eq(medicine.userId, userId),
          isNull(customItem.medicineId)
        )
      )
      .limit(pagination?.limit ?? 100)
      .offset(pagination?.offset ?? 0);

    return result;
  },

  /**
   * 特定の薬に紐づくカスタム項目一覧を取得
   * @param db データベースオブジェクト
   * @param userId ユーザーID
   * @param medicineId 薬ID
   * @param pagination ページネーションオプション
   * @returns カスタム項目の配列
   */
  async findByMedicineId(db: DatabaseType, userId: string, medicineId: number, pagination?: PaginationOptions) {
    const result = await db
      .select({
        customItemId: customItem.customItemId,
        medicineId: customItem.medicineId,
        itemName: customItem.itemName,
        dataType: customItem.dataType,
        isRequired: customItem.isRequired,
      })
      .from(customItem)
      .innerJoin(medicine, eq(customItem.medicineId, medicine.medicineId))
      .where(
        and(
          eq(medicine.userId, userId),
          eq(customItem.medicineId, medicineId)
        )
      )
      .limit(pagination?.limit ?? 100)
      .offset(pagination?.offset ?? 0);

    return result;
  },

  /**
   * 特定のカスタム項目をIDとユーザーIDで取得
   * @param db データベースオブジェクト
   * @param userId ユーザーID
   * @param customItemId カスタム項目のID
   * @returns カスタム項目のオブジェクト、見つからない場合はnull
   */
  async findByIdAndUserId(db: DatabaseType, userId: string, customItemId: number) {
    const result = await db
      .select({
        customItemId: customItem.customItemId,
        medicineId: customItem.medicineId,
        itemName: customItem.itemName,
        dataType: customItem.dataType,
        isRequired: customItem.isRequired,
      })
      .from(customItem)
      .leftJoin(medicine, eq(customItem.medicineId, medicine.medicineId))
      .where(
        and(
          eq(customItem.customItemId, customItemId),
          or(
            eq(medicine.userId, userId),
            isNull(customItem.medicineId)
          )
        )
      )
      .limit(1);

    return result[0] ?? null;
  },

  /**
   * カスタム項目を作成
   * @param db データベースオブジェクト
   * @param data 作成データ
   * @returns 作成されたカスタム項目のオブジェクト
   */
  async create(db: DatabaseType, data: Omit<NewCustomItem, "customItemId">) {
    const result = await db
      .insert(customItem)
      .values({
        medicineId: data.medicineId ?? null,
        itemName: data.itemName,
        dataType: data.dataType,
        isRequired: data.isRequired ?? false,
      })
      .returning();

    return result[0];
  },

  /**
   * カスタム項目を更新
   * @param db データベースオブジェクト
   * @param customItemId カスタム項目のID
   * @param data 更新データ
   * @returns 更新されたカスタム項目のオブジェクト、見つからない場合はnull
   */
  async update(
    db: DatabaseType,
    customItemId: number,
    data: Partial<Omit<NewCustomItem, "customItemId">>
  ) {
    const result = await db
      .update(customItem)
      .set(data)
      .where(eq(customItem.customItemId, customItemId))
      .returning();

    return result[0] ?? null;
  },

  /**
   * カスタム項目を削除
   * @param db データベースオブジェクト
   * @param customItemId カスタム項目のID
   * @returns 削除されたかどうか
   */
  async delete(db: DatabaseType, customItemId: number) {
    const result = await db
      .delete(customItem)
      .where(eq(customItem.customItemId, customItemId))
      .returning();

    return result.length > 0;
  },
};
