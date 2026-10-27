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
      required: function (this: any) {
        // Password is required only for non-Google accounts
        return !this.googleId;
      },
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
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    profileImage: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

export const User = mongoose.model("User", userSchema);
