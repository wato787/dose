import { Hono } from "hono";
import { db } from "../../../db";
import { customItemRepository } from "../../../repository/custom-item";
import { medicineRepository } from "../../../repository/medicine";
import { scheduleRepository } from "../../../repository/schedule";
import { BadRequestException } from "../../../utils/http-exception";
import { created } from "../../../utils/response";
import { createMedicineSchema } from "../schema";

const router = new Hono();

router.post("/", async (c) => {
  const userId = c.get("userId");
  const body = await c.req.json();
  const validatedBody = createMedicineSchema.safeParse(body);

  if (!validatedBody.success) {
    throw new BadRequestException("Invalid request body", validatedBody.error.issues);
  }

  const result = await db.transaction(async (tx) => {
    const medicine = await medicineRepository.create(tx, {
      userId,
      name: validatedBody.data.name,
      description: validatedBody.data.description ?? null,
      isActive: validatedBody.data.isActive ?? true,
    });

    if (!medicine) {
      throw new Error("Failed to create medicine");
    }

    let schedule = null;
    if (validatedBody.data.schedule) {
      schedule = await scheduleRepository.create(tx, {
        medicineId: medicine.medicineId,
        time: validatedBody.data.schedule.time,
        frequencyType: validatedBody.data.schedule.frequencyType ?? "DAILY",
        startDate: validatedBody.data.schedule.startDate,
      });
    }

    const customItems = [];
    if (validatedBody.data.customItems && validatedBody.data.customItems.length > 0) {
      for (const item of validatedBody.data.customItems) {
        const customItem = await customItemRepository.create(tx, {
          medicineId: medicine.medicineId,
          itemName: item.itemName,
          dataType: item.dataType,
          isRequired: item.isRequired ?? false,
        });
        customItems.push(customItem);
      }
    }

    return {
      ...medicine,
      schedule,
      customItems,
    };
  });

  return created(c, result);
});

export default router;
