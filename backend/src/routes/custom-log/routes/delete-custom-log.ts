import { Hono } from "hono";
import { customLogRepository } from "../../../repository/custom-log";
import { BadRequestException, NotFoundException } from "../../../utils/http-exception";
import { noContent } from "../../../utils/response";

const router = new Hono();

/**
 * DELETE /api/custom-log/:id
 * 特定のカスタムログを削除
 */
router.delete("/:id", async (c) => {
  // ContextからユーザーIDを取得（middlewareで設定済み）
  const userId = c.get("userId");
  const customLogId = parseInt(c.req.param("id"), 10);

  if (isNaN(customLogId)) {
    throw new BadRequestException("Invalid custom log ID");
  }

  // 所有権を確認
  const existing = await customLogRepository.findByIdAndUserId(userId, customLogId);
  if (!existing) {
    throw new NotFoundException("Custom log not found");
  }

  // Repositoryを使ってデータベースから削除
  const deleted = await customLogRepository.delete(customLogId);

  if (!deleted) {
    throw new NotFoundException("Custom log not found");
  }

  return noContent(c);
});

export default router;

