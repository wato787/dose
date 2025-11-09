import { Hono } from "hono";
import { createDoseLogSchema } from "../schema";
import { db } from "../../../db";
import { doseLogRepository } from "../../../repository/dose-log";
import { scheduleRepository } from "../../../repository/schedule";
import { BadRequestException } from "../../../utils/http-exception";
import { created } from "../../../utils/response";

const router = new Hono();

/**
 * POST /api/dose-log
 * 新しい服用ログを作成
 */
router.post("/", async (c) => {
  // ContextからユーザーIDを取得（middlewareで設定済み）
  const userId = c.get("userId");

  // リクエストボディの取得とバリデーション
  const body = await c.req.json();
  const validatedBody = createDoseLogSchema.safeParse(body);

  if (!validatedBody.success) {
    throw new BadRequestException(
      "Invalid request body",
      validatedBody.error.issues
    );
  }

  // scheduleIdがユーザーのものであることを確認
  const schedule = await scheduleRepository.findByIdAndUserId(db, userId, validatedBody.data.scheduleId);
  if (!schedule) {
    throw new BadRequestException("Schedule not found or access denied");
  }

  // Repositoryを使ってデータベースに作成
  const result = await doseLogRepository.create(db, {
    scheduleId: validatedBody.data.scheduleId,
    recordDate: validatedBody.data.recordDate,
    isTaken: validatedBody.data.isTaken,
    takenAt: validatedBody.data.takenAt ?? null,
  });

  return created(c, result);
});

export default router;

