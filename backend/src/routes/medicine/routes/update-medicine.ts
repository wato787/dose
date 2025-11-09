import { Hono } from "hono";
import { updateMedicineSchema } from "../schema";
import { db } from "../../../db";
import { medicineRepository } from "../../../repository/medicine";
import { scheduleRepository } from "../../../repository/schedule";
import { customItemRepository } from "../../../repository/custom-item";
import { BadRequestException, NotFoundException } from "../../../utils/http-exception";
import { ok } from "../../../utils/response";

const router = new Hono();

/**
 * PUT /api/medicine/:id
 * 特定の薬を更新（スケジュールとカスタムアイテムも同時に更新可能）
 */
router.put("/:id", async (c) => {
  // ContextからユーザーIDを取得（middlewareで設定済み）
  const userId = c.get("userId");
  const medicineId = parseInt(c.req.param("id"), 10);

  if (isNaN(medicineId)) {
    throw new BadRequestException("Invalid medicine ID");
  }

  // 所有権を確認
  const existing = await medicineRepository.findByIdAndUserId(db, userId, medicineId);
  if (!existing) {
    throw new NotFoundException("Medicine not found");
  }

  // リクエストボディの取得とバリデーション
  const body = await c.req.json();
  const validatedBody = updateMedicineSchema.safeParse(body);

  if (!validatedBody.success) {
    throw new BadRequestException(
      "Invalid request body",
      validatedBody.error.issues
    );
  }

  // トランザクション内で薬、スケジュール、カスタムアイテムを更新
  const result = await db.transaction(async (tx) => {
    // 薬を更新
    const updateData: Partial<{
      name: string;
      description: string | null;
      isActive: boolean;
    }> = {};
    if (validatedBody.data.name !== undefined) updateData.name = validatedBody.data.name;
    if (validatedBody.data.description !== undefined) updateData.description = validatedBody.data.description;
    if (validatedBody.data.isActive !== undefined) updateData.isActive = validatedBody.data.isActive;

    const medicine = await medicineRepository.update(tx, medicineId, updateData);

    if (!medicine) {
      throw new NotFoundException("Medicine not found");
    }

    // スケジュールの処理
    let scheduleResult = null;
    if (validatedBody.data.schedule !== undefined) {
      // 既存のスケジュールを削除
      const existingSchedules = await scheduleRepository.findByMedicineId(tx, userId, medicineId);
      for (const schedule of existingSchedules) {
        await scheduleRepository.delete(tx, schedule.scheduleId);
      }
      
      // 新しいスケジュールを作成（指定されている場合）
      if (validatedBody.data.schedule !== null) {
        scheduleResult = await scheduleRepository.create(tx, {
          medicineId: medicine.medicineId,
          time: validatedBody.data.schedule.time,
          frequencyType: validatedBody.data.schedule.frequencyType ?? "DAILY",
          startDate: validatedBody.data.schedule.startDate,
        });
      }
    }

    // カスタムアイテムの処理
    let customItemsResult = [];
    if (validatedBody.data.customItems !== undefined) {
      // 既存のカスタムアイテムを削除
      const existingCustomItems = await customItemRepository.findByMedicineId(tx, userId, medicineId);
      for (const item of existingCustomItems) {
        await customItemRepository.delete(tx, item.customItemId);
      }
      
      // 新しいカスタムアイテムを作成（指定されている場合）
      if (validatedBody.data.customItems && validatedBody.data.customItems.length > 0) {
        for (const item of validatedBody.data.customItems) {
          const customItem = await customItemRepository.create(tx, {
            medicineId: medicine.medicineId,
            itemName: item.itemName,
            dataType: item.dataType,
            isRequired: item.isRequired ?? false,
          });
          customItemsResult.push(customItem);
        }
      }
    }

    return {
      ...medicine,
      schedule: scheduleResult,
      customItems: customItemsResult,
    };
  });

  return ok(c, result);
});

export default router;

