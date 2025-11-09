import { customLog, customItem, medicine } from "../db/schema";
import type { NewCustomLog } from "../db/schema/customLog";
import type { PaginationOptions } from "../types/pagination";
import { eq, and, or, isNull } from "drizzle-orm";
import type { DatabaseType } from "../db";

/**
 * CustomLog Repository
 * カスタム項目の値に関するデータベース操作を提供する関数群
 */
export const customLogRepository = {
  /**
   * ユーザーのカスタムログ一覧を取得
   * @param db データベースオブジェクト
   * @param userId ユーザーID
   * @param pagination ページネーションオプション
   * @returns カスタムログの配列
   */
  async findByUserId(db: DatabaseType, userId: string, pagination?: PaginationOptions) {
    const result = await db
      .select({
        customLogId: customLog.customLogId,
        customItemId: customLog.customItemId,
        recordDate: customLog.recordDate,
        value: customLog.value,
      })
      .from(customLog)
      .innerJoin(customItem, eq(customLog.customItemId, customItem.customItemId))
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
   * 特定のカスタム項目に紐づくカスタムログ一覧を取得
   * @param db データベースオブジェクト
   * @param userId ユーザーID
   * @param customItemId カスタム項目ID
   * @param pagination ページネーションオプション
   * @returns カスタムログの配列
   */
  async findByCustomItemId(db: DatabaseType, userId: string, customItemId: number, pagination?: PaginationOptions) {
    const result = await db
      .select({
        customLogId: customLog.customLogId,
        customItemId: customLog.customItemId,
        recordDate: customLog.recordDate,
        value: customLog.value,
      })
      .from(customLog)
      .innerJoin(customItem, eq(customLog.customItemId, customItem.customItemId))
      .leftJoin(medicine, eq(customItem.medicineId, medicine.medicineId))
      .where(
        and(
          eq(customLog.customItemId, customItemId),
          or(
            eq(medicine.userId, userId),
            isNull(customItem.medicineId)
          )
        )
      )
      .limit(pagination?.limit ?? 100)
      .offset(pagination?.offset ?? 0);

    return result;
  },

  /**
   * 特定のカスタムログをIDとユーザーIDで取得
   * @param db データベースオブジェクト
   * @param userId ユーザーID
   * @param customLogId カスタムログのID
   * @returns カスタムログのオブジェクト、見つからない場合はnull
   */
  async findByIdAndUserId(db: DatabaseType, userId: string, customLogId: number) {
    const result = await db
      .select({
        customLogId: customLog.customLogId,
        customItemId: customLog.customItemId,
        recordDate: customLog.recordDate,
        value: customLog.value,
      })
      .from(customLog)
      .innerJoin(customItem, eq(customLog.customItemId, customItem.customItemId))
      .leftJoin(medicine, eq(customItem.medicineId, medicine.medicineId))
      .where(
        and(
          eq(customLog.customLogId, customLogId),
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
   * カスタムログを作成
   * @param db データベースオブジェクト
   * @param data 作成データ
   * @returns 作成されたカスタムログのオブジェクト
   */
  async create(db: DatabaseType, data: Omit<NewCustomLog, "customLogId">) {
    const result = await db
      .insert(customLog)
      .values({
        customItemId: data.customItemId,
        recordDate: data.recordDate,
        value: data.value,
      })
      .returning();

    return result[0];
  },

  /**
   * カスタムログを更新
   * @param db データベースオブジェクト
   * @param customLogId カスタムログのID
   * @param data 更新データ
   * @returns 更新されたカスタムログのオブジェクト、見つからない場合はnull
   */
  async update(
    db: DatabaseType,
    customLogId: number,
    data: Partial<Omit<NewCustomLog, "customLogId">>
  ) {
    const result = await db
      .update(customLog)
      .set(data)
      .where(eq(customLog.customLogId, customLogId))
      .returning();

    return result[0] ?? null;
  },

  /**
   * カスタムログを削除
   * @param db データベースオブジェクト
   * @param customLogId カスタムログのID
   * @returns 削除されたかどうか
   */
  async delete(db: DatabaseType, customLogId: number) {
    const result = await db
      .delete(customLog)
      .where(eq(customLog.customLogId, customLogId))
      .returning();

    return result.length > 0;
  },
};
