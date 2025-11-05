import { Hono } from "hono";
import { medicineRepository } from "../../../repository/medicine-repository";
import { BadRequestException, NotFoundException } from "../../../utils/http-exception";
import { noContent } from "../../../utils/response";

const router = new Hono();

/**
 * DELETE /api/medicine/:id
 * 特定の薬を削除
 */
router.delete("/:id", async (c) => {
  // ContextからユーザーIDを取得（middlewareで設定済み）
  const userId = c.get("userId");
  const medicineId = parseInt(c.req.param("id"), 10);

  if (isNaN(medicineId)) {
    throw new BadRequestException("Invalid medicine ID");
  }

  // Repositoryを使ってデータベースから削除
  const deleted = await medicineRepository.delete(medicineId, userId);

  if (!deleted) {
    throw new NotFoundException("Medicine not found");
  }

  return noContent(c);
});

export default router;

