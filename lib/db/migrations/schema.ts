import { pgTable, uuid, varchar, foreignKey, timestamp, text, json, boolean, integer, primaryKey } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"




export const user = pgTable("User", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	email: varchar({ length: 64 }).notNull(),
	password: varchar({ length: 64 }),
});

export const chat = pgTable("Chat", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	createdAt: timestamp({ mode: 'string' }).notNull(),
	title: text().notNull(),
	userId: uuid().notNull(),
	visibility: varchar().default('private').notNull(),
},
(table) => {
	return {
		chatUserIdUserIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "Chat_userId_User_id_fk"
		}),
	}
});

export const message = pgTable("Message", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	chatId: uuid().notNull(),
	role: varchar().notNull(),
	content: json().notNull(),
	createdAt: timestamp({ mode: 'string' }).notNull(),
},
(table) => {
	return {
		messageChatIdChatIdFk: foreignKey({
			columns: [table.chatId],
			foreignColumns: [chat.id],
			name: "Message_chatId_Chat_id_fk"
		}),
	}
});

export const suggestion = pgTable("Suggestion", {
	id: uuid().defaultRandom().notNull(),
	documentId: uuid().notNull(),
	documentCreatedAt: timestamp({ mode: 'string' }).notNull(),
	originalText: text().notNull(),
	suggestedText: text().notNull(),
	description: text(),
	isResolved: boolean().default(false).notNull(),
	userId: uuid().notNull(),
	createdAt: timestamp({ mode: 'string' }).notNull(),
},
(table) => {
	return {
		suggestionUserIdUserIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "Suggestion_userId_User_id_fk"
		}),
	}
});

export const ticket = pgTable("Ticket", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	userQuery: text().notNull(),
	severity: text().default('low'),
	assignedTo: text(),
	escalationTime: text(),
	resolved: boolean().default(false),
	userId: uuid().notNull(),
	jiraTicketId: text(),
},
(table) => {
	return {
		ticketUserIdUserIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "Ticket_userId_User_id_fk"
		}),
	}
});

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

export const vote = pgTable("Vote", {
	chatId: uuid().notNull(),
	messageId: uuid().notNull(),
	isUpvoted: boolean().notNull(),
},
(table) => {
	return {
		voteChatIdChatIdFk: foreignKey({
			columns: [table.chatId],
			foreignColumns: [chat.id],
			name: "Vote_chatId_Chat_id_fk"
		}),
		voteMessageIdMessageIdFk: foreignKey({
			columns: [table.messageId],
			foreignColumns: [message.id],
			name: "Vote_messageId_Message_id_fk"
		}),
		voteChatIdMessageIdPk: primaryKey({ columns: [table.chatId, table.messageId], name: "Vote_chatId_messageId_pk"}),
	}
});

export const document = pgTable("Document", {
	id: uuid().defaultRandom().notNull(),
	createdAt: timestamp({ mode: 'string' }).notNull(),
	title: text().notNull(),
	content: text(),
	text: varchar().default('text').notNull(),
	userId: uuid().notNull(),
},
(table) => {
	return {
		documentUserIdUserIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "Document_userId_User_id_fk"
		}),
		documentIdCreatedAtPk: primaryKey({ columns: [table.id, table.createdAt], name: "Document_id_createdAt_pk"}),
	}
});