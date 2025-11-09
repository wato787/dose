import { Hono } from "hono";
import { db } from "../../../db";
import { doseLogRepository } from "../../../repository/dose-log";
import { BadRequestException, NotFoundException } from "../../../utils/http-exception";
import { noContent } from "../../../utils/response";

const router = new Hono();

router.delete("/:id", async (c) => {
  const userId = c.get("userId");
  const doseLogId = parseInt(c.req.param("id"), 10);

  if (isNaN(doseLogId)) {
    throw new BadRequestException("Invalid dose log ID");
  }

  const existing = await doseLogRepository.findByIdAndUserId(db, userId, doseLogId);
  if (!existing) {
    throw new NotFoundException("Dose log not found");
  }

  const deleted = await doseLogRepository.delete(db, doseLogId);
  if (!deleted) {
    throw new NotFoundException("Dose log not found");
  }

  return noContent(c);
});

export default router;

