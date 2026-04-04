ALTER TABLE "contact_submissions" RENAME COLUMN "read" TO "is_read";--> statement-breakpoint
ALTER TABLE "pages" ADD COLUMN "content" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "pages" ADD COLUMN "theme_tokens" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "pages" ADD COLUMN "interactions" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "pages" DROP COLUMN "hero_section";--> statement-breakpoint
ALTER TABLE "pages" DROP COLUMN "features_section";--> statement-breakpoint
ALTER TABLE "pages" DROP COLUMN "gallery_section";--> statement-breakpoint
ALTER TABLE "pages" DROP COLUMN "contact_section";--> statement-breakpoint
ALTER TABLE "pages" DROP COLUMN "section_order";