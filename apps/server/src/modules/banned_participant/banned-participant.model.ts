import { BannedParticipant } from "@repo/validation";
import { Schema, model } from "mongoose";

const bannedParticipantSchema = new Schema(
  {
    room_code: {
      type: Schema.Types.String,
      ref: "Room",
      required: true,
      index: true,
    },
    user_id: {
      type: Schema.Types.String,
      ref: "User",
      required: true,
      index: true,
    },
    banned_by: {
      type: Schema.Types.String,
      ref: "User",
      required: true,
      index: true,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: null,
    },
    banned_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  },
);

export const BannedParticipantModel = model<BannedParticipant>(
  "BannedParticipant",
  bannedParticipantSchema,
);
