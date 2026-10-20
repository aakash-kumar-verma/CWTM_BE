import mongoose, { Schema } from "mongoose";
const invitationsSchema = new Schema(
  {
    workspaceId: {},
    email: {},
    role: {},
    status: {},
    tokenHash: {},
    invitedBy: {},
    expiresAt: {},
    acceptedAt: {},
    acceptedBy: {},
    revokedAt: {},
  },
  { timestamps: true },
);
export const Invitations = mongoose.model("Invitations", invitationsSchema);
