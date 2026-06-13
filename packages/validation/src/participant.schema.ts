import { z } from "zod";

/**
 * Participant Roles
 */
export const participantRoleEnum = z.enum(["owner", "editor", "viewer"]);

/**
 * Base Room Participant Schema
 */
export const roomParticipantSchema = z.object({
  _id: z.string(),

  room_code: z.string(),

  user_id: z.string(),
 
  role: participantRoleEnum,

  invited_by: z.string().nullable(),

  joined_at: z.date(),
});

/**
 * Full Participant Type
 */
export type RoomParticipant = z.infer<typeof roomParticipantSchema>;

/**
 * Create Participant Schema
 *
 * Used by backend when adding a participant.
 */
export const createRoomParticipantSchema = roomParticipantSchema.omit({
  _id: true,
  joined_at: true,
});

export type CreateRoomParticipantInput = z.infer<
  typeof createRoomParticipantSchema
>;

/**
 * Join Room Schema
 *
 * Used when a user joins a room.
 * Backend fills:
 * - user_id
 * - role
 * - invited_by
 */

export const joinRoomParticipantSchema = createRoomParticipantSchema.omit({
  user_id: true,
});

export type JoinRoomParticipantInput = z.infer<
  typeof joinRoomParticipantSchema
>;

/**
 * Update Participant Schema
 */
export const updateRoomParticipantSchema =
  createRoomParticipantSchema.partial();

export type UpdateRoomParticipantInput = z.infer<
  typeof updateRoomParticipantSchema
>;
