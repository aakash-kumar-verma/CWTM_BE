import mongoose, { Schema } from "mongoose";
const sessionsSchema = new Schema(
  {
    userId: {},
    tokenHash: {},
    familyId: {},
    expiresAt: {},
    revokedAt: {},
    replacedBySessionId: {},
    userAgent: {},
    ipHash: {},
    lastUsedAt: {},
  },
  { timestamps: true },
);
export const Sessions = mongoose.model("Sessions", sessionsSchema);
