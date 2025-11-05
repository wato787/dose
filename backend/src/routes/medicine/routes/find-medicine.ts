import { Hono } from "hono";
import { medicineRepository } from "../../../repository/medicine-repository";
import { BadRequestException, NotFoundException, InternalServerErrorException } from "../../../utils/http-exception";
import { ok } from "../../../utils/response";

const router = new Hono();

/**
 * GET /api/medicine/:id
 * 特定の薬の詳細を取得
 */
router.get("/:id", async (c) => {
  try {
    // ContextからユーザーIDを取得（middlewareで設定済み）
    const userId = c.get("userId");
    const medicineId = parseInt(c.req.param("id"), 10);

    if (isNaN(medicineId)) {
      throw new BadRequestException("Invalid medicine ID");
    }

    // Repositoryを使ってデータベースから取得
    const result = await medicineRepository.findById({
      userId,
      medicineId,
    });

    if (!result) {
      throw new NotFoundException("Medicine not found");
    }

    return ok(c, result);
  } catch (error) {
    if (
      error instanceof BadRequestException ||
      error instanceof NotFoundException ||
      error instanceof InternalServerErrorException
    ) {
      throw error;
    }
    console.error("Error fetching medicine:", error);
    throw new InternalServerErrorException();
  }
});

export default router;
