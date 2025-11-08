import { Hono } from "hono";
import medicineRouter from "./medicine";
import doseLogRouter from "./dose-log";

const router = new Hono();

// API routes
router.get("/", (c) => {
  return c.json({ message: "API routes" });
});

// Medicine routes (includes schedule, customItems, and customLogs - all operations)
router.route("/medicine", medicineRouter);

// DoseLog routes
router.route("/dose-log", doseLogRouter);

export default router;

