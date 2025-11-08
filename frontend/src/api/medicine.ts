/**
 * 薬関連のAPI関数
 */

import { get, post, put, del } from "../lib/api"
import { normalizeSearchParams } from "../lib/search-params"
import type { Medicine, NewMedicine, FrequencyType, NewCustomItem } from "@/types/domain"

type CreateMedicineRequest = Omit<NewMedicine, "userId"> & {
  schedule?: {
    time: string
    frequencyType: FrequencyType
    startDate: Date
  }
  customItems?: NewCustomItem[]
}

type UpdateMedicineRequest = Partial<Omit<NewMedicine, "userId">> & {
  schedule?: {
    time: string
    frequencyType: FrequencyType
    startDate: Date
  } | null
  customItems?: NewCustomItem[]
}

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
 * 薬を作成（スケジュールとカスタムアイテムも同時に作成可能）
 */
export const createMedicine = async (data: CreateMedicineRequest): Promise<Medicine> => {
  const response = await post<{ data: Medicine }>("/medicine", {
    ...data,
    schedule: data.schedule ? {
      ...data.schedule,
      startDate: data.schedule.startDate.toISOString(),
    } : undefined,
  })
  return response.data
}

/**
 * 薬を更新（スケジュールとカスタムアイテムも同時に更新可能）
 */
export const updateMedicine = async (id: number, data: UpdateMedicineRequest): Promise<Medicine> => {
  const response = await put<{ data: Medicine }>(`/medicine/${id}`, {
    ...data,
    schedule: data.schedule !== undefined ? (data.schedule ? {
      ...data.schedule,
      startDate: data.schedule.startDate instanceof Date ? data.schedule.startDate.toISOString() : data.schedule.startDate,
    } : null) : undefined,
  })
  return response.data
}

/**
 * 薬を削除
 */
export const deleteMedicine = async (id: number): Promise<void> => {
  await del<void>(`/medicine/${id}`)
}

/**
 * カスタムログを作成（medicineに紐づく）
 */
export const createCustomLog = async (medicineId: number, data: {
  customItemId: number
  recordDate: Date
  value: string
}): Promise<{ customLogId: number; customItemId: number; recordDate: Date; value: string }> => {
  const response = await post<{ data: { customLogId: number; customItemId: number; recordDate: Date; value: string } }>(
    `/medicine/${medicineId}/custom-logs`,
    {
      ...data,
      recordDate: data.recordDate.toISOString(),
    }
  )
  return response.data
}

/**
 * カスタムログを更新（medicineに紐づく）
 */
export const updateCustomLog = async (medicineId: number, customLogId: number, data: {
  recordDate?: Date
  value?: string
}): Promise<{ customLogId: number; customItemId: number; recordDate: Date; value: string }> => {
  const response = await put<{ data: { customLogId: number; customItemId: number; recordDate: Date; value: string } }>(
    `/medicine/${medicineId}/custom-logs/${customLogId}`,
    {
      ...data,
      recordDate: data.recordDate ? data.recordDate.toISOString() : undefined,
    }
  )
  return response.data
}

/**
 * カスタムログを削除（medicineに紐づく）
 */
export const deleteCustomLog = async (medicineId: number, customLogId: number): Promise<void> => {
  await del<void>(`/medicine/${medicineId}/custom-logs/${customLogId}`)
}

