import { Hono } from "hono";
import { findCustomLogQuerySchema } from "../schema";
import { customLogRepository } from "../../../repository/custom-log";
import { BadRequestException } from "../../../utils/http-exception";
import { ok } from "../../../utils/response";

const router = new Hono();

/**
 * GET /api/custom-log
 * 認証されたユーザーのカスタムログ一覧を取得
 */
router.get("/", async (c) => {
  // ContextからユーザーIDを取得（middlewareで設定済み）
  const userId = c.get("userId");

  // クエリパラメータの取得とバリデーション
  const query = c.req.query();
  const validatedQuery = findCustomLogQuerySchema.safeParse(query);

  if (!validatedQuery.success) {
    throw new BadRequestException(
      "Invalid query parameters",
      validatedQuery.error.issues
    );
  }

  // Repositoryを使ってデータベースから取得
  const customLogs = validatedQuery.data.customItemId !== undefined
    ? await customLogRepository.findByCustomItemId(
        userId,
        validatedQuery.data.customItemId,
        {
          limit: validatedQuery.data.limit,
          offset: validatedQuery.data.offset,
        }
      )
    : await customLogRepository.findByUserId(
        userId,
        {
          limit: validatedQuery.data.limit,
          offset: validatedQuery.data.offset,
        }
      );

  return ok(c, { customLogs, count: customLogs.length });
});

export default router;

