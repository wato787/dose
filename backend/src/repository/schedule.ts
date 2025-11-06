import { db } from "../db";
import { schedule, medicine } from "../db/schema";
import type { NewSchedule } from "../db/schema/schedule";
import type { PaginationOptions } from "../types/pagination";
import { eq, and } from "drizzle-orm";

/**
 * Schedule Repository
 * スケジュールに関するデータベース操作を提供する関数群
 */
export const scheduleRepository = {
  /**
   * ユーザーのスケジュール一覧を取得
   * @param userId ユーザーID
   * @param pagination ページネーションオプション
   * @returns スケジュールの配列
   */
  async findByUserId(userId: string, pagination?: PaginationOptions) {
    const result = await db
      .select({
        scheduleId: schedule.scheduleId,
        medicineId: schedule.medicineId,
        time: schedule.time,
        frequencyType: schedule.frequencyType,
        startDate: schedule.startDate,
      })
      .from(schedule)
      .innerJoin(medicine, eq(schedule.medicineId, medicine.medicineId))
      .where(eq(medicine.userId, userId))
      .limit(pagination?.limit ?? 100)
      .offset(pagination?.offset ?? 0);

    return result;
  },

  /**
   * 特定の薬に紐づくスケジュール一覧を取得
   * @param userId ユーザーID
   * @param medicineId 薬ID
   * @param pagination ページネーションオプション
   * @returns スケジュールの配列
   */
  async findByMedicineId(userId: string, medicineId: number, pagination?: PaginationOptions) {
    const result = await db
      .select({
        scheduleId: schedule.scheduleId,
        medicineId: schedule.medicineId,
        time: schedule.time,
        frequencyType: schedule.frequencyType,
        startDate: schedule.startDate,
      })
      .from(schedule)
      .innerJoin(medicine, eq(schedule.medicineId, medicine.medicineId))
      .where(
        and(
          eq(medicine.userId, userId),
          eq(schedule.medicineId, medicineId)
        )
      )
      .limit(pagination?.limit ?? 100)
      .offset(pagination?.offset ?? 0);

    return result;
  },

  /**
   * 特定のスケジュールをIDとユーザーIDで取得
   * @param userId ユーザーID
   * @param scheduleId スケジュールのID
   * @returns スケジュールのオブジェクト、見つからない場合はnull
   */
  async findByIdAndUserId(userId: string, scheduleId: number) {
    const result = await db
      .select({
        scheduleId: schedule.scheduleId,
        medicineId: schedule.medicineId,
        time: schedule.time,
        frequencyType: schedule.frequencyType,
        startDate: schedule.startDate,
      })
      .from(schedule)
      .innerJoin(medicine, eq(schedule.medicineId, medicine.medicineId))
      .where(
        and(
          eq(schedule.scheduleId, scheduleId),
          eq(medicine.userId, userId)
        )
      )
      .limit(1);

    return result[0] ?? null;
  },

  /**
   * スケジュールを作成
   * @param data 作成データ
   * @returns 作成されたスケジュールのオブジェクト
   */
  async create(data: Omit<NewSchedule, "scheduleId">) {
    const result = await db
      .insert(schedule)
      .values({
        medicineId: data.medicineId,
        time: data.time,
        frequencyType: data.frequencyType ?? "DAILY",
        startDate: data.startDate,
      })
      .returning();

    return result[0];
  },

  /**
   * スケジュールを更新
   * @param scheduleId スケジュールのID
   * @param data 更新データ
   * @returns 更新されたスケジュールのオブジェクト、見つからない場合はnull
   */
  async update(
    scheduleId: number,
    data: Partial<Omit<NewSchedule, "scheduleId">>
  ) {
    const result = await db
      .update(schedule)
      .set(data)
      .where(eq(schedule.scheduleId, scheduleId))
      .returning();

    return result[0] ?? null;
  },

  /**
   * スケジュールを削除
   * @param scheduleId スケジュールのID
   * @returns 削除されたかどうか
   */
  async delete(scheduleId: number) {
    const result = await db
      .delete(schedule)
      .where(eq(schedule.scheduleId, scheduleId))
      .returning();

    return result.length > 0;
  },
};

