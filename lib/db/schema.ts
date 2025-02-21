import type { InferSelectModel } from 'drizzle-orm';
import {
  pgTable,
  varchar,
  timestamp,
  json,
  uuid,
  text,
  primaryKey,
  foreignKey,
  boolean,
  integer,
} from 'drizzle-orm/pg-core';

export const user = pgTable('User', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  email: varchar('email', { length: 64 }).notNull(),
  password: varchar('password', { length: 64 }),
});

export type User = InferSelectModel<typeof user>;

export const chat = pgTable('Chat', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  createdAt: timestamp('createdAt').notNull(),
  title: text('title').notNull(),
  userId: uuid('userId')
    .notNull()
    .references(() => user.id),
  visibility: varchar('visibility', { enum: ['public', 'private'] })
    .notNull()
    .default('private'),
});

export type Chat = InferSelectModel<typeof chat>;

export const message = pgTable('Message', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  chatId: uuid('chatId')
    .notNull()
    .references(() => chat.id),
  role: varchar('role').notNull(),
  content: json('content').notNull(),
  createdAt: timestamp('createdAt').notNull(),
});

export type Message = InferSelectModel<typeof message>;

export const vote = pgTable(
  'Vote',
  {
    chatId: uuid('chatId')
      .notNull()
      .references(() => chat.id),
    messageId: uuid('messageId')
      .notNull()
      .references(() => message.id),
    isUpvoted: boolean('isUpvoted').notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.chatId, table.messageId] }),
    };
  },
);

export type Vote = InferSelectModel<typeof vote>;

export const document = pgTable(
  'Document',
  {
    id: uuid('id').notNull().defaultRandom(),
    createdAt: timestamp('createdAt').notNull(),
    title: text('title').notNull(),
    content: text('content'),
    kind: varchar('text', { enum: ['text', 'code', 'image'] })
      .notNull()
      .default('text'),
    userId: uuid('userId')
      .notNull()
      .references(() => user.id),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.id, table.createdAt] }),
    };
  },
);

export type Document = InferSelectModel<typeof document>;

export const suggestion = pgTable(
  'Suggestion',
  {
    id: uuid('id').notNull().defaultRandom(),
    documentId: uuid('documentId').notNull(),
    documentCreatedAt: timestamp('documentCreatedAt').notNull(),
    originalText: text('originalText').notNull(),
    suggestedText: text('suggestedText').notNull(),
    description: text('description'),
    isResolved: boolean('isResolved').notNull().default(false),
    userId: uuid('userId')
      .notNull()
      .references(() => user.id),
    createdAt: timestamp('createdAt').notNull(),
  },
);

export type Suggestion = InferSelectModel<typeof suggestion>;

export const ticket = pgTable("Ticket", {
	id: uuid().defaultRandom().primaryKey().notNull(),
  jiraTicketId: text(),
	createdAt: timestamp({ mode: 'string' }).notNull(),
	userQuery: text().notNull(),
	severity: text().default('low'),
	assignedTo: text(),
	escalationTime: text(),
	resolved: boolean().default(false),
	userId: uuid().notNull(),
}
);
export type Ticket = InferSelectModel<typeof ticket>;

export const action = pgTable("Action", {

	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	description: text(),
	url: text().notNull(),
	script: text(),
	port: integer(),
	method: text(),
	headers: text(),
	payload: json(),
	interval: integer(),
	nextRun: timestamp("next_run", { mode: 'string' }),
});
export type Action = InferSelectModel<typeof history>;

export const history = pgTable("History", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	ticketId: uuid(),
	chatId: uuid(),
	executedAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	actionId: uuid().notNull(),
	text: varchar().default('NOT STARTED').notNull(),
	details: text().default('None provided'),
},
(table) => {
	return {
		historyTicketIdTicketIdFk: foreignKey({
			columns: [table.ticketId],
			foreignColumns: [ticket.id],
			name: "History_ticketId_Ticket_id_fk"
		}),
		historyChatIdChatIdFk: foreignKey({
			columns: [table.chatId],
			foreignColumns: [chat.id],
			name: "History_chatId_Chat_id_fk"
		}),
		historyActionIdActionIdFk: foreignKey({
			columns: [table.actionId],
			foreignColumns: [action.id],
			name: "History_actionId_Action_id_fk"
		}),
	}
});
export type History = InferSelectModel<typeof history>;