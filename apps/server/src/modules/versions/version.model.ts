import { versionCode } from "@repo/validation";
import { Schema, model, models, Types } from "mongoose";

const versionSchema = new Schema(
  {
    room_code: {
      type: Schema.Types.String,
      ref: "Room",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    code: {
      type: String,
      required: true,
    },

    language: {
      type: String,
      required: true,
      enum: ["javascript", "typescript", "python", "java", "cpp"],
    },

    saved_by: {
      type: String,
      required: true,
      index: true,
    },

    reason: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  },
);

export const VersionCodeModel = model<versionCode>("Version", versionSchema);
