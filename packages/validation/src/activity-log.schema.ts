import { z } from "zod";

/**
 * Activity Actions
 */
export const activityActionEnum = z.enum([
  "ROOM_CREATED",
  "USER_JOINED",
  "USER_LEFT",
  "VERSION_CREATED",
  "VERSION_RESTORED",
  "PARTICIPANT_REMOVED",
  "PARTICIPANT_ROLE_CHANGED",
  "USER_BANNED",
  "MESSAGE_CREATED",
  "CODE_UPDATED",
  "CODE_SAVED",
  "ROOM_CLOSED",
]);

/**
 * Base Activity Schema
 */
export const activitySchema = z.object({
  _id: z.string(),

  room_code: z.string(),

  user_id: z.string(),

  action: activityActionEnum,

  metadata: z.record(z.string(), z.unknown()),

  created_at: z.date(),
});

/**
 * Full Activity Type
 */
export type Activity = z.infer<typeof activitySchema>;

/**
 * Create Activity Schema
 *
 * Backend generates:
 * - _id
 * - created_at
 */
export const createActivitySchema = activitySchema.omit({
  _id: true,
  created_at: true,
});

export type CreateActivityInput = z.infer<typeof createActivitySchema>;

/**
 * Update Activity Schema
 *
 * Usually activities are immutable,
 * but included for consistency.
 */
export const updateActivitySchema = createActivitySchema.partial();

export type UpdateActivityInput = z.infer<typeof updateActivitySchema>;
