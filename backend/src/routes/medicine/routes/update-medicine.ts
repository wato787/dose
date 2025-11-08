import { Hono } from "hono";
import { updateMedicineSchema } from "../schema";
import { medicineRepository } from "../../../repository/medicine";
import { BadRequestException, NotFoundException } from "../../../utils/http-exception";
import { ok } from "../../../utils/response";
import { db } from "../../../db";
import { eq } from "drizzle-orm";
import { medicine as medicineTable, schedule as scheduleTable, customItem as customItemTable } from "../../../db/schema";

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
  const existing = await medicineRepository.findByIdAndUserId(userId, medicineId);
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
    const updateData: any = {};
    if (validatedBody.data.name !== undefined) updateData.name = validatedBody.data.name;
    if (validatedBody.data.description !== undefined) updateData.description = validatedBody.data.description;
    if (validatedBody.data.isActive !== undefined) updateData.isActive = validatedBody.data.isActive;

    const [medicine] = await tx
      .update(medicineTable)
      .set(updateData)
      .where(eq(medicineTable.medicineId, medicineId))
      .returning();

    if (!medicine) {
      throw new NotFoundException("Medicine not found");
    }

    // スケジュールの処理
    let scheduleResult = null;
    if (validatedBody.data.schedule !== undefined) {
      // 既存のスケジュールを削除
      await tx.delete(scheduleTable).where(eq(scheduleTable.medicineId, medicineId));
      
      // 新しいスケジュールを作成（指定されている場合）
      if (validatedBody.data.schedule !== null) {
        const [schedule] = await tx
          .insert(scheduleTable)
          .values({
            medicineId: medicine.medicineId,
            time: validatedBody.data.schedule.time,
            frequencyType: validatedBody.data.schedule.frequencyType ?? "DAILY",
            startDate: validatedBody.data.schedule.startDate,
          })
          .returning();
        scheduleResult = schedule;
      }
    }

    // カスタムアイテムの処理
    let customItemsResult = [];
    if (validatedBody.data.customItems !== undefined) {
      // 既存のカスタムアイテムを削除
      await tx.delete(customItemTable).where(eq(customItemTable.medicineId, medicineId));
      
      // 新しいカスタムアイテムを作成（指定されている場合）
      if (validatedBody.data.customItems && validatedBody.data.customItems.length > 0) {
        const customItemValues = validatedBody.data.customItems.map((item) => ({
          medicineId: medicine.medicineId,
          itemName: item.itemName,
          dataType: item.dataType,
          isRequired: item.isRequired ?? false,
        }));
        const customItems = await tx
          .insert(customItemTable)
          .values(customItemValues)
          .returning();
        customItemsResult.push(...customItems);
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

