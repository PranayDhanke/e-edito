import { Message } from "@repo/validation";
import { Schema, model } from "mongoose";

const messageSchema = new Schema(
  {
    room_code: {
      type: Schema.Types.String,
      ref: "Room",
      required: true,
      index: true,
    },
    sender_id: {
      type: Schema.Types.String,
      ref: "User",
      required: true,
      index: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    type: {
      type: String,
      required: true,
      enum: ["TEXT", "SYSTEM"],
      default: "TEXT",
    },
    created_at: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    versionKey: false,
  },
);

export const MessageModel = model<Message>("Message", messageSchema);
