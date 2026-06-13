import { Activity } from "@repo/validation";
import { Schema, model, Types } from "mongoose";

const activityLogSchema = new Schema(
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

    action: {
      type: String,
      required: true,
      enum: [
        "ROOM_CREATED",
        "USER_JOINED",
        "USER_LEFT",
        "VERSION_CREATED",
        "PARTICIPANT_REMOVED",
        "PARTICIPANT_ROLE_CHANGED",
        "USER_BANNED",
        "MESSAGE_CREATED",
        "CODE_UPDATED",
        "CODE_SAVED",
        "ROOM_CLOSED",
      ],
    },

    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: false,
  },
);

export const activitLogModel = model<Activity>(
  "Activity-log",
  activityLogSchema,
);
