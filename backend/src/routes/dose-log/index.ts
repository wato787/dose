import { Hono } from "hono";
import { authMiddleware } from "../../middleware";
import findDoseLogsRouter from "./routes/find-dose-logs";
import findDoseLogRouter from "./routes/find-dose-log";
import createDoseLogRouter from "./routes/create-dose-log";
import updateDoseLogRouter from "./routes/update-dose-log";
import deleteDoseLogRouter from "./routes/delete-dose-log";

const router = new Hono();

// 認証が必要なルートに認証middlewareを適用
router.use("*", authMiddleware);

// 服用ログのCRUDルート
router.route("/", findDoseLogsRouter); // 一覧取得
router.route("/", findDoseLogRouter); // 一件取得
router.route("/", createDoseLogRouter); // 作成
router.route("/", updateDoseLogRouter); // 更新
router.route("/", deleteDoseLogRouter); // 削除

export default router;

