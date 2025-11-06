import { Hono } from "hono";
import { customItemRepository } from "../../../repository/custom-item";
import { BadRequestException, NotFoundException } from "../../../utils/http-exception";
import { noContent } from "../../../utils/response";

const router = new Hono();

/**
 * DELETE /api/custom-item/:id
 * 特定のカスタム項目を削除
 */
router.delete("/:id", async (c) => {
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

  // Repositoryを使ってデータベースから削除
  const deleted = await customItemRepository.delete(customItemId);

  if (!deleted) {
    throw new NotFoundException("Custom item not found");
  }

  return noContent(c);
});

export default router;

