import type { InferSelectModel } from "drizzle-orm";
import {
  pgTable,
  varchar,
  timestamp,
  json,
  uuid,
  text,
  integer,
  primaryKey,
  foreignKey,
  boolean,
} from "drizzle-orm/pg-core";

export const user = pgTable("User", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  email: varchar("email", { length: 64 }).notNull(),
  password: varchar("password", { length: 64 }),
});

export type User = InferSelectModel<typeof user>;

export const chat = pgTable("Chat", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  createdAt: timestamp("createdAt").notNull(),
  title: text("title").notNull(),
  userId: uuid("userId")
    .notNull()
    .references(() => user.id),
  visibility: varchar("visibility", { enum: ["public", "private"] })
    .notNull()
    .default("private"),
});

export type Chat = InferSelectModel<typeof chat>;

export const message = pgTable("Message", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  chatId: uuid("chatId")
    .notNull()
    .references(() => chat.id),
  role: varchar("role").notNull(),
  content: json("content").notNull(),
  createdAt: timestamp("createdAt").notNull(),
});

export type Message = InferSelectModel<typeof message>;

export const vote = pgTable(
  "Vote",
  {
    chatId: uuid("chatId")
      .notNull()
      .references(() => chat.id),
    messageId: uuid("messageId")
      .notNull()
      .references(() => message.id),
    isUpvoted: boolean("isUpvoted").notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.chatId, table.messageId] }),
    };
  }
);

export type Vote = InferSelectModel<typeof vote>;

export const document = pgTable(
  "Document",
  {
    id: uuid("id").notNull().defaultRandom(),
    createdAt: timestamp("createdAt").notNull(),
    title: text("title").notNull(),
    content: text("content"),
    kind: varchar("text", { enum: ["text", "code", "image"] })
      .notNull()
      .default("text"),
    userId: uuid("userId")
      .notNull()
      .references(() => user.id),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.id, table.createdAt] }),
    };
  }
);

export type Document = InferSelectModel<typeof document>;

export const suggestion = pgTable("Suggestion", {
  id: uuid("id").notNull().defaultRandom(),
  documentId: uuid("documentId").notNull(),
  documentCreatedAt: timestamp("documentCreatedAt").notNull(),
  originalText: text("originalText").notNull(),
  suggestedText: text("suggestedText").notNull(),
  description: text("description"),
  isResolved: boolean("isResolved").notNull().default(false),
  userId: uuid("userId")
    .notNull()
    .references(() => user.id),
  createdAt: timestamp("createdAt").notNull(),
});

export type Suggestion = InferSelectModel<typeof suggestion>;

export const ticket = pgTable("Ticket", {
  id: uuid().primaryKey().notNull().defaultRandom(),
  jiraTicketId: text(),
  createdAt: timestamp({ mode: "string" }).defaultNow().notNull(),
  userQuery: text().notNull(),
  severity: text().default("low"),
  assignedTo: text(),
  escalationTime: text(),
  resolved: boolean().default(false),
  userId: uuid().notNull().references(() => user.id),
});

export type Ticket = InferSelectModel<typeof ticket>;

export const action = pgTable("Action", {
  id: uuid().primaryKey().notNull().defaultRandom(),
  name: text().notNull(),
  description: text(),
  url: text().notNull(),
  port: integer(),
  method: text(),
  headers: text(),
  payload: json(),
  interval: integer(),
  next_run: timestamp({ mode: "string"}),
  script: text()
})

export type Action = InferSelectModel<typeof action>;

export const history = pgTable("History", {
  id: uuid().primaryKey().notNull().defaultRandom(),
  ticketId: uuid().references(() => ticket.id),
  chatId: uuid().notNull().references(() => chat.id),
  executedAt: timestamp({ mode: "string" }).defaultNow().notNull(),
  actionId: uuid().notNull().references(() => action.id),
  outcome: varchar("text", { enum: ["NOT STARTED", "REQUESTED", "STARTED", "FINISHED"] })
    .notNull()
    .default("NOT STARTED"),
  details: text().default("None provided")
})

export type History = InferSelectModel<typeof history>;