CREATE TABLE IF NOT EXISTS "Action" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"connection" text NOT NULL,
	"command" text
);
--> statement-breakpoint
ALTER TABLE "History" DROP CONSTRAINT "History_userId_User_id_fk";
--> statement-breakpoint
ALTER TABLE "History" ADD COLUMN "actionId" uuid NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "History" ADD CONSTRAINT "History_actionId_Action_id_fk" FOREIGN KEY ("actionId") REFERENCES "public"."Action"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "History" DROP COLUMN IF EXISTS "userId";