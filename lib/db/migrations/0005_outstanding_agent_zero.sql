CREATE TABLE IF NOT EXISTS "Ticket" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp NOT NULL,
	"userQuery" text NOT NULL,
	"severity" text DEFAULT 'low',
	"assignedTo" text,
	"escalationTime" text,
	"resolved" boolean DEFAULT false,
	"userId" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "Suggestion" DROP CONSTRAINT "Suggestion_documentId_documentCreatedAt_Document_id_createdAt_fk";
--> statement-breakpoint
ALTER TABLE "Suggestion" DROP CONSTRAINT "Suggestion_id_pk";