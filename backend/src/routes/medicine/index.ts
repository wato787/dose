import { Hono } from "hono";
import { authMiddleware } from "../../middleware";
import createMedicineRouter from "./routes/create-medicine";
import customLogsRouter from "./routes/custom-logs";
import deleteMedicineRouter from "./routes/delete-medicine";
import findMedicineRouter from "./routes/find-medicine";
import findMedicinesRouter from "./routes/find-medicines";
import updateMedicineRouter from "./routes/update-medicine";

const router = new Hono();

router.use("*", authMiddleware);

router.route("/", findMedicinesRouter);
router.route("/", findMedicineRouter);
router.route("/", createMedicineRouter);
router.route("/", updateMedicineRouter);
router.route("/", deleteMedicineRouter);
router.route("/", customLogsRouter);

export default router;
