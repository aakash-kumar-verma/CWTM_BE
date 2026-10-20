import mongoose, { Schema } from "mongoose";
const projectSchema = new Schema(
  {
    workspaceId: {},
    name: {},
    key: {},
    description: {},
    createdBy: {},
    status: {},
    archivedAt: {},
    version: {},
  },
  { timestamps: true },
);
export const Projects = mongoose.model("Projects", projectSchema);
