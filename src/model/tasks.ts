import mongoose, { Schema } from "mongoose";
const tasksSchema = new Schema(
  {
    workspaceId: {},
    projectId: {},
    title: {},
    status: {},
    description: {},
    priority: {},
    assigneeId: {},
    reporterId: {},
    dueAt: {},
    labels: {},
    position: {},
    archivedAt: {},
    version: {},
  },
  { timestamps: true },
);
export const Tasks = mongoose.model("Tasks", tasksSchema);
