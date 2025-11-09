import { Hono } from "hono";
import { findDoseLogQuerySchema } from "../schema";
import { db } from "../../../db";
import { doseLogRepository } from "../../../repository/dose-log";
import { BadRequestException } from "../../../utils/http-exception";
import { ok } from "../../../utils/response";

const router = new Hono();

router.get("/", async (c) => {
  const userId = c.get("userId");
  const query = c.req.query();
  const validatedQuery = findDoseLogQuerySchema.safeParse(query);

  if (!validatedQuery.success) {
    throw new BadRequestException(
      "Invalid query parameters",
      validatedQuery.error.issues
    );
  }

  const doseLogs = validatedQuery.data.scheduleId !== undefined
    ? await doseLogRepository.findByScheduleId(
        db,
        userId,
        validatedQuery.data.scheduleId,
        {
          limit: validatedQuery.data.limit,
          offset: validatedQuery.data.offset,
        }
      )
    : await doseLogRepository.findByUserId(
        db,
        userId,
        {
          limit: validatedQuery.data.limit,
          offset: validatedQuery.data.offset,
        }
      );

  return ok(c, { doseLogs, count: doseLogs.length });
});

export default router;

