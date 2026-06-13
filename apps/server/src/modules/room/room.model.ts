// room.model.ts

import { Room } from "@repo/validation";
import { Schema, model, InferSchemaType } from "mongoose";

const RoomSchema = new Schema(
  {
    room_code: {
      type: String,
      required: true,
      trim: true,
      minlength: 6,
      maxlength: 10,
      unique: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true, 
      minlength: 3,
      maxlength: 100,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    owner_id: {
      type: Schema.Types.String,
      ref: "User",
      required: true,
      index: true,
    },

    language: {
      type: String,
      required: true,
      enum: ["javascript", "typescript", "python", "java", "cpp"],
    },

    code: {
      type: String,
      default: "",
    },

    is_public: {
      type: Boolean,
      default: true,
    },

    is_audio_enabled: {
      type: Boolean,
      default: true,
    },

    is_video_enabled: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["active", "inactive", "closed"],
      default: "active",
    },

    maxParticipants: {
      type: Number,
      required: true,
      min: 1,
    },

    participantCount: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
);


export const RoomModel = model<Room>("Room", RoomSchema);
