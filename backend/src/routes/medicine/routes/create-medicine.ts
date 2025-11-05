import { Hono } from "hono";
import { createMedicineSchema } from "../schema";
import { medicineRepository } from "../../../repository/medicine-repository";
import { BadRequestException } from "../../../utils/http-exception";
import { created } from "../../../utils/response";

const router = new Hono();

/**
 * POST /api/medicine
 * 新しい薬を作成
 */
router.post("/", async (c) => {
  // ContextからユーザーIDを取得（middlewareで設定済み）
  const userId = c.get("userId");

  // リクエストボディの取得とバリデーション
  const body = await c.req.json();
  const validatedBody = createMedicineSchema.safeParse(body);

  if (!validatedBody.success) {
    throw new BadRequestException(
      "Invalid request body",
      validatedBody.error.issues
    );
  }

  // Repositoryを使ってデータベースに作成
  const result = await medicineRepository.create({
    userId,
    name: validatedBody.data.name,
    description: validatedBody.data.description ?? null,
    isActive: validatedBody.data.isActive ?? true,
  });

  return created(c, result);
});

export default router;

