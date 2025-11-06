import { Hono } from "hono";
import { authMiddleware } from "../../middleware";
import findCustomItemsRouter from "./routes/find-custom-items";
import findCustomItemRouter from "./routes/find-custom-item";
import createCustomItemRouter from "./routes/create-custom-item";
import updateCustomItemRouter from "./routes/update-custom-item";
import deleteCustomItemRouter from "./routes/delete-custom-item";

const router = new Hono();

// 認証が必要なルートに認証middlewareを適用
router.use("*", authMiddleware);

// カスタム項目のCRUDルート
router.route("/", findCustomItemsRouter); // 一覧取得
router.route("/", findCustomItemRouter); // 一件取得
router.route("/", createCustomItemRouter); // 作成
router.route("/", updateCustomItemRouter); // 更新
router.route("/", deleteCustomItemRouter); // 削除

export default router;

