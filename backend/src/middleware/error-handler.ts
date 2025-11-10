import type { MiddlewareHandler } from "hono";
import { HttpException } from "../utils/http-exception";

/**
 * エラーハンドリングミドルウェア
 * HttpExceptionをキャッチして適切なレスポンスを返す
 */
export const errorHandler: MiddlewareHandler = async (c, next) => {
  try {
    await next();
  } catch (error) {
    if (error instanceof HttpException) {
      return error.toResponse(c);
    }

    // 予期しないエラー
    console.error("Unhandled error:", error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
};
