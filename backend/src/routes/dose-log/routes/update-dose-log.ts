import { Hono } from "hono";
import { db } from "../../../db";
import { doseLogRepository } from "../../../repository/dose-log";
import { scheduleRepository } from "../../../repository/schedule";
import { BadRequestException, NotFoundException } from "../../../utils/http-exception";
import { ok } from "../../../utils/response";
import { updateDoseLogSchema } from "../schema";

const router = new Hono();

router.put("/:id", async (c) => {
  const userId = c.get("userId");
  const doseLogId = parseInt(c.req.param("id"), 10);

  if (isNaN(doseLogId)) {
    throw new BadRequestException("Invalid dose log ID");
  }

  const existing = await doseLogRepository.findByIdAndUserId(db, userId, doseLogId);
  if (!existing) {
    throw new NotFoundException("Dose log not found");
  }

  const body = await c.req.json();
  const validatedBody = updateDoseLogSchema.safeParse(body);

  if (!validatedBody.success) {
    throw new BadRequestException("Invalid request body", validatedBody.error.issues);
  }

  if (validatedBody.data.scheduleId !== undefined) {
    const schedule = await scheduleRepository.findByIdAndUserId(
      db,
      userId,
      validatedBody.data.scheduleId
    );
    if (!schedule) {
      throw new BadRequestException("Schedule not found or access denied");
    }
  }

  const result = await doseLogRepository.update(db, doseLogId, {
    scheduleId: validatedBody.data.scheduleId,
    recordDate: validatedBody.data.recordDate,
    isTaken: validatedBody.data.isTaken,
    takenAt: validatedBody.data.takenAt,
  });

  if (!result) {
    throw new NotFoundException("Dose log not found");
  }

  return ok(c, result);
});

export default router;
