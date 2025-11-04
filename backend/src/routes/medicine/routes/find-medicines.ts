import { Hono } from "hono";
import { findMedicineQuerySchema } from "../schema";
import { medicineRepository } from "../../../repository/medicine-repository";

const router = new Hono();

/**
 * GET /api/medicine
 * 認証されたユーザーの薬一覧を取得
 */
router.get("/", async (c) => {
  try {
    // ContextからユーザーIDを取得（middlewareで設定済み）
    const userId = c.get("userId");

    // クエリパラメータの取得とバリデーション
    const query = c.req.query();
    const validatedQuery = findMedicineQuerySchema.safeParse(query);

    if (!validatedQuery.success) {
      return c.json(
        { error: "Invalid query parameters", details: validatedQuery.error.issues },
        400
      );
    }

    // Repositoryを使ってデータベースから取得
    const medicines = await medicineRepository.find({
      userId,
      isActive: validatedQuery.data.isActive,
      limit: validatedQuery.data.limit,
      offset: validatedQuery.data.offset,
    });

    return c.json({
      data: medicines,
      count: medicines.length,
    });
  } catch (error) {
    console.error("Error fetching medicines:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

export default router;

