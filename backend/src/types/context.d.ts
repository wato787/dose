/**
 * HonoのContextに設定する変数の型定義
 */
declare module "hono" {
  interface ContextVariableMap {
    userId: string;
  }
}

export {};
