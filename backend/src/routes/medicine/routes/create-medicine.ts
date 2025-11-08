import { Hono } from "hono";
import { createMedicineSchema } from "../schema";
import { BadRequestException } from "../../../utils/http-exception";
import { created } from "../../../utils/response";
import { db } from "../../../db";
import { medicine as medicineTable, schedule as scheduleTable, customItem as customItemTable } from "../../../db/schema";

const router = new Hono();

/**
 * POST /api/medicine
 * 新しい薬を作成（スケジュールとカスタムアイテムも同時に作成可能）
 */
router.post("/", async (c) => {
  // ContextからユーザーIDを取得（middlewareで設定済み）
  const userId = c.get("userId");

  // リクエストボディの取得とバリデーション
  const body = await c.req.json();
  const validatedBody = createMedicineSchema.safeParse(body);

  if (!validatedBody.success) {
    throw new BadRequestException(
      "Invalid request body",
      validatedBody.error.issues
    );
  }

  // トランザクション内で薬、スケジュール、カスタムアイテムを作成
  const result = await db.transaction(async (tx) => {
    // 薬を作成
    const [medicine] = await tx
      .insert(medicineTable)
      .values({
        userId,
        name: validatedBody.data.name,
        description: validatedBody.data.description ?? null,
        isActive: validatedBody.data.isActive ?? true,
      })
      .returning();

    if (!medicine) {
      throw new Error("Failed to create medicine");
    }

    // スケジュールを作成（指定されている場合）
    let schedule = null;
    if (validatedBody.data.schedule) {
      const [scheduleResult] = await tx
        .insert(scheduleTable)
        .values({
          medicineId: medicine.medicineId,
          time: validatedBody.data.schedule.time,
          frequencyType: validatedBody.data.schedule.frequencyType ?? "DAILY",
          startDate: validatedBody.data.schedule.startDate,
        })
        .returning();
      schedule = scheduleResult ?? null;
    }

    // カスタムアイテムを作成（指定されている場合）
    const customItems = [];
    if (validatedBody.data.customItems && validatedBody.data.customItems.length > 0) {
      const customItemValues = validatedBody.data.customItems.map((item) => ({
        medicineId: medicine.medicineId,
        itemName: item.itemName,
        dataType: item.dataType,
        isRequired: item.isRequired ?? false,
      }));
      const customItemResults = await tx
        .insert(customItemTable)
        .values(customItemValues)
        .returning();
      customItems.push(...customItemResults);
    }

    return {
      ...medicine,
      schedule,
      customItems,
    };
  });

  return created(c, result);
});

export default router;

