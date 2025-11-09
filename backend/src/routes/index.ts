import { Hono } from "hono";
import medicineRouter from "./medicine";
import doseLogRouter from "./dose-log";

const router = new Hono();

router.get("/", (c) => {
  return c.json({ message: "API routes" });
});

router.route("/medicine", medicineRouter);
router.route("/dose-log", doseLogRouter);

export default router;

