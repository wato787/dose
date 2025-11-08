import { Hono } from "hono";
import { customLogRepository } from "../../../repository/custom-log";
import { customItemRepository } from "../../../repository/custom-item";
import { medicineRepository } from "../../../repository/medicine";
import { BadRequestException, NotFoundException } from "../../../utils/http-exception";
import { created, ok, noContent } from "../../../utils/response";
import { z } from "zod";

const router = new Hono();

/**
 * カスタムログの作成用スキーマ
 */
const createCustomLogSchema = z.object({
  customItemId: z.number().min(1, "Custom item ID is required"),
  recordDate: z.coerce.date(),
  value: z.string().min(1, "Value is required"),
});

/**
 * カスタムログの更新用スキーマ
 */
const updateCustomLogSchema = z.object({
  recordDate: z.coerce.date().optional(),
  value: z.string().min(1, "Value is required").optional(),
});

/**
 * POST /api/medicine/:id/custom-logs
 * 特定の薬に紐づくカスタムログを作成
 */
router.post("/:id/custom-logs", async (c) => {
  const userId = c.get("userId");
  const medicineId = parseInt(c.req.param("id"), 10);

  if (isNaN(medicineId)) {
    throw new BadRequestException("Invalid medicine ID");
  }

  // 所有権を確認
  const medicine = await medicineRepository.findByIdAndUserId(userId, medicineId);
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

  // customItemIdがそのmedicineに紐づいていることを確認
  const customItem = await customItemRepository.findByIdAndUserId(userId, validatedBody.data.customItemId);
  if (!customItem || customItem.medicineId !== medicineId) {
    throw new BadRequestException("Custom item not found or does not belong to this medicine");
  }

  const result = await customLogRepository.create({
    customItemId: validatedBody.data.customItemId,
    recordDate: validatedBody.data.recordDate,
    value: validatedBody.data.value,
  });

  return created(c, result);
});

/**
 * PUT /api/medicine/:id/custom-logs/:logId
 * 特定の薬に紐づくカスタムログを更新
 */
router.put("/:id/custom-logs/:logId", async (c) => {
  const userId = c.get("userId");
  const medicineId = parseInt(c.req.param("id"), 10);
  const customLogId = parseInt(c.req.param("logId"), 10);

  if (isNaN(medicineId) || isNaN(customLogId)) {
    throw new BadRequestException("Invalid medicine ID or custom log ID");
  }

  // 所有権を確認
  const medicine = await medicineRepository.findByIdAndUserId(userId, medicineId);
  if (!medicine) {
    throw new NotFoundException("Medicine not found");
  }

  const existing = await customLogRepository.findByIdAndUserId(userId, customLogId);
  if (!existing) {
    throw new NotFoundException("Custom log not found");
  }

  // そのcustomLogがそのmedicineに紐づいていることを確認
  const customItem = await customItemRepository.findByIdAndUserId(userId, existing.customItemId);
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

  const result = await customLogRepository.update(customLogId, {
    recordDate: validatedBody.data.recordDate,
    value: validatedBody.data.value,
  });

  if (!result) {
    throw new NotFoundException("Custom log not found");
  }

  return ok(c, result);
});

/**
 * DELETE /api/medicine/:id/custom-logs/:logId
 * 特定の薬に紐づくカスタムログを削除
 */
router.delete("/:id/custom-logs/:logId", async (c) => {
  const userId = c.get("userId");
  const medicineId = parseInt(c.req.param("id"), 10);
  const customLogId = parseInt(c.req.param("logId"), 10);

  if (isNaN(medicineId) || isNaN(customLogId)) {
    throw new BadRequestException("Invalid medicine ID or custom log ID");
  }

  // 所有権を確認
  const medicine = await medicineRepository.findByIdAndUserId(userId, medicineId);
  if (!medicine) {
    throw new NotFoundException("Medicine not found");
  }

  const existing = await customLogRepository.findByIdAndUserId(userId, customLogId);
  if (!existing) {
    throw new NotFoundException("Custom log not found");
  }

  // そのcustomLogがそのmedicineに紐づいていることを確認
  const customItem = await customItemRepository.findByIdAndUserId(userId, existing.customItemId);
  if (!customItem || customItem.medicineId !== medicineId) {
    throw new BadRequestException("Custom log does not belong to this medicine");
  }

  const deleted = await customLogRepository.delete(customLogId);
  if (!deleted) {
    throw new NotFoundException("Custom log not found");
  }

  return noContent(c);
});

export default router;

