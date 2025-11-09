import { Hono } from "hono";
import { db } from "../../../db";
import { medicineRepository } from "../../../repository/medicine";
import { scheduleRepository } from "../../../repository/schedule";
import { customItemRepository } from "../../../repository/custom-item";
import { customLogRepository } from "../../../repository/custom-log";
import { BadRequestException, NotFoundException } from "../../../utils/http-exception";
import { ok } from "../../../utils/response";

const router = new Hono();

/**
 * GET /api/medicine/:id
 * 特定の薬の詳細を取得（スケジュール、カスタムアイテム、カスタムログも含む）
 */
router.get("/:id", async (c) => {
  // ContextからユーザーIDを取得（middlewareで設定済み）
  const userId = c.get("userId");
  const medicineId = parseInt(c.req.param("id"), 10);

  if (isNaN(medicineId)) {
    throw new BadRequestException("Invalid medicine ID");
  }

  // Repositoryを使ってデータベースから取得
  const medicine = await medicineRepository.findByIdAndUserId(db, userId, medicineId);

  if (!medicine) {
    throw new NotFoundException("Medicine not found");
  }

  // スケジュールとカスタムアイテムも取得
  const schedules = await scheduleRepository.findByMedicineId(db, userId, medicineId);
  const customItems = await customItemRepository.findByMedicineId(db, userId, medicineId);

  // 各カスタムアイテムのカスタムログも取得
  const customItemsWithLogs = await Promise.all(
    customItems.map(async (item) => {
      const customLogs = await customLogRepository.findByCustomItemId(db, userId, item.customItemId);
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
