/**
 * ログインフック
 */

import { useMutation } from "@tanstack/react-query"
import { signIn } from "@/api/auth"
import { useNavigate } from "@tanstack/react-router"

/**
 * ログイン
 */
export const useLogin = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: signIn,
    onSuccess: () => {
      navigate({ to: "/" })
    },
  })
}

