import { Hono } from "hono";
import { authMiddleware } from "../../middleware";
import findCustomLogsRouter from "./routes/find-custom-logs";
import findCustomLogRouter from "./routes/find-custom-log";
import createCustomLogRouter from "./routes/create-custom-log";
import updateCustomLogRouter from "./routes/update-custom-log";
import deleteCustomLogRouter from "./routes/delete-custom-log";

const router = new Hono();

// 認証が必要なルートに認証middlewareを適用
router.use("*", authMiddleware);

// カスタムログのCRUDルート
router.route("/", findCustomLogsRouter); // 一覧取得
router.route("/", findCustomLogRouter); // 一件取得
router.route("/", createCustomLogRouter); // 作成
router.route("/", updateCustomLogRouter); // 更新
router.route("/", deleteCustomLogRouter); // 削除

export default router;

