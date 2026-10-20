import mongoose, { Schema } from "mongoose";
const auditEventsSchema = new Schema(
  {
    workspaceId: {},
    actorId: {},
    action: {},
    entityType: {},
    entityId: {},
    metadata: {},
    requestId: {},
  },
  { timestamps: true },
);
export const AuditEvents = mongoose.model("AuditEvents", auditEventsSchema);
