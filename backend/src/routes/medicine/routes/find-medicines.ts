import { Hono } from "hono";
import { findMedicineQuerySchema } from "../schema";
import { medicineRepository } from "../../../repository/medicine-repository";
import { BadRequestException } from "../../../utils/http-exception";
import { ok } from "../../../utils/response";

const router = new Hono();

/**
 * GET /api/medicine
 * 認証されたユーザーの薬一覧を取得
 */
router.get("/", async (c) => {
    // ContextからユーザーIDを取得（middlewareで設定済み）
    const userId = c.get("userId");

    // クエリパラメータの取得とバリデーション
    const query = c.req.query();
    const validatedQuery = findMedicineQuerySchema.safeParse(query);

    if (!validatedQuery.success) {
    throw new BadRequestException(
      "Invalid query parameters",
      validatedQuery.error.issues
      );
    }

    // Repositoryを使ってデータベースから取得
    const medicines = await medicineRepository.find({
      userId,
      isActive: validatedQuery.data.isActive,
      limit: validatedQuery.data.limit,
      offset: validatedQuery.data.offset,
    });

  return ok(c, { medicines, count: medicines.length });
});

export default router;

