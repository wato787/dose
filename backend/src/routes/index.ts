import { Hono } from "hono";

const router = new Hono();

// API routes will be added here
router.get("/", (c) => {
  return c.json({ message: "API routes" });
});

export default router;

