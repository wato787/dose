import { doseLog, schedule, medicine } from "../db/schema";
import type { NewDoseLog } from "../db/schema/doseLog";
import type { PaginationOptions } from "../types/pagination";
import { eq, and } from "drizzle-orm";
import type { DatabaseType } from "../db";

/**
 * DoseLog Repository
 * 服用ログに関するデータベース操作を提供する関数群
 */
export const doseLogRepository = {
  /**
   * ユーザーの服用ログ一覧を取得
   * @param db データベースオブジェクト
   * @param userId ユーザーID
   * @param pagination ページネーションオプション
   * @returns 服用ログの配列
   */
  async findByUserId(db: DatabaseType, userId: string, pagination?: PaginationOptions) {
    const result = await db
      .select({
        doseLogId: doseLog.doseLogId,
        scheduleId: doseLog.scheduleId,
        recordDate: doseLog.recordDate,
        isTaken: doseLog.isTaken,
        takenAt: doseLog.takenAt,
      })
      .from(doseLog)
      .innerJoin(schedule, eq(doseLog.scheduleId, schedule.scheduleId))
      .innerJoin(medicine, eq(schedule.medicineId, medicine.medicineId))
      .where(eq(medicine.userId, userId))
      .limit(pagination?.limit ?? 100)
      .offset(pagination?.offset ?? 0);

    return result;
  },

  /**
   * 特定のスケジュールに紐づく服用ログ一覧を取得
   * @param db データベースオブジェクト
   * @param userId ユーザーID
   * @param scheduleId スケジュールID
   * @param pagination ページネーションオプション
   * @returns 服用ログの配列
   */
  async findByScheduleId(db: DatabaseType, userId: string, scheduleId: number, pagination?: PaginationOptions) {
    const result = await db
      .select({
        doseLogId: doseLog.doseLogId,
        scheduleId: doseLog.scheduleId,
        recordDate: doseLog.recordDate,
        isTaken: doseLog.isTaken,
        takenAt: doseLog.takenAt,
      })
      .from(doseLog)
      .innerJoin(schedule, eq(doseLog.scheduleId, schedule.scheduleId))
      .innerJoin(medicine, eq(schedule.medicineId, medicine.medicineId))
      .where(
        and(
          eq(medicine.userId, userId),
          eq(doseLog.scheduleId, scheduleId)
        )
      )
      .limit(pagination?.limit ?? 100)
      .offset(pagination?.offset ?? 0);

    return result;
  },

  /**
   * 特定の服用ログをIDとユーザーIDで取得
   * @param db データベースオブジェクト
   * @param userId ユーザーID
   * @param doseLogId 服用ログのID
   * @returns 服用ログのオブジェクト、見つからない場合はnull
   */
  async findByIdAndUserId(db: DatabaseType, userId: string, doseLogId: number) {
    const result = await db
      .select({
        doseLogId: doseLog.doseLogId,
        scheduleId: doseLog.scheduleId,
        recordDate: doseLog.recordDate,
        isTaken: doseLog.isTaken,
        takenAt: doseLog.takenAt,
      })
      .from(doseLog)
      .innerJoin(schedule, eq(doseLog.scheduleId, schedule.scheduleId))
      .innerJoin(medicine, eq(schedule.medicineId, medicine.medicineId))
      .where(
        and(
          eq(doseLog.doseLogId, doseLogId),
          eq(medicine.userId, userId)
        )
      )
      .limit(1);

    return result[0] ?? null;
  },

  /**
   * 服用ログを作成
   * @param db データベースオブジェクト
   * @param data 作成データ
   * @returns 作成された服用ログのオブジェクト
   */
  async create(db: DatabaseType, data: Omit<NewDoseLog, "doseLogId">) {
    const result = await db
      .insert(doseLog)
      .values({
        scheduleId: data.scheduleId,
        recordDate: data.recordDate,
        isTaken: data.isTaken,
        takenAt: data.takenAt ?? null,
      })
      .returning();

    return result[0];
  },

  /**
   * 服用ログを更新
   * @param db データベースオブジェクト
   * @param doseLogId 服用ログのID
   * @param data 更新データ
   * @returns 更新された服用ログのオブジェクト、見つからない場合はnull
   */
  async update(
    db: DatabaseType,
    doseLogId: number,
    data: Partial<Omit<NewDoseLog, "doseLogId">>
  ) {
    const result = await db
      .update(doseLog)
      .set(data)
      .where(eq(doseLog.doseLogId, doseLogId))
      .returning();

    return result[0] ?? null;
  },

  /**
   * 服用ログを削除
   * @param db データベースオブジェクト
   * @param doseLogId 服用ログのID
   * @returns 削除されたかどうか
   */
  async delete(db: DatabaseType, doseLogId: number) {
    const result = await db
      .delete(doseLog)
      .where(eq(doseLog.doseLogId, doseLogId))
      .returning();

    return result.length > 0;
  },
};
