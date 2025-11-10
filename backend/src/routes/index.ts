import { Hono } from "hono";
import doseLogRouter from "./dose-log";
import medicineRouter from "./medicine";

const router = new Hono();

router.get("/", (c) => {
  return c.json({ message: "API routes" });
});

router.route("/medicine", medicineRouter);
router.route("/dose-log", doseLogRouter);

export default router;
