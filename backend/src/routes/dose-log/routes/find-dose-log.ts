import { Hono } from "hono";
import { doseLogRepository } from "../../../repository/dose-log";
import { BadRequestException, NotFoundException } from "../../../utils/http-exception";
import { ok } from "../../../utils/response";

const router = new Hono();

/**
 * GET /api/dose-log/:id
 * 特定の服用ログの詳細を取得
 */
router.get("/:id", async (c) => {
  // ContextからユーザーIDを取得（middlewareで設定済み）
  const userId = c.get("userId");
  const doseLogId = parseInt(c.req.param("id"), 10);

  if (isNaN(doseLogId)) {
    throw new BadRequestException("Invalid dose log ID");
  }

  // Repositoryを使ってデータベースから取得
  const result = await doseLogRepository.findByIdAndUserId(userId, doseLogId);

  if (!result) {
    throw new NotFoundException("Dose log not found");
  }

  return ok(c, result);
});

export default router;

