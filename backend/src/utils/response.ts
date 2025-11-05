import type { Context } from "hono";

/**
 * 成功レスポンス（200 OK）
 */
export function ok<T>(c: Context, data: T, statusCode: number = 200) {
  return c.json({ data }, statusCode as never);
}

/**
 * 作成成功レスポンス（201 Created）
 */
export function created<T>(c: Context, data: T) {
  return c.json({ data }, 201);
}

/**
 * 更新成功レスポンス（200 OK）
 */
export function updated<T>(c: Context, data: T) {
  return c.json({ data }, 200);
}

/**
 * 削除成功レスポンス（204 No Content）
 */
export function noContent(c: Context) {
  return c.body(null, 204);
}

