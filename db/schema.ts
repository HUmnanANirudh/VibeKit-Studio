import { pgTable, text, integer, boolean, timestamp, uuid, jsonb } from 'drizzle-orm/pg-core'

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
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  theme: text('theme').notNull().default('minimal'), // one of 6 vibe presets
  status: text('status').notNull().default('draft'), // 'draft' | 'published'

  // Page sections stored as JSONB
  heroSection: jsonb('hero_section').default({
    title: 'Welcome to My Site',
    subtitle: 'A beautiful mini-site built with VibeKit Studio',
    buttonText: 'Get Started',
    buttonUrl: '#contact',
  }),

  featuresSection: jsonb('features_section').default([
    { title: 'Feature One', description: 'Describe your first amazing feature here.' },
    { title: 'Feature Two', description: 'Explain what makes this feature special.' },
    { title: 'Feature Three', description: 'Share another benefit or capability.' },
  ]),

  gallerySection: jsonb('gallery_section').default([
    { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', alt: 'Gallery image 1' },
    { url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800', alt: 'Gallery image 2' },
    { url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800', alt: 'Gallery image 3' },
  ]),

  contactSection: jsonb('contact_section').default({
    heading: 'Get In Touch',
    subheading: 'We\'d love to hear from you.',
  }),

  // Section order (array of section names)
  sectionOrder: jsonb('section_order').default(['hero', 'features', 'gallery', 'contact']),

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
  pageId: uuid('page_id').notNull().references(() => pages.id, { onDelete: 'cascade' }),
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
  pageId: uuid('page_id').notNull().references(() => pages.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  email: text('email').notNull(),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  read: boolean('read').notNull().default(false),
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
