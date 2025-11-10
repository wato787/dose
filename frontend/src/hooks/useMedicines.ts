/**
 * 薬一覧を取得するフック
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createMedicine,
  deleteMedicine,
  getMedicine,
  getMedicines,
  updateMedicine,
} from "@/api/medicine";

/**
 * 薬一覧を取得
 */
export const useMedicines = (params?: {
  isActive?: boolean | string;
  limit?: number | string;
  offset?: number | string;
}) => {
  return useQuery({
    queryKey: ["medicines", params],
    queryFn: () => getMedicines(params),
  });
};

/**
 * 薬を取得
 */
export const useMedicine = (id: number | null) => {
  return useQuery({
    queryKey: ["medicine", id],
    queryFn: () => getMedicine(id!),
    enabled: id !== null,
  });
};

/**
 * 薬を作成
 */
export const useCreateMedicine = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMedicine,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicines"] });
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      queryClient.invalidateQueries({ queryKey: ["customItems"] });
    },
  });
};

/**
 * 薬を更新
 */
export const useUpdateMedicine = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Parameters<typeof updateMedicine>[1] }) =>
      updateMedicine(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["medicines"] });
      queryClient.invalidateQueries({ queryKey: ["medicine", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      queryClient.invalidateQueries({ queryKey: ["customItems"] });
    },
  });
};

/**
 * 薬を削除
 */
export const useDeleteMedicine = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMedicine,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicines"] });
    },
  });
};
