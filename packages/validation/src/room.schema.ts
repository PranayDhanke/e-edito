import { z } from "zod";

/**
 * Supported languages
 */
export const languageEnum = z.enum([
  "javascript",
  "typescript",
  "python",
  "java",
  "cpp",
]);

/**
 * Room status
 */
export const roomStatusEnum = z.enum(["active", "inactive", "closed"]);

/** 
 * Base Room Schema
 */
export const roomSchema = z.object({
  _id: z.string(),

  room_code: z
    .string()
    .trim()
    .min(6, "Room code must be at least 6 characters")
    .max(10, "Room code cannot exceed 10 characters"),

  name: z
    .string()
    .trim()
    .min(3, "Room name must be at least 3 characters")
    .max(100, "Room name cannot exceed 100 characters"),

  description: z
    .string()
    .trim()
    .max(500, "Description cannot exceed 500 characters"),

  owner_id: z.string(),

  language: languageEnum,

  code: z.string(),

  is_public: z.boolean(),

  is_audio_enabled: z.boolean(),

  is_video_enabled: z.boolean(),

  status: roomStatusEnum,

  maxParticipants: z
    .number()
    .int("Must be a whole number")
    .positive("Must be greater than 0"),

  participantCount: z
    .number()
    .int("Must be a whole number")
    .positive("Must be greater than 0"),

  created_at: z.date(),

  updated_at: z.date(),
});

/**
 * Full Room Type
 */
export type Room = z.infer<typeof roomSchema>;

/**
 * Create Room API Schema
 *
 * Used when sending data to backend.
 * Backend generates:
 * - _id
 * - created_at
 * - updated_at
 */
export const createRoomSchema = roomSchema.omit({
  _id: true,
  created_at: true,
  updated_at: true,
});

export type CreateRoomInput = z.infer<typeof createRoomSchema>;

/**
 * Create Room Form Schema
 *
 * Used by React Hook Form.
 * User should NOT provide:
 * - owner_id
 * - room_code
 * - status
 */
export const createRoomFormSchema = createRoomSchema.omit({
  owner_id: true,
  room_code: true,
  status: true,
  participantCount: true,
});

export type CreateRoomFormInput = z.infer<typeof createRoomFormSchema>;

/**
 * Update Room Schema
 */
export const updateRoomSchema = createRoomSchema.partial();

export type UpdateRoomInput = z.infer<typeof updateRoomSchema>;

/**
 * Join Room Schema
 */
export const joinRoomSchema = z.object({
  room_code: z
    .string()
    .trim()
    .min(6, "Room code must be at least 6 characters")
    .max(10, "Room code cannot exceed 10 characters"),
});

export type JoinRoomInput = z.infer<typeof joinRoomSchema>;
