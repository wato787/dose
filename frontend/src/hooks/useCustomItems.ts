/**
 * カスタム項目関連のフック
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getCustomItems, getCustomItem, createCustomItem, updateCustomItem, deleteCustomItem } from "@/api/custom-item"
import type { CustomItem, NewCustomItem } from "@/types/domain"

/**
 * カスタム項目一覧を取得
 */
export const useCustomItems = (params?: {
  medicineId?: number | string
  limit?: number | string
  offset?: number | string
}) => {
  return useQuery({
    queryKey: ["customItems", params],
    queryFn: () => getCustomItems(params),
  })
}

/**
 * カスタム項目を取得
 */
export const useCustomItem = (id: number | null) => {
  return useQuery({
    queryKey: ["customItem", id],
    queryFn: () => getCustomItem(id!),
    enabled: id !== null,
  })
}

/**
 * カスタム項目を作成
 */
export const useCreateCustomItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createCustomItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customItems"] })
    },
  })
}

/**
 * カスタム項目を更新
 */
export const useUpdateCustomItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<NewCustomItem> }) =>
      updateCustomItem(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["customItems"] })
      queryClient.invalidateQueries({ queryKey: ["customItem", variables.id] })
    },
  })
}

/**
 * カスタム項目を削除
 */
export const useDeleteCustomItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteCustomItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customItems"] })
    },
  })
}

