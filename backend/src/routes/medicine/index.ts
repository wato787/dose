import { Hono } from "hono";
import { authMiddleware } from "../../middleware";
import findMedicinesRouter from "./routes/find-medicines";
import findMedicineRouter from "./routes/find-medicine";
import createMedicineRouter from "./routes/create-medicine";
import updateMedicineRouter from "./routes/update-medicine";
import deleteMedicineRouter from "./routes/delete-medicine";
import customLogsRouter from "./routes/custom-logs";

const router = new Hono();

router.use("*", authMiddleware);

router.route("/", findMedicinesRouter);
router.route("/", findMedicineRouter);
router.route("/", createMedicineRouter);
router.route("/", updateMedicineRouter);
router.route("/", deleteMedicineRouter);
router.route("/", customLogsRouter);

export default router;