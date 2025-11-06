import { Hono } from "hono";
import { createCustomLogSchema } from "../schema";
import { customLogRepository } from "../../../repository/custom-log";
import { customItemRepository } from "../../../repository/custom-item";
import { BadRequestException } from "../../../utils/http-exception";
import { created } from "../../../utils/response";

const router = new Hono();

/**
 * POST /api/custom-log
 * 新しいカスタムログを作成
 */
router.post("/", async (c) => {
  // ContextからユーザーIDを取得（middlewareで設定済み）
  const userId = c.get("userId");

  // リクエストボディの取得とバリデーション
  const body = await c.req.json();
  const validatedBody = createCustomLogSchema.safeParse(body);

  if (!validatedBody.success) {
    throw new BadRequestException(
      "Invalid request body",
      validatedBody.error.issues
    );
  }

  // customItemIdがユーザーのものであることを確認
  const customItem = await customItemRepository.findByIdAndUserId(userId, validatedBody.data.customItemId);
  if (!customItem) {
    throw new BadRequestException("Custom item not found or access denied");
  }

  // Repositoryを使ってデータベースに作成
  const result = await customLogRepository.create({
    customItemId: validatedBody.data.customItemId,
    recordDate: validatedBody.data.recordDate,
    value: validatedBody.data.value,
  });

  return created(c, result);
});

export default router;

