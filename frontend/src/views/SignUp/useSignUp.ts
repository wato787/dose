/**
 * サインアップフック
 */

import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { signUp } from "@/api/auth";

/**
 * サインアップ
 */
export const useSignUp = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: signUp,
    onSuccess: () => {
      navigate({ to: "/" });
    },
  });
};
