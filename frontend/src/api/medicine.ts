/**
 * 薬関連のAPI関数
 */

import { get, post, put, del } from "../lib/api"
import { normalizeSearchParams } from "../lib/search-params"
import type { Medicine, NewMedicine } from "@/types/domain"

/**
 * 薬一覧を取得
 * TanStack RouterのsearchParamsと互換性あり
 */
export const getMedicines = async (params?: {
  isActive?: boolean | string
  limit?: number | string
  offset?: number | string
}): Promise<{ medicines: Medicine[]; count: number }> => {
  const normalizedParams = params ? normalizeSearchParams(params) : undefined
  const queryParams = new URLSearchParams()
  if (normalizedParams?.isActive !== undefined) {
    queryParams.append("isActive", normalizedParams.isActive.toString())
  }
  if (normalizedParams?.limit !== undefined) {
    queryParams.append("limit", normalizedParams.limit.toString())
  }
  if (normalizedParams?.offset !== undefined) {
    queryParams.append("offset", normalizedParams.offset.toString())
  }
  const query = queryParams.toString()
  const response = await get<{ data: { medicines: Medicine[]; count: number } }>(`/medicine${query ? `?${query}` : ""}`)
  return response.data
}

/**
 * 薬を取得
 */
export const getMedicine = async (id: number): Promise<Medicine> => {
  const response = await get<{ data: Medicine }>(`/medicine/${id}`)
  return response.data
}

/**
 * 薬を作成
 */
export const createMedicine = async (data: Omit<NewMedicine, "userId">): Promise<Medicine> => {
  const response = await post<{ data: Medicine }>("/medicine", data)
  return response.data
}

/**
 * 薬を更新
 */
export const updateMedicine = async (id: number, data: Partial<Omit<NewMedicine, "userId">>): Promise<Medicine> => {
  const response = await put<{ data: Medicine }>(`/medicine/${id}`, data)
  return response.data
}

/**
 * 薬を削除
 */
export const deleteMedicine = async (id: number): Promise<void> => {
  await del<void>(`/medicine/${id}`)
}

