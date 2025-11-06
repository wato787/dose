import { Hono } from "hono";
import { updateScheduleSchema } from "../schema";
import { scheduleRepository } from "../../../repository/schedule";
import { medicineRepository } from "../../../repository/medicine";
import { BadRequestException, NotFoundException } from "../../../utils/http-exception";
import { ok } from "../../../utils/response";

const router = new Hono();

/**
 * PUT /api/schedule/:id
 * 特定のスケジュールを更新
 */
router.put("/:id", async (c) => {
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

  // リクエストボディの取得とバリデーション
  const body = await c.req.json();
  const validatedBody = updateScheduleSchema.safeParse(body);

  if (!validatedBody.success) {
    throw new BadRequestException(
      "Invalid request body",
      validatedBody.error.issues
    );
  }

  // medicineIdが変更される場合、新しいmedicineIdがユーザーのものであることを確認
  if (validatedBody.data.medicineId !== undefined) {
    const medicine = await medicineRepository.findByIdAndUserId(userId, validatedBody.data.medicineId);
    if (!medicine) {
      throw new BadRequestException("Medicine not found or access denied");
    }
  }

  // Repositoryを使ってデータベースを更新
  const result = await scheduleRepository.update(
    scheduleId,
    {
      medicineId: validatedBody.data.medicineId,
      time: validatedBody.data.time,
      frequencyType: validatedBody.data.frequencyType,
      startDate: validatedBody.data.startDate,
    }
  );

  if (!result) {
    throw new NotFoundException("Schedule not found");
  }

  return ok(c, result);
});

export default router;

