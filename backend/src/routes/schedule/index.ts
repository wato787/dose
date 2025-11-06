import { Hono } from "hono";
import { authMiddleware } from "../../middleware";
import findSchedulesRouter from "./routes/find-schedules";
import findScheduleRouter from "./routes/find-schedule";
import createScheduleRouter from "./routes/create-schedule";
import updateScheduleRouter from "./routes/update-schedule";
import deleteScheduleRouter from "./routes/delete-schedule";

const router = new Hono();

// 認証が必要なルートに認証middlewareを適用
router.use("*", authMiddleware);

// スケジュールのCRUDルート
router.route("/", findSchedulesRouter); // 一覧取得
router.route("/", findScheduleRouter); // 一件取得
router.route("/", createScheduleRouter); // 作成
router.route("/", updateScheduleRouter); // 更新
router.route("/", deleteScheduleRouter); // 削除

export default router;

