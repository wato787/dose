import { Hono } from "hono";
import { findScheduleQuerySchema } from "../schema";
import { scheduleRepository } from "../../../repository/schedule";
import { BadRequestException } from "../../../utils/http-exception";
import { ok } from "../../../utils/response";

const router = new Hono();

/**
 * GET /api/schedule
 * 認証されたユーザーのスケジュール一覧を取得
 */
router.get("/", async (c) => {
  // ContextからユーザーIDを取得（middlewareで設定済み）
  const userId = c.get("userId");

  // クエリパラメータの取得とバリデーション
  const query = c.req.query();
  const validatedQuery = findScheduleQuerySchema.safeParse(query);

  if (!validatedQuery.success) {
    throw new BadRequestException(
      "Invalid query parameters",
      validatedQuery.error.issues
    );
  }

  // Repositoryを使ってデータベースから取得
  const schedules = validatedQuery.data.medicineId !== undefined
    ? await scheduleRepository.findByMedicineId(
        userId,
        validatedQuery.data.medicineId,
        {
          limit: validatedQuery.data.limit,
          offset: validatedQuery.data.offset,
        }
      )
    : await scheduleRepository.findByUserId(
        userId,
        {
          limit: validatedQuery.data.limit,
          offset: validatedQuery.data.offset,
        }
      );

  return ok(c, { schedules, count: schedules.length });
});

export default router;

