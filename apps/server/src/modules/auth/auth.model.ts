import { Schema, model } from "mongoose";
import type { User } from "@repo/shared-types";

const userSchema = new Schema<User>(
  {
    _id: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    profile_image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },

    versionKey: false,
  },
);

export const UserModel = model<User>("User", userSchema);
