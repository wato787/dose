/**
 * スケジュール関連のフック
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getSchedules, getSchedule, createSchedule, updateSchedule, deleteSchedule } from "@/api/schedule"
import type { Schedule, NewSchedule } from "@/types/domain"

/**
 * スケジュール一覧を取得
 */
export const useSchedules = (params?: {
  medicineId?: number | string
  limit?: number | string
  offset?: number | string
}) => {
  return useQuery({
    queryKey: ["schedules", params],
    queryFn: () => getSchedules(params),
  })
}

/**
 * スケジュールを取得
 */
export const useSchedule = (id: number | null) => {
  return useQuery({
    queryKey: ["schedule", id],
    queryFn: () => getSchedule(id!),
    enabled: id !== null,
  })
}

/**
 * スケジュールを作成
 */
export const useCreateSchedule = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] })
    },
  })
}

/**
 * スケジュールを更新
 */
export const useUpdateSchedule = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<NewSchedule> }) =>
      updateSchedule(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] })
      queryClient.invalidateQueries({ queryKey: ["schedule", variables.id] })
    },
  })
}

/**
 * スケジュールを削除
 */
export const useDeleteSchedule = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] })
    },
  })
}

