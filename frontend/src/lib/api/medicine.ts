/**
 * 薬関連のAPI関数
 */

import { get, post, put, del } from "../api"
import type { Medicine, NewMedicine } from "@/types/domain"

/**
 * 薬一覧を取得
 */
export const getMedicines = async (): Promise<Medicine[]> => {
  return get<Medicine[]>("/medicine")
}

/**
 * 薬を取得
 */
export const getMedicine = async (id: number): Promise<Medicine> => {
  return get<Medicine>(`/medicine/${id}`)
}

/**
 * 薬を作成
 */
export const createMedicine = async (data: NewMedicine): Promise<Medicine> => {
  return post<Medicine>("/medicine", data)
}

/**
 * 薬を更新
 */
export const updateMedicine = async (id: number, data: Partial<NewMedicine>): Promise<Medicine> => {
  return put<Medicine>(`/medicine/${id}`, data)
}

/**
 * 薬を削除
 */
export const deleteMedicine = async (id: number): Promise<void> => {
  return del<void>(`/medicine/${id}`)
}

