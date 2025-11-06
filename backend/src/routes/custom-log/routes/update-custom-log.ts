import { Hono } from "hono";
import { updateCustomLogSchema } from "../schema";
import { customLogRepository } from "../../../repository/custom-log";
import { customItemRepository } from "../../../repository/custom-item";
import { BadRequestException, NotFoundException } from "../../../utils/http-exception";
import { ok } from "../../../utils/response";

const router = new Hono();

/**
 * PUT /api/custom-log/:id
 * 特定のカスタムログを更新
 */
router.put("/:id", async (c) => {
  // ContextからユーザーIDを取得（middlewareで設定済み）
  const userId = c.get("userId");
  const customLogId = parseInt(c.req.param("id"), 10);

  if (isNaN(customLogId)) {
    throw new BadRequestException("Invalid custom log ID");
  }

  // 所有権を確認
  const existing = await customLogRepository.findByIdAndUserId(userId, customLogId);
  if (!existing) {
    throw new NotFoundException("Custom log not found");
  }

  // リクエストボディの取得とバリデーション
  const body = await c.req.json();
  const validatedBody = updateCustomLogSchema.safeParse(body);

  if (!validatedBody.success) {
    throw new BadRequestException(
      "Invalid request body",
      validatedBody.error.issues
    );
  }

  // customItemIdが変更される場合、新しいcustomItemIdがユーザーのものであることを確認
  if (validatedBody.data.customItemId !== undefined) {
    const customItem = await customItemRepository.findByIdAndUserId(userId, validatedBody.data.customItemId);
    if (!customItem) {
      throw new BadRequestException("Custom item not found or access denied");
    }
  }

  // Repositoryを使ってデータベースを更新
  const result = await customLogRepository.update(
    customLogId,
    {
      customItemId: validatedBody.data.customItemId,
      recordDate: validatedBody.data.recordDate,
      value: validatedBody.data.value,
    }
  );

  if (!result) {
    throw new NotFoundException("Custom log not found");
  }

  return ok(c, result);
});

export default router;

