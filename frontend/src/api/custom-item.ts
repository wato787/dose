/**
 * カスタム項目関連のAPI関数
 */

import { get, post, put, del } from "../lib/api"
import { normalizeSearchParams } from "../lib/search-params"
import type { CustomItem, NewCustomItem } from "@/types/domain"

/**
 * カスタム項目一覧を取得
 * TanStack RouterのsearchParamsと互換性あり
 */
export const getCustomItems = async (params?: {
  medicineId?: number | string
  limit?: number | string
  offset?: number | string
}): Promise<{ customItems: CustomItem[]; count: number }> => {
  const normalizedParams = params ? normalizeSearchParams(params) : undefined
  const queryParams = new URLSearchParams()
  if (normalizedParams?.medicineId !== undefined) {
    queryParams.append("medicineId", normalizedParams.medicineId.toString())
  }
  if (normalizedParams?.limit !== undefined) {
    queryParams.append("limit", normalizedParams.limit.toString())
  }
  if (normalizedParams?.offset !== undefined) {
    queryParams.append("offset", normalizedParams.offset.toString())
  }
  const query = queryParams.toString()
  const response = await get<{ data: { customItems: CustomItem[]; count: number } }>(`/custom-item${query ? `?${query}` : ""}`)
  return response.data
}

/**
 * カスタム項目を取得
 */
export const getCustomItem = async (id: number): Promise<CustomItem> => {
  const response = await get<{ data: CustomItem }>(`/custom-item/${id}`)
  return response.data
}

/**
 * カスタム項目を作成
 */
export const createCustomItem = async (data: NewCustomItem): Promise<CustomItem> => {
  const response = await post<{ data: CustomItem }>("/custom-item", data)
  return response.data
}

/**
 * カスタム項目を更新
 */
export const updateCustomItem = async (id: number, data: Partial<NewCustomItem>): Promise<CustomItem> => {
  const response = await put<{ data: CustomItem }>(`/custom-item/${id}`, data)
  return response.data
}

/**
 * カスタム項目を削除
 */
export const deleteCustomItem = async (id: number): Promise<void> => {
  await del<void>(`/custom-item/${id}`)
}

