import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    status: {
      type: String,
      enum: ["active", "disabled", "pending_verification"],
      required: true,
      default: "pending_verification",
    },
    emailVerifiedAt: {
      type: Date,
      required: false,
    },
    lastLoginAt: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true },
);

export const User = mongoose.model("User", userSchema);
