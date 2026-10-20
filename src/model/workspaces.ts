import mongoose, { Schema } from "mongoose";

const workspacesSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    setting: {
      type: Object,
      required: false,
    },
    status: {
      type: String,
      enum: ["active", "archived"],
      required: true,
    },
    archivedAt: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true },
);

export const Workspaces = mongoose.model("Workspaces", workspacesSchema);
