import { Hono } from "hono";
import { updateCustomItemSchema } from "../schema";
import { customItemRepository } from "../../../repository/custom-item";
import { medicineRepository } from "../../../repository/medicine";
import { BadRequestException, NotFoundException } from "../../../utils/http-exception";
import { ok } from "../../../utils/response";

const router = new Hono();

/**
 * PUT /api/custom-item/:id
 * 特定のカスタム項目を更新
 */
router.put("/:id", async (c) => {
  // ContextからユーザーIDを取得（middlewareで設定済み）
  const userId = c.get("userId");
  const customItemId = parseInt(c.req.param("id"), 10);

  if (isNaN(customItemId)) {
    throw new BadRequestException("Invalid custom item ID");
  }

  // 所有権を確認
  const existing = await customItemRepository.findByIdAndUserId(userId, customItemId);
  if (!existing) {
    throw new NotFoundException("Custom item not found");
  }

  // リクエストボディの取得とバリデーション
  const body = await c.req.json();
  const validatedBody = updateCustomItemSchema.safeParse(body);

  if (!validatedBody.success) {
    throw new BadRequestException(
      "Invalid request body",
      validatedBody.error.issues
    );
  }

  // medicineIdが変更される場合、新しいmedicineIdがユーザーのものであることを確認
  if (validatedBody.data.medicineId !== undefined && validatedBody.data.medicineId !== null) {
    const medicine = await medicineRepository.findByIdAndUserId(userId, validatedBody.data.medicineId);
    if (!medicine) {
      throw new BadRequestException("Medicine not found or access denied");
    }
  }

  // Repositoryを使ってデータベースを更新
  const result = await customItemRepository.update(
    customItemId,
    {
      medicineId: validatedBody.data.medicineId,
      itemName: validatedBody.data.itemName,
      dataType: validatedBody.data.dataType,
      isRequired: validatedBody.data.isRequired,
    }
  );

  if (!result) {
    throw new NotFoundException("Custom item not found");
  }

  return ok(c, result);
});

export default router;

