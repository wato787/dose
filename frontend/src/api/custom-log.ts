/**
 * カスタムログ関連のAPI関数
 */

import { get, post, put, del } from "../lib/api"
import { normalizeSearchParams } from "../lib/search-params"

/**
 * カスタムログの型定義
 */
export type CustomLog = {
  customLogId: number
  customItemId: number
  recordDate: Date
  value: string
}

/**
 * 新規カスタムログ作成時の型
 */
export type NewCustomLog = {
  customItemId: number
  recordDate: Date
  value: string
}

/**
 * カスタムログ一覧を取得
 * TanStack RouterのsearchParamsと互換性あり
 */
export const getCustomLogs = async (params?: {
  customItemId?: number | string
  limit?: number | string
  offset?: number | string
}): Promise<{ customLogs: CustomLog[]; count: number }> => {
  const normalizedParams = params ? normalizeSearchParams(params) : undefined
  const queryParams = new URLSearchParams()
  if (normalizedParams?.customItemId !== undefined) {
    queryParams.append("customItemId", normalizedParams.customItemId.toString())
  }
  if (normalizedParams?.limit !== undefined) {
    queryParams.append("limit", normalizedParams.limit.toString())
  }
  if (normalizedParams?.offset !== undefined) {
    queryParams.append("offset", normalizedParams.offset.toString())
  }
  const query = queryParams.toString()
  const response = await get<{ data: { customLogs: CustomLog[]; count: number } }>(`/custom-log${query ? `?${query}` : ""}`)
  return response.data
}

/**
 * カスタムログを取得
 */
export const getCustomLog = async (id: number): Promise<CustomLog> => {
  const response = await get<{ data: CustomLog }>(`/custom-log/${id}`)
  return response.data
}

/**
 * カスタムログを作成
 */
export const createCustomLog = async (data: NewCustomLog): Promise<CustomLog> => {
  const response = await post<{ data: CustomLog }>("/custom-log", data)
  return response.data
}

/**
 * カスタムログを更新
 */
export const updateCustomLog = async (id: number, data: Partial<NewCustomLog>): Promise<CustomLog> => {
  const response = await put<{ data: CustomLog }>(`/custom-log/${id}`, data)
  return response.data
}

/**
 * カスタムログを削除
 */
export const deleteCustomLog = async (id: number): Promise<void> => {
  await del<void>(`/custom-log/${id}`)
}

