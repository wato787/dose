import { Hono } from "hono";
import medicineRouter from "./medicine";
import customItemRouter from "./custom-item";
import doseLogRouter from "./dose-log";
import scheduleRouter from "./schedule";

const router = new Hono();

// API routes
router.get("/", (c) => {
  return c.json({ message: "API routes" });
});

// Medicine routes
router.route("/medicine", medicineRouter);

// CustomItem routes
router.route("/custom-item", customItemRouter);

// DoseLog routes
router.route("/dose-log", doseLogRouter);

// Schedule routes
router.route("/schedule", scheduleRouter);

export default router;

