/**
 * 認証関連のAPI関数
 */

import { get, post } from "../lib/api";

/**
 * サインアップリクエスト
 */
export type SignUpRequest = {
  name: string;
  email: string;
  password: string;
};

/**
 * サインアップレスポンス
 */
export type SignUpResponse = {
  user: {
    id: string;
    name: string;
    email: string;
  };
  session: {
    id: string;
    expiresAt: Date;
  };
};

/**
 * サインアップ
 */
export const signUp = async (data: SignUpRequest): Promise<SignUpResponse> => {
  return post<SignUpResponse>("/auth/sign-up/email", data);
};

/**
 * ログインリクエスト
 */
export type SignInRequest = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

/**
 * ログインレスポンス
 */
export type SignInResponse = {
  user: {
    id: string;
    name: string;
    email: string;
  };
  session: {
    id: string;
    expiresAt: Date;
  };
};

/**
 * ログイン
 */
export const signIn = async (data: SignInRequest): Promise<SignInResponse> => {
  return post<SignInResponse>("/auth/sign-in/email", data);
};

/**
 * セッション情報
 */
export type SessionResponse = {
  user: {
    id: string;
    name: string;
    email: string;
  };
  session: {
    id: string;
    expiresAt: Date;
  };
} | null;

/**
 * セッション取得
 */
export const getSession = async (): Promise<SessionResponse> => {
  return get<SessionResponse>("/auth/get-session");
};

/**
 * ログアウト
 */
export const signOut = async (): Promise<void> => {
  return post<void>("/auth/sign-out", {});
};
