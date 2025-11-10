/**
 * スケジュール関連のドメイン型定義
 */

/**
 * 服用頻度タイプ
 */
export type FrequencyType = "DAILY" | "WEEKLY" | "CUSTOM";

/**
 * 薬の服用スケジュール型
 */
export type Schedule = {
  scheduleId: number;
  medicineId: number;
  time: string; // 服用予定時刻（例: "08:00", "23:00"）
  frequencyType: FrequencyType;
  startDate: Date;
};

/**
 * 新規スケジュール作成時の型
 */
export type NewSchedule = {
  medicineId: number;
  time: string;
  frequencyType?: FrequencyType;
  startDate: Date;
};
