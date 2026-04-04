import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  uuid,
  jsonb,
} from 'drizzle-orm/pg-core'

// ============================================
// USERS TABLE
// ============================================
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// ============================================
// PAGES TABLE
// Each page is a themed mini-site
// ============================================
export const pages = pgTable('pages', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  theme: text('theme').notNull().default('minimal'), // one of 6 vibe presets
  status: text('status').notNull().default('draft'), // 'draft' | 'published'

  // Dynamic content and Design System stored as JSONB
  content: jsonb('content').default([]).notNull(),
  themeTokens: jsonb('theme_tokens').default({}).notNull(),
  interactions: jsonb('interactions').default({}).notNull(),

  viewCount: integer('view_count').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  publishedAt: timestamp('published_at'),
})

// ============================================
// PAGE VIEWS TABLE
// Track individual page views with metadata
// ============================================
export const pageViews = pgTable('page_views', {
  id: uuid('id').primaryKey().defaultRandom(),
  pageId: uuid('page_id')
    .notNull()
    .references(() => pages.id, { onDelete: 'cascade' }),
  viewedAt: timestamp('viewed_at').defaultNow().notNull(),
  userAgent: text('user_agent'),
  referer: text('referer'),
})

// ============================================
// CONTACT SUBMISSIONS TABLE
// Stores form submissions from published pages
// ============================================
export const contactSubmissions = pgTable('contact_submissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  pageId: uuid('page_id')
    .notNull()
    .references(() => pages.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  email: text('email').notNull(),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  isRead: boolean('is_read').notNull().default(false),
})

// ============================================
// TYPES
// ============================================

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

export type Page = typeof pages.$inferSelect
export type NewPage = typeof pages.$inferInsert

export type PageView = typeof pageViews.$inferSelect
export type ContactSubmission = typeof contactSubmissions.$inferSelect

export type Theme =
  | 'minimal'
  | 'neo-brutal'
  | 'dark-neon'
  | 'pastel'
  | 'luxury'
  | 'retro'

// ============================================
// SESSIONS TABLE
// Stores refresh tokens for persistent sessions
// ============================================
export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  refreshToken: text('refresh_token').notNull().unique(),
  userAgent: text('user_agent'),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export type PageStatus = 'draft' | 'published'

export type HeroSection = {
  title: string
  subtitle: string
  buttonText: string
  buttonUrl: string
}

export type FeatureCard = {
  title: string
  description: string
}

export type GalleryImage = {
  url: string
  alt: string
}

export type ContactSectionConfig = {
  heading: string
  subheading: string
}
