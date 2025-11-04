import { Hono } from "hono";
import medicineRouter from "./medicine";

const router = new Hono();

// API routes
router.get("/", (c) => {
  return c.json({ message: "API routes" });
});

// Medicine routes
router.route("/medicine", medicineRouter);

export default router;

