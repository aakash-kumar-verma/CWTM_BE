import mongoose, { Schema } from "mongoose";

const membershipsSchema = new Schema(
  {
    workspaceId: {},
    userId: {},
    role: {},
    status: {},
    joinedAt: {},
    invitedBy: {},
  },
  { timestamps: true },
);

export const Memberships = mongoose.model("Memberships", membershipsSchema);
