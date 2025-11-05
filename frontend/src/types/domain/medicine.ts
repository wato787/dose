/**
 * 薬関連のドメイン型定義
 */

/**
 * 薬の基本情報型
 */
export type Medicine = {
  medicineId: number
  userId: string
  name: string
  description: string | null
  isActive: boolean
  registeredAt: Date
}

/**
 * 新規薬作成時の型
 */
export type NewMedicine = {
  userId: string
  name: string
  description?: string | null
  isActive?: boolean
}

