import { Hono } from "hono";
import { doseLogRepository } from "../../../repository/dose-log";
import { BadRequestException, NotFoundException } from "../../../utils/http-exception";
import { noContent } from "../../../utils/response";

const router = new Hono();

/**
 * DELETE /api/dose-log/:id
 * 特定の服用ログを削除
 */
router.delete("/:id", async (c) => {
  // ContextからユーザーIDを取得（middlewareで設定済み）
  const userId = c.get("userId");
  const doseLogId = parseInt(c.req.param("id"), 10);

  if (isNaN(doseLogId)) {
    throw new BadRequestException("Invalid dose log ID");
  }

  // 所有権を確認
  const existing = await doseLogRepository.findByIdAndUserId(userId, doseLogId);
  if (!existing) {
    throw new NotFoundException("Dose log not found");
  }

  // Repositoryを使ってデータベースから削除
  const deleted = await doseLogRepository.delete(doseLogId);

  if (!deleted) {
    throw new NotFoundException("Dose log not found");
  }

  return noContent(c);
});

export default router;

