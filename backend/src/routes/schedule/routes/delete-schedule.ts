import { Hono } from "hono";
import { scheduleRepository } from "../../../repository/schedule";
import { BadRequestException, NotFoundException } from "../../../utils/http-exception";
import { noContent } from "../../../utils/response";

const router = new Hono();

/**
 * DELETE /api/schedule/:id
 * 特定のスケジュールを削除
 */
router.delete("/:id", async (c) => {
  // ContextからユーザーIDを取得（middlewareで設定済み）
  const userId = c.get("userId");
  const scheduleId = parseInt(c.req.param("id"), 10);

  if (isNaN(scheduleId)) {
    throw new BadRequestException("Invalid schedule ID");
  }

  // 所有権を確認
  const existing = await scheduleRepository.findByIdAndUserId(userId, scheduleId);
  if (!existing) {
    throw new NotFoundException("Schedule not found");
  }

  // Repositoryを使ってデータベースから削除
  const deleted = await scheduleRepository.delete(scheduleId);

  if (!deleted) {
    throw new NotFoundException("Schedule not found");
  }

  return noContent(c);
});

export default router;

