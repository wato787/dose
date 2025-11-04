import { MiddlewareHandler } from "hono";
import { auth } from "../lib/auth";

/**
 * 認証middleware
 * セッションを確認し、認証されたユーザーIDをContextに設定します
 */
export const authMiddleware: MiddlewareHandler = async (c, next) => {
  try {
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });

    if (!session?.user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // ContextにユーザーIDを設定
    c.set("userId", session.user.id);

    await next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
};

