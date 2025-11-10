import { redirect } from "@tanstack/react-router";
import { getSession } from "@/api/auth";

/**
 * 認証が必要なルートのbeforeLoadで使用する関数
 * セッションがない場合はログインページにリダイレクト
 */
export const requireAuth = async () => {
  const session = await getSession();
  if (!session) {
    throw redirect({
      to: "/login",
    });
  }
};

/**
 * 認証済みユーザーをリダイレクトする関数（ログインページなどで使用）
 * セッションがある場合はホームページにリダイレクト
 */
export const redirectIfAuthenticated = async () => {
  const session = await getSession();
  if (session) {
    throw redirect({
      to: "/",
    });
  }
};
