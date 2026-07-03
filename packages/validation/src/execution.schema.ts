import { z } from "zod";
import { languageEnum } from "./room.schema";

export const executeCodeSchema = z.object({
  room_code: z.string().trim().min(1, "Room code is required"),
  language: languageEnum,
  code: z.string().min(1, "Code is required"),
});

export type ExecuteCodeInput = z.infer<typeof executeCodeSchema>;
