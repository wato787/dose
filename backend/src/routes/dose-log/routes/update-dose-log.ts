import { Hono } from "hono";
import { updateDoseLogSchema } from "../schema";
import { db } from "../../../db";
import { doseLogRepository } from "../../../repository/dose-log";
import { scheduleRepository } from "../../../repository/schedule";
import { BadRequestException, NotFoundException } from "../../../utils/http-exception";
import { ok } from "../../../utils/response";

const router = new Hono();

/**
 * PUT /api/dose-log/:id
 * 特定の服用ログを更新
 */
router.put("/:id", async (c) => {
  // ContextからユーザーIDを取得（middlewareで設定済み）
  const userId = c.get("userId");
  const doseLogId = parseInt(c.req.param("id"), 10);

  if (isNaN(doseLogId)) {
    throw new BadRequestException("Invalid dose log ID");
  }

  // 所有権を確認
  const existing = await doseLogRepository.findByIdAndUserId(db, userId, doseLogId);
  if (!existing) {
    throw new NotFoundException("Dose log not found");
  }

  // リクエストボディの取得とバリデーション
  const body = await c.req.json();
  const validatedBody = updateDoseLogSchema.safeParse(body);

  if (!validatedBody.success) {
    throw new BadRequestException(
      "Invalid request body",
      validatedBody.error.issues
    );
  }

  // scheduleIdが変更される場合、新しいscheduleIdがユーザーのものであることを確認
  if (validatedBody.data.scheduleId !== undefined) {
    const schedule = await scheduleRepository.findByIdAndUserId(db, userId, validatedBody.data.scheduleId);
    if (!schedule) {
      throw new BadRequestException("Schedule not found or access denied");
    }
  }

  // Repositoryを使ってデータベースを更新
  const result = await doseLogRepository.update(
    db,
    doseLogId,
    {
      scheduleId: validatedBody.data.scheduleId,
      recordDate: validatedBody.data.recordDate,
      isTaken: validatedBody.data.isTaken,
      takenAt: validatedBody.data.takenAt,
    }
  );

  if (!result) {
    throw new NotFoundException("Dose log not found");
  }

  return ok(c, result);
});

export default router;

