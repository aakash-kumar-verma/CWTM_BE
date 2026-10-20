import { User } from "../model/User.ts";
import { Workspaces } from "../model/workspaces.ts";
import { Projects } from "../model/projects.ts";
import { Tasks } from "../model/tasks.ts";
import { Attachments } from "../model/attachments.ts";
import { AuditEvents } from "../model/auditEvents.ts";
import { Comments } from "../model/comments.ts";
import { Invitations } from "../model/invitations.ts";
import { Memberships } from "../model/memberships.ts";
import { Notifications } from "../model/notifications.ts";
import { OutBoxEvents } from "../model/outboxEvents.ts";
import { PasswordResets } from "../model/passwordResets.ts";
import { Sessions } from "../model/sessions.ts";
import { UserAuth } from "../model/auth.ts";
import mongoose from "mongoose";

const models = [
  User,
  Workspaces,
  Projects,
  Tasks,
  Attachments,
  AuditEvents,
  Comments,
  Invitations,
  Memberships,
  Notifications,
  OutBoxEvents,
  PasswordResets,
  Sessions,
  UserAuth,
];

export async function initCollections() {
  for (const model of models) {
    const collectionName = model.collection.name;

    const exists = await mongoose.connection.db
      ?.listCollections({ name: collectionName }, { nameOnly: true })
      .hasNext();

    if (!exists) {
      await model.createCollection();
      console.log(`Created collection: ${collectionName}`);
    } else {
      console.log(`Collection already exists: ${collectionName}`);
    }
  }
}
