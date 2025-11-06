/**
 * 服用ログ関連のフック
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getDoseLogs, getDoseLog, createDoseLog, updateDoseLog, deleteDoseLog } from "@/api/dose-log"
import type { DoseLog, NewDoseLog } from "@/types/domain"

/**
 * 服用ログ一覧を取得
 */
export const useDoseLogs = (params?: {
  scheduleId?: number | string
  limit?: number | string
  offset?: number | string
}) => {
  return useQuery({
    queryKey: ["doseLogs", params],
    queryFn: () => getDoseLogs(params),
  })
}

/**
 * 服用ログを取得
 */
export const useDoseLog = (id: number | null) => {
  return useQuery({
    queryKey: ["doseLog", id],
    queryFn: () => getDoseLog(id!),
    enabled: id !== null,
  })
}

/**
 * 服用ログを作成
 */
export const useCreateDoseLog = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createDoseLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doseLogs"] })
    },
  })
}

/**
 * 服用ログを更新
 */
export const useUpdateDoseLog = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<NewDoseLog> }) =>
      updateDoseLog(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["doseLogs"] })
      queryClient.invalidateQueries({ queryKey: ["doseLog", variables.id] })
    },
  })
}

/**
 * 服用ログを削除
 */
export const useDeleteDoseLog = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteDoseLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doseLogs"] })
    },
  })
}

