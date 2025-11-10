import { Hono } from "hono";
import { db } from "../../../db";
import { doseLogRepository } from "../../../repository/dose-log";
import { BadRequestException, NotFoundException } from "../../../utils/http-exception";
import { ok } from "../../../utils/response";

const router = new Hono();

router.get("/:id", async (c) => {
  const userId = c.get("userId");
  const doseLogId = parseInt(c.req.param("id"), 10);

  if (isNaN(doseLogId)) {
    throw new BadRequestException("Invalid dose log ID");
  }

  const result = await doseLogRepository.findByIdAndUserId(db, userId, doseLogId);
  if (!result) {
    throw new NotFoundException("Dose log not found");
  }

  return ok(c, result);
});

export default router;
