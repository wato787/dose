import { Hono } from "hono";
import { authMiddleware } from "../../middleware";
import createDoseLogRouter from "./routes/create-dose-log";
import deleteDoseLogRouter from "./routes/delete-dose-log";
import findDoseLogRouter from "./routes/find-dose-log";
import findDoseLogsRouter from "./routes/find-dose-logs";
import updateDoseLogRouter from "./routes/update-dose-log";

const router = new Hono();

router.use("*", authMiddleware);

router.route("/", findDoseLogsRouter);
router.route("/", findDoseLogRouter);
router.route("/", createDoseLogRouter);
router.route("/", updateDoseLogRouter);
router.route("/", deleteDoseLogRouter);

export default router;
