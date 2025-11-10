import { Hono } from "hono";
import { db } from "../../../db";
import { doseLogRepository } from "../../../repository/dose-log";
import { scheduleRepository } from "../../../repository/schedule";
import { BadRequestException } from "../../../utils/http-exception";
import { created } from "../../../utils/response";
import { createDoseLogSchema } from "../schema";

const router = new Hono();

router.post("/", async (c) => {
  const userId = c.get("userId");
  const body = await c.req.json();
  const validatedBody = createDoseLogSchema.safeParse(body);

  if (!validatedBody.success) {
    throw new BadRequestException("Invalid request body", validatedBody.error.issues);
  }

  const schedule = await scheduleRepository.findByIdAndUserId(
    db,
    userId,
    validatedBody.data.scheduleId
  );
  if (!schedule) {
    throw new BadRequestException("Schedule not found or access denied");
  }

  const result = await doseLogRepository.create(db, {
    scheduleId: validatedBody.data.scheduleId,
    recordDate: validatedBody.data.recordDate,
    isTaken: validatedBody.data.isTaken,
    takenAt: validatedBody.data.takenAt ?? null,
  });

  return created(c, result);
});

export default router;
