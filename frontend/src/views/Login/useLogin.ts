/**
 * ログインフック
 */

import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { signIn } from "@/api/auth";

/**
 * ログイン
 */
export const useLogin = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: signIn,
    onSuccess: () => {
      navigate({ to: "/" });
    },
  });
};
