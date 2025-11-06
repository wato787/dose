import { Hono } from "hono";
import { scheduleRepository } from "../../../repository/schedule";
import { BadRequestException, NotFoundException } from "../../../utils/http-exception";
import { ok } from "../../../utils/response";

const router = new Hono();

/**
 * GET /api/schedule/:id
 * 特定のスケジュールの詳細を取得
 */
router.get("/:id", async (c) => {
  // ContextからユーザーIDを取得（middlewareで設定済み）
  const userId = c.get("userId");
  const scheduleId = parseInt(c.req.param("id"), 10);

  if (isNaN(scheduleId)) {
    throw new BadRequestException("Invalid schedule ID");
  }

  // Repositoryを使ってデータベースから取得
  const result = await scheduleRepository.findByIdAndUserId(userId, scheduleId);

  if (!result) {
    throw new NotFoundException("Schedule not found");
  }

  return ok(c, result);
});

export default router;

