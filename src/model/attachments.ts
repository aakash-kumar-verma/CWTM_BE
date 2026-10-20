import mongoose, { Schema } from "mongoose";
const attachmentsSchema = new Schema(
  {
    workspaceId: {},
    taskId: {},
    uploadedBy: {},
    objectKey: {},
    originalFileName: {},
    contentType: {},
    sizeBytes: {},
    checksum: {},
    status: {},
    rejectionReason: {},
  },
  { timestamps: true },
);
export const Attachments = mongoose.model("Attachments", attachmentsSchema);
