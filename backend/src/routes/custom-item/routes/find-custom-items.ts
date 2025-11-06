import { Hono } from "hono";
import { findCustomItemQuerySchema } from "../schema";
import { customItemRepository } from "../../../repository/custom-item";
import { BadRequestException } from "../../../utils/http-exception";
import { ok } from "../../../utils/response";

const router = new Hono();

/**
 * GET /api/custom-item
 * 認証されたユーザーのカスタム項目一覧を取得
 */
router.get("/", async (c) => {
  // ContextからユーザーIDを取得（middlewareで設定済み）
  const userId = c.get("userId");

  // クエリパラメータの取得とバリデーション
  const query = c.req.query();
  const validatedQuery = findCustomItemQuerySchema.safeParse(query);

  if (!validatedQuery.success) {
    throw new BadRequestException(
      "Invalid query parameters",
      validatedQuery.error.issues
    );
  }

  // Repositoryを使ってデータベースから取得
  const customItems = validatedQuery.data.medicineId !== undefined
    ? await customItemRepository.findByMedicineId(
        userId,
        validatedQuery.data.medicineId,
        {
          limit: validatedQuery.data.limit,
          offset: validatedQuery.data.offset,
        }
      )
    : await customItemRepository.findByUserId(
        userId,
        {
          limit: validatedQuery.data.limit,
          offset: validatedQuery.data.offset,
        }
      );

  return ok(c, { customItems, count: customItems.length });
});

export default router;

