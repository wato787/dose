import { Hono } from "hono";
import { customItemRepository } from "../../../repository/custom-item";
import { BadRequestException, NotFoundException } from "../../../utils/http-exception";
import { ok } from "../../../utils/response";

const router = new Hono();

/**
 * GET /api/custom-item/:id
 * 特定のカスタム項目の詳細を取得
 */
router.get("/:id", async (c) => {
  // ContextからユーザーIDを取得（middlewareで設定済み）
  const userId = c.get("userId");
  const customItemId = parseInt(c.req.param("id"), 10);

  if (isNaN(customItemId)) {
    throw new BadRequestException("Invalid custom item ID");
  }

  // Repositoryを使ってデータベースから取得
  const result = await customItemRepository.findByIdAndUserId(userId, customItemId);

  if (!result) {
    throw new NotFoundException("Custom item not found");
  }

  return ok(c, result);
});

export default router;

