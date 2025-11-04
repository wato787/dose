import { Hono } from "hono";
import { medicineRepository } from "../../../repository/medicine-repository";

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
      return c.json({ error: "Invalid medicine ID" }, 400);
    }

    // Repositoryを使ってデータベースから取得
    const result = await medicineRepository.findById({
      userId,
      medicineId,
    });

    if (!result) {
      return c.json({ error: "Medicine not found" }, 404);
    }

    return c.json({ data: result });
  } catch (error) {
    console.error("Error fetching medicine:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

export default router;
