/**
 * 薬関連のドメイン型定義
 */

import type { CustomItem } from "./customItem";
import type { Schedule } from "./schedule";

/**
 * 薬の基本情報型（スケジュールとカスタムアイテムを含む）
 */
export type Medicine = {
  medicineId: number;
  userId: string;
  name: string;
  description: string | null;
  isActive: boolean;
  registeredAt: Date;
  schedules?: Schedule[];
  customItems?: CustomItem[];
};

/**
 * 新規薬作成時の型
 */
export type NewMedicine = {
  userId: string;
  name: string;
  description?: string | null;
  isActive?: boolean;
};
