/**
 * セッション管理フック
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { getSession, signOut } from "@/api/auth";

/**
 * セッション取得
 */
export const useSession = () => {
  return useQuery({
    queryKey: ["session"],
    queryFn: getSession,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5分
  });
};

/**
 * ログアウト
 */
export const useSignOut = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      queryClient.setQueryData(["session"], null);
      queryClient.clear();
      navigate({ to: "/login" });
    },
  });
};
