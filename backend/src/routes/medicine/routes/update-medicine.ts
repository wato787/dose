import { Hono } from "hono";
import { updateMedicineSchema } from "../schema";
import { medicineRepository } from "../../../repository/medicine-repository";
import { BadRequestException, NotFoundException } from "../../../utils/http-exception";
import { ok } from "../../../utils/response";

const router = new Hono();

/**
 * PUT /api/medicine/:id
 * 特定の薬を更新
 */
router.put("/:id", async (c) => {
  // ContextからユーザーIDを取得（middlewareで設定済み）
  const userId = c.get("userId");
  const medicineId = parseInt(c.req.param("id"), 10);

  if (isNaN(medicineId)) {
    throw new BadRequestException("Invalid medicine ID");
  }

  // リクエストボディの取得とバリデーション
  const body = await c.req.json();
  const validatedBody = updateMedicineSchema.safeParse(body);

  if (!validatedBody.success) {
    throw new BadRequestException(
      "Invalid request body",
      validatedBody.error.issues
    );
  }

  // Repositoryを使ってデータベースを更新
  const result = await medicineRepository.update(
    medicineId,
    userId,
    {
      name: validatedBody.data.name,
      description: validatedBody.data.description,
      isActive: validatedBody.data.isActive,
    }
  );

  if (!result) {
    throw new NotFoundException("Medicine not found");
  }

  return ok(c, result);
});

export default router;

