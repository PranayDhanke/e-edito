import { z } from "zod";

export const bannedParticipantSchema = z.object({
  _id: z.string(),
  room_code: z.string(),
  user_id: z.string(),
  banned_by: z.string(),
  reason: z
    .string()
    .trim()
    .min(1, "Reason is required")
    .max(500, "Reason cannot exceed 500 characters"),
  notes: z
    .string()
    .trim()
    .max(1000, "Notes cannot exceed 1000 characters")
    .nullable()
    .optional(),
  banned_at: z.date(),
});

export type BannedParticipant = z.infer<typeof bannedParticipantSchema>;

export const createBannedParticipantSchema = bannedParticipantSchema.omit({
  _id: true,
  banned_at: true,
});

export type CreateBannedParticipantInput = z.infer<
  typeof createBannedParticipantSchema
>;

export const createBannedParticipantFormSchema =
  createBannedParticipantSchema.omit({
    room_code: true,
    user_id: true,
    banned_by: true,
  });

export type CreateBannedParticipantFormInput = z.infer<
  typeof createBannedParticipantFormSchema
>;
