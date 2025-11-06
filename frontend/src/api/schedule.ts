/**
 * スケジュール関連のAPI関数
 */

import { get, post, put, del } from "../lib/api"
import { normalizeSearchParams } from "../lib/search-params"
import type { Schedule, NewSchedule } from "@/types/domain"

/**
 * スケジュール一覧を取得
 * TanStack RouterのsearchParamsと互換性あり
 */
export const getSchedules = async (params?: {
  medicineId?: number | string
  limit?: number | string
  offset?: number | string
}): Promise<{ schedules: Schedule[]; count: number }> => {
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
  const response = await get<{ data: { schedules: Schedule[]; count: number } }>(`/schedule${query ? `?${query}` : ""}`)
  return response.data
}

/**
 * スケジュールを取得
 */
export const getSchedule = async (id: number): Promise<Schedule> => {
  const response = await get<{ data: Schedule }>(`/schedule/${id}`)
  return response.data
}

/**
 * スケジュールを作成
 */
export const createSchedule = async (data: NewSchedule): Promise<Schedule> => {
  const response = await post<{ data: Schedule }>("/schedule", data)
  return response.data
}

/**
 * スケジュールを更新
 */
export const updateSchedule = async (id: number, data: Partial<NewSchedule>): Promise<Schedule> => {
  const response = await put<{ data: Schedule }>(`/schedule/${id}`, data)
  return response.data
}

/**
 * スケジュールを削除
 */
export const deleteSchedule = async (id: number): Promise<void> => {
  await del<void>(`/schedule/${id}`)
}

