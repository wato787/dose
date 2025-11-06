/**
 * 薬一覧を取得するフック
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getMedicines, getMedicine, createMedicine, updateMedicine, deleteMedicine } from "@/api/medicine"
import type { Medicine, NewMedicine } from "@/types/domain"

/**
 * 薬一覧を取得
 */
export const useMedicines = (params?: {
  isActive?: boolean | string
  limit?: number | string
  offset?: number | string
}) => {
  return useQuery({
    queryKey: ["medicines", params],
    queryFn: () => getMedicines(params),
  })
}

/**
 * 薬を取得
 */
export const useMedicine = (id: number | null) => {
  return useQuery({
    queryKey: ["medicine", id],
    queryFn: () => getMedicine(id!),
    enabled: id !== null,
  })
}

/**
 * 薬を作成
 */
export const useCreateMedicine = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createMedicine,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicines"] })
    },
  })
}

/**
 * 薬を更新
 */
export const useUpdateMedicine = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<NewMedicine> }) =>
      updateMedicine(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["medicines"] })
      queryClient.invalidateQueries({ queryKey: ["medicine", variables.id] })
    },
  })
}

/**
 * 薬を削除
 */
export const useDeleteMedicine = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteMedicine,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicines"] })
    },
  })
}

