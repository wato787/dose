import { Hono } from "hono";
import { db } from "../../../db";
import { medicineRepository } from "../../../repository/medicine";
import { BadRequestException, NotFoundException } from "../../../utils/http-exception";
import { noContent } from "../../../utils/response";

const router = new Hono();

router.delete("/:id", async (c) => {
  const userId = c.get("userId");
  const medicineId = parseInt(c.req.param("id"), 10);

  if (isNaN(medicineId)) {
    throw new BadRequestException("Invalid medicine ID");
  }

  const existing = await medicineRepository.findByIdAndUserId(db, userId, medicineId);
  if (!existing) {
    throw new NotFoundException("Medicine not found");
  }

  const deleted = await medicineRepository.delete(db, medicineId);
  if (!deleted) {
    throw new NotFoundException("Medicine not found");
  }

  return noContent(c);
});

export default router;

