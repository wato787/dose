import { Hono } from "hono";
import { db } from "../../../db";
import { medicineRepository } from "../../../repository/medicine";
import { customLogRepository } from "../../../repository/custom-log";
import { customItemRepository } from "../../../repository/custom-item";
import { BadRequestException, NotFoundException } from "../../../utils/http-exception";
import { created, ok, noContent } from "../../../utils/response";
import { z } from "zod";

const router = new Hono();

// カスタムログ作成用スキーマ
const createCustomLogSchema = z.object({
  customItemId: z.number().min(1, "Custom item ID is required"),
  recordDate: z.coerce.date(),
  value: z.string(),
});

// カスタムログ更新用スキーマ
const updateCustomLogSchema = z.object({
  recordDate: z.coerce.date().optional(),
  value: z.string().optional(),
});

router.post("/:id/custom-logs", async (c) => {
  const userId = c.get("userId");
  const medicineId = parseInt(c.req.param("id"), 10);

  if (isNaN(medicineId)) {
    throw new BadRequestException("Invalid medicine ID");
  }

  const medicine = await medicineRepository.findByIdAndUserId(db, userId, medicineId);
  if (!medicine) {
    throw new NotFoundException("Medicine not found");
  }

  const body = await c.req.json();
  const validatedBody = createCustomLogSchema.safeParse(body);

  if (!validatedBody.success) {
    throw new BadRequestException(
      "Invalid request body",
      validatedBody.error.issues
    );
  }

  const customItem = await customItemRepository.findByIdAndUserId(db, userId, validatedBody.data.customItemId);
  if (!customItem || customItem.medicineId !== medicineId) {
    throw new BadRequestException("Custom item not found or does not belong to this medicine");
  }

  const result = await customLogRepository.create(db, {
    customItemId: validatedBody.data.customItemId,
    recordDate: validatedBody.data.recordDate,
    value: validatedBody.data.value,
  });

  return created(c, result);
});

router.put("/:id/custom-logs/:logId", async (c) => {
  const userId = c.get("userId");
  const medicineId = parseInt(c.req.param("id"), 10);
  const customLogId = parseInt(c.req.param("logId"), 10);

  if (isNaN(medicineId) || isNaN(customLogId)) {
    throw new BadRequestException("Invalid medicine ID or custom log ID");
  }

  const medicine = await medicineRepository.findByIdAndUserId(db, userId, medicineId);
  if (!medicine) {
    throw new NotFoundException("Medicine not found");
  }

  const existingLog = await customLogRepository.findByIdAndUserId(db, userId, customLogId);
  if (!existingLog) {
    throw new NotFoundException("Custom log not found");
  }

  const customItem = await customItemRepository.findByIdAndUserId(db, userId, existingLog.customItemId);
  if (!customItem || customItem.medicineId !== medicineId) {
    throw new BadRequestException("Custom log does not belong to this medicine");
  }

  const body = await c.req.json();
  const validatedBody = updateCustomLogSchema.safeParse(body);

  if (!validatedBody.success) {
    throw new BadRequestException(
      "Invalid request body",
      validatedBody.error.issues
    );
  }

  const result = await customLogRepository.update(db, customLogId, {
    recordDate: validatedBody.data.recordDate,
    value: validatedBody.data.value,
  });

  if (!result) {
    throw new NotFoundException("Custom log not found");
  }

  return ok(c, result);
});

router.delete("/:id/custom-logs/:logId", async (c) => {
  const userId = c.get("userId");
  const medicineId = parseInt(c.req.param("id"), 10);
  const customLogId = parseInt(c.req.param("logId"), 10);

  if (isNaN(medicineId) || isNaN(customLogId)) {
    throw new BadRequestException("Invalid medicine ID or custom log ID");
  }

  const medicine = await medicineRepository.findByIdAndUserId(db, userId, medicineId);
  if (!medicine) {
    throw new NotFoundException("Medicine not found");
  }

  const existingLog = await customLogRepository.findByIdAndUserId(db, userId, customLogId);
  if (!existingLog) {
    throw new NotFoundException("Custom log not found");
  }

  const customItem = await customItemRepository.findByIdAndUserId(db, userId, existingLog.customItemId);
  if (!customItem || customItem.medicineId !== medicineId) {
    throw new BadRequestException("Custom log does not belong to this medicine");
  }

  const deleted = await customLogRepository.delete(db, customLogId);
  if (!deleted) {
    throw new NotFoundException("Custom log not found");
  }

  return noContent(c);
});

export default router;

