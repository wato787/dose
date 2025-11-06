/**
 * 服用ログ関連のAPI関数
 */

import { get, post, put, del } from "../lib/api"
import { normalizeSearchParams } from "../lib/search-params"
import type { DoseLog, NewDoseLog } from "@/types/domain"

/**
 * 服用ログ一覧を取得
 * TanStack RouterのsearchParamsと互換性あり
 */
export const getDoseLogs = async (params?: {
  scheduleId?: number | string
  limit?: number | string
  offset?: number | string
}): Promise<{ doseLogs: DoseLog[]; count: number }> => {
  const normalizedParams = params ? normalizeSearchParams(params) : undefined
  const queryParams = new URLSearchParams()
  if (normalizedParams?.scheduleId !== undefined) {
    queryParams.append("scheduleId", normalizedParams.scheduleId.toString())
  }
  if (normalizedParams?.limit !== undefined) {
    queryParams.append("limit", normalizedParams.limit.toString())
  }
  if (normalizedParams?.offset !== undefined) {
    queryParams.append("offset", normalizedParams.offset.toString())
  }
  const query = queryParams.toString()
  const response = await get<{ data: { doseLogs: DoseLog[]; count: number } }>(`/dose-log${query ? `?${query}` : ""}`)
  return response.data
}

/**
 * 服用ログを取得
 */
export const getDoseLog = async (id: number): Promise<DoseLog> => {
  const response = await get<{ data: DoseLog }>(`/dose-log/${id}`)
  return response.data
}

/**
 * 服用ログを作成
 */
export const createDoseLog = async (data: NewDoseLog): Promise<DoseLog> => {
  const response = await post<{ data: DoseLog }>("/dose-log", data)
  return response.data
}

/**
 * 服用ログを更新
 */
export const updateDoseLog = async (id: number, data: Partial<NewDoseLog>): Promise<DoseLog> => {
  const response = await put<{ data: DoseLog }>(`/dose-log/${id}`, data)
  return response.data
}

/**
 * 服用ログを削除
 */
export const deleteDoseLog = async (id: number): Promise<void> => {
  await del<void>(`/dose-log/${id}`)
}

