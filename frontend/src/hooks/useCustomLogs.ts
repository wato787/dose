/**
 * カスタムログ関連のフック
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getCustomLogs, getCustomLog, createCustomLog, updateCustomLog, deleteCustomLog } from "@/api/custom-log"
import type { CustomLog, NewCustomLog } from "@/api/custom-log"

/**
 * カスタムログ一覧を取得
 */
export const useCustomLogs = (params?: {
  customItemId?: number | string
  limit?: number | string
  offset?: number | string
}) => {
  return useQuery({
    queryKey: ["customLogs", params],
    queryFn: () => getCustomLogs(params),
  })
}

/**
 * カスタムログを取得
 */
export const useCustomLog = (id: number | null) => {
  return useQuery({
    queryKey: ["customLog", id],
    queryFn: () => getCustomLog(id!),
    enabled: id !== null,
  })
}

/**
 * カスタムログを作成
 */
export const useCreateCustomLog = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createCustomLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customLogs"] })
    },
  })
}

/**
 * カスタムログを更新
 */
export const useUpdateCustomLog = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<NewCustomLog> }) =>
      updateCustomLog(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["customLogs"] })
      queryClient.invalidateQueries({ queryKey: ["customLog", variables.id] })
    },
  })
}

/**
 * カスタムログを削除
 */
export const useDeleteCustomLog = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteCustomLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customLogs"] })
    },
  })
}

