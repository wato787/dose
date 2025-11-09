import { z } from "zod";

export const findMedicineQuerySchema = z.object({
  isActive: z.string().optional().transform((val) => val === "true"),
  limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : undefined)),
  offset: z.string().optional().transform((val) => (val ? parseInt(val, 10) : undefined)),
});

export const scheduleInputSchema = z.object({
  time: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, "Time must be in HH:MM format"),
  frequencyType: z.enum(["DAILY", "WEEKLY", "CUSTOM"]).optional().default("DAILY"),
  startDate: z.coerce.date(),
});

export const customItemInputSchema = z.object({
  itemName: z.string().min(1, "Item name is required"),
  dataType: z.enum(["BOOL", "NUMBER", "TEXT", "RATING"]),
  isRequired: z.boolean().optional().default(false),
});

export const createMedicineSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional().nullable(),
  isActive: z.boolean().optional().default(true),
  schedule: scheduleInputSchema.optional(),
  customItems: z.array(customItemInputSchema).optional().default([]),
});

export const updateMedicineSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  description: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  schedule: scheduleInputSchema.optional(),
  customItems: z.array(customItemInputSchema).optional(),
});

export const medicineResponseSchema = z.object({
  medicineId: z.number(),
  userId: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  isActive: z.boolean(),
  registeredAt: z.date(),
});