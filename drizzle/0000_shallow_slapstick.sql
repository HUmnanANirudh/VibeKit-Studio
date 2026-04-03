CREATE TABLE "contact_submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"page_id" uuid NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"read" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "page_views" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"page_id" uuid NOT NULL,
	"viewed_at" timestamp DEFAULT now() NOT NULL,
	"user_agent" text,
	"referer" text
);
--> statement-breakpoint
CREATE TABLE "pages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"theme" text DEFAULT 'minimal' NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"hero_section" jsonb DEFAULT '{"title":"Welcome to My Site","subtitle":"A beautiful mini-site built with VibeKit Studio","buttonText":"Get Started","buttonUrl":"#contact"}'::jsonb,
	"features_section" jsonb DEFAULT '[{"title":"Feature One","description":"Describe your first amazing feature here."},{"title":"Feature Two","description":"Explain what makes this feature special."},{"title":"Feature Three","description":"Share another benefit or capability."}]'::jsonb,
	"gallery_section" jsonb DEFAULT '[{"url":"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800","alt":"Gallery image 1"},{"url":"https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800","alt":"Gallery image 2"},{"url":"https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800","alt":"Gallery image 3"}]'::jsonb,
	"contact_section" jsonb DEFAULT '{"heading":"Get In Touch","subheading":"We'd love to hear from you."}'::jsonb,
	"section_order" jsonb DEFAULT '["hero","features","gallery","contact"]'::jsonb,
	"view_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"published_at" timestamp,
	CONSTRAINT "pages_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"refresh_token" text NOT NULL,
	"user_agent" text,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "sessions_refresh_token_unique" UNIQUE("refresh_token")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "contact_submissions" ADD CONSTRAINT "contact_submissions_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page_views" ADD CONSTRAINT "page_views_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pages" ADD CONSTRAINT "pages_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;