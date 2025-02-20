ALTER TABLE "Action" RENAME COLUMN "connection" TO "url";--> statement-breakpoint
ALTER TABLE "Action" RENAME COLUMN "command" TO "script";--> statement-breakpoint
ALTER TABLE "Action" ADD COLUMN "port" integer;--> statement-breakpoint
ALTER TABLE "Action" ADD COLUMN "method" text;--> statement-breakpoint
ALTER TABLE "Action" ADD COLUMN "headers" text;--> statement-breakpoint
ALTER TABLE "Action" ADD COLUMN "payload" json;--> statement-breakpoint
ALTER TABLE "Action" ADD COLUMN "interval" integer;--> statement-breakpoint
ALTER TABLE "Action" ADD COLUMN "next_run" timestamp;