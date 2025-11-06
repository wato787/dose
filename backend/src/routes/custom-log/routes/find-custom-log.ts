import { Hono } from "hono";
import { customLogRepository } from "../../../repository/custom-log";
import { BadRequestException, NotFoundException } from "../../../utils/http-exception";
import { ok } from "../../../utils/response";

const router = new Hono();

/**
 * GET /api/custom-log/:id
 * 特定のカスタムログの詳細を取得
 */
router.get("/:id", async (c) => {
  // ContextからユーザーIDを取得（middlewareで設定済み）
  const userId = c.get("userId");
  const customLogId = parseInt(c.req.param("id"), 10);

  if (isNaN(customLogId)) {
    throw new BadRequestException("Invalid custom log ID");
  }

  // Repositoryを使ってデータベースから取得
  const result = await customLogRepository.findByIdAndUserId(userId, customLogId);

  if (!result) {
    throw new NotFoundException("Custom log not found");
  }

  return ok(c, result);
});

export default router;

