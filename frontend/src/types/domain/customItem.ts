/**
 * カスタム項目関連のドメイン型定義
 */

/**
 * カスタム項目のデータ型
 */
export type CustomItemDataType = "BOOL" | "NUMBER" | "TEXT" | "RATING"

/**
 * カスタムチェック項目設定型
 */
export type CustomItem = {
  customItemId: number
  medicineId: number | null // NULL可 - 薬に紐づかない場合
  itemName: string
  dataType: CustomItemDataType
  isRequired: boolean
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

