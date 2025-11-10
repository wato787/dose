import { Hono } from "hono";
import { db } from "../../../db";
import { customItemRepository } from "../../../repository/custom-item";
import { customLogRepository } from "../../../repository/custom-log";
import { medicineRepository } from "../../../repository/medicine";
import { scheduleRepository } from "../../../repository/schedule";
import { BadRequestException } from "../../../utils/http-exception";
import { ok } from "../../../utils/response";
import { findMedicineQuerySchema } from "../schema";

const router = new Hono();

router.get("/", async (c) => {
  const userId = c.get("userId");
  const query = c.req.query();
  const validatedQuery = findMedicineQuerySchema.safeParse(query);

  if (!validatedQuery.success) {
    throw new BadRequestException("Invalid query parameters", validatedQuery.error.issues);
  }

  const medicines =
    validatedQuery.data.isActive !== undefined
      ? await medicineRepository.findByUserIdAndIsActive(db, userId, validatedQuery.data.isActive, {
          limit: validatedQuery.data.limit,
          offset: validatedQuery.data.offset,
        })
      : await medicineRepository.findByUserId(db, userId, {
          limit: validatedQuery.data.limit,
          offset: validatedQuery.data.offset,
        });

  const medicinesWithRelations = await Promise.all(
    medicines.map(async (medicine) => {
      const schedules = await scheduleRepository.findByMedicineId(db, userId, medicine.medicineId);
      const customItems = await customItemRepository.findByMedicineId(
        db,
        userId,
        medicine.medicineId
      );

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

      return {
        ...medicine,
        schedules,
        customItems: customItemsWithLogs,
      };
    })
  );

  return ok(c, { medicines: medicinesWithRelations, count: medicinesWithRelations.length });
});

export default router;
