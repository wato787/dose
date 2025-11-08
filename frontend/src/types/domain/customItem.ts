/**
 * カスタム項目関連のドメイン型定義
 */

import type { CustomLog } from "./customLog"

/**
 * カスタム項目のデータ型
 */
export type CustomItemDataType = "BOOL" | "NUMBER" | "TEXT" | "RATING"

/**
 * カスタムチェック項目設定型（カスタムログも含む）
 */
export type CustomItem = {
  customItemId: number
  medicineId: number | null // NULL可 - 薬に紐づかない場合
  itemName: string
  dataType: CustomItemDataType
  isRequired: boolean
  customLogs?: CustomLog[]
}

/**
 * 新規カスタム項目作成時の型
 */
export type NewCustomItem = {
  medicineId?: number | null
  itemName: string
  dataType: CustomItemDataType
  isRequired?: boolean
}

