/**
 * カスタムログ関連のドメイン型定義
 */

/**
 * カスタムログ型
 */
export type CustomLog = {
  customLogId: number;
  customItemId: number;
  recordDate: Date;
  value: string;
};

/**
 * 新規カスタムログ作成時の型
 */
export type NewCustomLog = {
  customItemId: number;
  recordDate: Date;
  value: string;
};
