import { Hono } from "hono";
import { createCustomItemSchema } from "../schema";
import { customItemRepository } from "../../../repository/custom-item";
import { medicineRepository } from "../../../repository/medicine";
import { BadRequestException } from "../../../utils/http-exception";
import { created } from "../../../utils/response";

const router = new Hono();

/**
 * POST /api/custom-item
 * 新しいカスタム項目を作成
 */
router.post("/", async (c) => {
  // ContextからユーザーIDを取得（middlewareで設定済み）
  const userId = c.get("userId");

  // リクエストボディの取得とバリデーション
  const body = await c.req.json();
  const validatedBody = createCustomItemSchema.safeParse(body);

  if (!validatedBody.success) {
    throw new BadRequestException(
      "Invalid request body",
      validatedBody.error.issues
    );
  }

  // medicineIdが指定されている場合、その薬がユーザーのものであることを確認
  if (validatedBody.data.medicineId !== null && validatedBody.data.medicineId !== undefined) {
    const medicine = await medicineRepository.findByIdAndUserId(userId, validatedBody.data.medicineId);
    if (!medicine) {
      throw new BadRequestException("Medicine not found or access denied");
    }
  }

  // Repositoryを使ってデータベースに作成
  const result = await customItemRepository.create({
    medicineId: validatedBody.data.medicineId ?? null,
    itemName: validatedBody.data.itemName,
    dataType: validatedBody.data.dataType,
    isRequired: validatedBody.data.isRequired ?? false,
  });

  return created(c, result);
});

export default router;

