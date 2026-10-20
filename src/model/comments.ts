import mongoose, { Schema } from "mongoose";
const commentsSchema = new Schema(
  {
    workspaceId: {},
    taskId: {},
    authorId: {},
    body: {},
    mentionedUserIds: {},
    editedAt: {},
    deletedAt: {},
  },
  { timestamps: true },
);
export const Comments = mongoose.model("Comments", commentsSchema);
