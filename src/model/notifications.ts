import mongoose, { Schema } from "mongoose";
const notificationsSchema = new Schema(
  {
    workspaceId: {},
    userId: {},
    type: {},
    entityType: {},
    entityId: {},
    actorId: {},
    title: {},
    readAt: {},
  },
  { timestamps: true },
);
export const Notifications = mongoose.model(
  "Notifications",
  notificationsSchema,
);
