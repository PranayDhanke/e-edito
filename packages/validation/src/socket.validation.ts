import z from "zod";
import { participantRoleEnum } from "./participant.schema";

//socket join room schema
export const joinSocketRoomSchema = z.object({
  room_code: z
    .string()
    .trim()
    .min(6, "Room code must be at least 6 characters")
    .max(10, "Room code cannot exceed 10 characters"),

  role: participantRoleEnum,
});

export type JoinSocketRoomInput = z.infer<typeof joinSocketRoomSchema>;
