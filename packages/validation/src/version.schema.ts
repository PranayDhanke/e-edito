import { z } from "zod";
import { languageEnum } from "./room.schema";

/**
 * version Code Schema
 */
export const versionCodeSchema = z.object({
  _id: z.string(),

  room_code: z.string(),

  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name cannot exceed 100 characters"),

  code: z.string().trim().min(1, "Code is required"),

  saved_by: z.string(), 

  language: languageEnum,

  reason: z.string().trim().max(500, "Reason cannot exceed 500 characters"),

  created_at: z.date(),
});

/**
 * Full Saved Code Type
 */
export type versionCode = z.infer<typeof versionCodeSchema>;

/**
 * Create Saved Code Schema
 *
 * Backend generates:
 * - _id
 * - created_at
 */
export const createVersionCodeSchema = versionCodeSchema.omit({
  _id: true,
  created_at: true,
});

export type CreateVersionCodeInput = z.infer<typeof createVersionCodeSchema>;

/**
 * Create Saved Code Form Schema
 *
 * User should NOT provide:
 * - saved_by
 */
export const createVersionCodeFormSchema = createVersionCodeSchema.omit({
  saved_by: true,
});

export type CreateVersionCodeFormInput = z.infer<
  typeof createVersionCodeFormSchema
>;

/**
 * Update Saved Code Schema
 */
export const updateVersionCodeSchema = createVersionCodeSchema.partial();

export type UpdateVersionCodeInput = z.infer<typeof updateVersionCodeSchema>;
