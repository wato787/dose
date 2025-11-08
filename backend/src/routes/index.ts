import { Hono } from "hono";
import medicineRouter from "./medicine";
import customLogRouter from "./custom-log";
import doseLogRouter from "./dose-log";

const router = new Hono();

// API routes
router.get("/", (c) => {
  return c.json({ message: "API routes" });
});

// Medicine routes (includes schedule and customItems - all operations)
router.route("/medicine", medicineRouter);

// CustomLog routes
router.route("/custom-log", customLogRouter);

// DoseLog routes
router.route("/dose-log", doseLogRouter);

export default router;

