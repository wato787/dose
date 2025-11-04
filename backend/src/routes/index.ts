import { Hono } from "hono";
// DBを使用する場合は各ハンドラーで直接インポート
// import { db } from "../db";

const router = new Hono();

// API routes will be added here
router.get("/", (c) => {
  // DBを使用する場合: import { db } from "../db" を追加して使用
  return c.json({ message: "API routes" });
});

export default router;

