/**
 * サインアップフック
 */

import { useMutation } from "@tanstack/react-query"
import { signUp } from "@/api/auth"
import { useNavigate } from "@tanstack/react-router"

/**
 * サインアップ
 */
export const useSignUp = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: signUp,
    onSuccess: () => {
      navigate({ to: "/" })
    },
  })
}

