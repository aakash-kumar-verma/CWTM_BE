import mongoose, { Schema } from "mongoose";
const outBoxEventsSchema = new Schema(
  {
    eventType: {},
    aggregateType: {},
    aggregateId: {},
    workspaceId: {},
    payload: {},
    attempts: {},
    availableAt: {},
    processedAt: {},
    status: {},
    lastErrorCode: {},
  },
  { timestamps: true },
);
export const OutBoxEvents = mongoose.model("OutBoxEvents", outBoxEventsSchema);
