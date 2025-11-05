/**
 * 認証関連のAPI関数
 */

import { post } from "../lib/api"

/**
 * サインアップリクエスト
 */
export type SignUpRequest = {
  name: string
  email: string
  password: string
}

/**
 * サインアップレスポンス
 */
export type SignUpResponse = {
  user: {
    id: string
    name: string
    email: string
  }
  session: {
    id: string
    expiresAt: Date
  }
}

/**
 * サインアップ
 */
export const signUp = async (data: SignUpRequest): Promise<SignUpResponse> => {
  return post<SignUpResponse>("/auth/sign-up/email", data)
}

