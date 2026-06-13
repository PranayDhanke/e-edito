import { RoomParticipant } from "@repo/validation";
import { Schema, model, Types } from "mongoose";

const roomParticipantSchema = new Schema(
  {
    room_code: {
      type: Schema.Types.ObjectId,
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

    role: {
      type: String,
      required: true,
      enum: ["owner", "editor", "viewer"],
      default: "viewer",
    },

    invitedBy: {
      type: Schema.Types.String,
      ref: "User",
      default: null,
    },

    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  },
);

export const RoomParticipantModel = model<RoomParticipant>(
  "Participant",
  roomParticipantSchema,
);
