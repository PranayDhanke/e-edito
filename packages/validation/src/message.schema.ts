import { z } from "zod";

export const messageTypeEnum = z.enum(["TEXT", "SYSTEM"]);

export const messageSchema = z.object({
  _id: z.string(),
  room_code: z.string(),
  sender_id: z.string(),
  message: z
    .string()
    .trim()
    .min(1, "Message is required")
    .max(2000, "Message cannot exceed 2000 characters"),
  type: messageTypeEnum,
  created_at: z.date(),
});

export type Message = z.infer<typeof messageSchema>;

export const createMessageSchema = messageSchema.omit({
  _id: true,
  created_at: true,
});

export type CreateMessageInput = z.infer<typeof createMessageSchema>;

export const createMessageFormSchema = createMessageSchema.omit({
  room_code: true,
  sender_id: true,
}).extend({
  type: messageTypeEnum.optional(),
});

export type CreateMessageFormInput = z.infer<typeof createMessageFormSchema>;
