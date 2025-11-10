import { Hono } from "hono";
import { db } from "../../../db";
import { customItemRepository } from "../../../repository/custom-item";
import { customLogRepository } from "../../../repository/custom-log";
import { medicineRepository } from "../../../repository/medicine";
import { scheduleRepository } from "../../../repository/schedule";
import { BadRequestException, NotFoundException } from "../../../utils/http-exception";
import { ok } from "../../../utils/response";

const router = new Hono();

router.get("/:id", async (c) => {
  const userId = c.get("userId");
  const medicineId = parseInt(c.req.param("id"), 10);

  if (isNaN(medicineId)) {
    throw new BadRequestException("Invalid medicine ID");
  }

  const medicine = await medicineRepository.findByIdAndUserId(db, userId, medicineId);
  if (!medicine) {
    throw new NotFoundException("Medicine not found");
  }

  const schedules = await scheduleRepository.findByMedicineId(db, userId, medicineId);
  const customItems = await customItemRepository.findByMedicineId(db, userId, medicineId);

  const customItemsWithLogs = await Promise.all(
    customItems.map(async (item) => {
      const customLogs = await customLogRepository.findByCustomItemId(
        db,
        userId,
        item.customItemId
      );
      return {
        ...item,
        customLogs,
      };
    })
  );

  return ok(c, {
    ...medicine,
    schedules,
    customItems: customItemsWithLogs,
  });
});

export default router;
