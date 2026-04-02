-- VibeKit Studio — initial schema migration
-- Run via: drizzle-kit migrate  OR  psql -f db/migrations/0001_init.sql

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  theme TEXT NOT NULL DEFAULT 'minimal',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  hero_section JSONB NOT NULL DEFAULT '{"title":"Welcome","subtitle":"Built with VibeKit Studio","buttonText":"Get Started","buttonUrl":"#contact"}',
  features_section JSONB NOT NULL DEFAULT '[{"title":"Feature One","description":"Describe your first feature."}]',
  gallery_section JSONB NOT NULL DEFAULT '[{"url":"","alt":"Gallery image"}]',
  contact_section JSONB NOT NULL DEFAULT '{"heading":"Get In Touch","subheading":"We would love to hear from you."}',
  section_order JSONB NOT NULL DEFAULT '["hero","features","gallery","contact"]',
  view_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS pages_user_idx ON pages(user_id);
CREATE INDEX IF NOT EXISTS pages_slug_idx ON pages(slug);
CREATE INDEX IF NOT EXISTS pages_status_idx ON pages(status);

CREATE TABLE IF NOT EXISTS page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_agent TEXT,
  referer TEXT
);

CREATE INDEX IF NOT EXISTS page_views_page_idx ON page_views(page_id);

CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  read BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS submissions_page_idx ON contact_submissions(page_id);
