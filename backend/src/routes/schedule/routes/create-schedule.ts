import { Hono } from "hono";
import { createScheduleSchema } from "../schema";
import { scheduleRepository } from "../../../repository/schedule";
import { medicineRepository } from "../../../repository/medicine";
import { BadRequestException } from "../../../utils/http-exception";
import { created } from "../../../utils/response";

const router = new Hono();

/**
 * POST /api/schedule
 * 新しいスケジュールを作成
 */
router.post("/", async (c) => {
  // ContextからユーザーIDを取得（middlewareで設定済み）
  const userId = c.get("userId");

  // リクエストボディの取得とバリデーション
  const body = await c.req.json();
  const validatedBody = createScheduleSchema.safeParse(body);

  if (!validatedBody.success) {
    throw new BadRequestException(
      "Invalid request body",
      validatedBody.error.issues
    );
  }

  // medicineIdがユーザーのものであることを確認
  const medicine = await medicineRepository.findByIdAndUserId(userId, validatedBody.data.medicineId);
  if (!medicine) {
    throw new BadRequestException("Medicine not found or access denied");
  }

  // Repositoryを使ってデータベースに作成
  const result = await scheduleRepository.create({
    medicineId: validatedBody.data.medicineId,
    time: validatedBody.data.time,
    frequencyType: validatedBody.data.frequencyType ?? "DAILY",
    startDate: validatedBody.data.startDate,
  });

  return created(c, result);
});

export default router;

