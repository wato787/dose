import { Hono } from "hono";
import { findMedicineQuerySchema } from "../schema";
import { medicineRepository } from "../../../repository/medicine";
import { scheduleRepository } from "../../../repository/schedule";
import { customItemRepository } from "../../../repository/custom-item";
import { BadRequestException } from "../../../utils/http-exception";
import { ok } from "../../../utils/response";

const router = new Hono();

/**
 * GET /api/medicine
 * 認証されたユーザーの薬一覧を取得（スケジュールとカスタムアイテムも含む）
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
  const medicines = validatedQuery.data.isActive !== undefined
    ? await medicineRepository.findByUserIdAndIsActive(
        userId,
        validatedQuery.data.isActive,
        {
          limit: validatedQuery.data.limit,
          offset: validatedQuery.data.offset,
        }
      )
    : await medicineRepository.findByUserId(
        userId,
        {
          limit: validatedQuery.data.limit,
          offset: validatedQuery.data.offset,
        }
      );

  // 各薬のスケジュールとカスタムアイテムも取得
  const medicinesWithRelations = await Promise.all(
    medicines.map(async (medicine) => {
      const schedules = await scheduleRepository.findByMedicineId(userId, medicine.medicineId);
      const customItems = await customItemRepository.findByMedicineId(userId, medicine.medicineId);
      return {
        ...medicine,
        schedules,
        customItems,
      };
    })
  );

  return ok(c, { medicines: medicinesWithRelations, count: medicinesWithRelations.length });
});

export default router;

