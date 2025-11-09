import { Hono } from "hono";
import { authMiddleware } from "../../middleware";
import findDoseLogsRouter from "./routes/find-dose-logs";
import findDoseLogRouter from "./routes/find-dose-log";
import createDoseLogRouter from "./routes/create-dose-log";
import updateDoseLogRouter from "./routes/update-dose-log";
import deleteDoseLogRouter from "./routes/delete-dose-log";

const router = new Hono();

router.use("*", authMiddleware);

router.route("/", findDoseLogsRouter);
router.route("/", findDoseLogRouter);
router.route("/", createDoseLogRouter);
router.route("/", updateDoseLogRouter);
router.route("/", deleteDoseLogRouter);

export default router;