/**
 * 服用記録関連のドメイン型定義
 */

/**
 * 服用実績型
 */
export type DoseLog = {
  doseLogId: number;
  scheduleId: number;
  recordDate: Date;
  isTaken: boolean;
  takenAt: Date | null;
};

/**
 * 新規服用記録作成時の型
 */
export type NewDoseLog = {
  scheduleId: number;
  recordDate: Date;
  isTaken: boolean;
  takenAt?: Date | null;
};
