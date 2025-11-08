import { Hono } from "hono";
import { authMiddleware } from "../../middleware";
import findMedicinesRouter from "./routes/find-medicines";
import findMedicineRouter from "./routes/find-medicine";
import createMedicineRouter from "./routes/create-medicine";
import updateMedicineRouter from "./routes/update-medicine";
import deleteMedicineRouter from "./routes/delete-medicine";
import customLogsRouter from "./routes/custom-logs";

const router = new Hono();

// 認証が必要なルートに認証middlewareを適用
router.use("*", authMiddleware);

// 薬のCRUDルート
router.route("/", findMedicinesRouter); // 一覧取得
router.route("/", findMedicineRouter); // 一件取得
router.route("/", createMedicineRouter); // 作成
router.route("/", updateMedicineRouter); // 更新
router.route("/", deleteMedicineRouter); // 削除

// カスタムログの操作（medicineに紐づく）
router.route("/", customLogsRouter);

export default router;

