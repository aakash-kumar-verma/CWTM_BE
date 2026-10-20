import mongoose, { Schema } from "mongoose";
const passwordResetsSchema = new Schema(
  {
    userId: {},
    tokenHash: {},
    expiresAt: {},
    usedAt: {},
    createdAt: {},
  },
  { timestamps: true },
);
export const PasswordResets = mongoose.model(
  "PasswordResets",
  passwordResetsSchema,
);
