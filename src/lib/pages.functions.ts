import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { getDb } from '../db/index'
import { getSessionUser } from './session.server'
import { pages } from '../db/schema'
import { eq, and } from 'drizzle-orm'
import { z } from 'zod'
import type { PageRenderData } from '#/types'

// Helper to check auth
async function requireAuth() {
  const request = getRequest()
  if (!request) throw new Error('No request')
  const user = await getSessionUser(request)
  if (!user) throw new Error('Unauthorized')
  return user
}

// 1. Get all pages for user
export const getPages = createServerFn({ method: 'GET' })
  .handler(async () => {
    const user = await requireAuth()
    const db = getDb()
    const results = await db
      .select()
      .from(pages)
      .where(eq(pages.userId, user.id))

    return results as unknown as PageRenderData[]
  })

// 2. Get single page
export const getPage = createServerFn({ method: 'GET' })
  .inputValidator(z.string())
  .handler(async ({ data: id }) => {
    const user = await requireAuth()
    const db = getDb()
    const [page] = await db
      .select()
      .from(pages)
      .where(and(eq(pages.id, id), eq(pages.userId, user.id)))
      .limit(1)

    if (!page) throw new Error('Page not found')
    return page as unknown as PageRenderData
  })

// 3. Get public page by slug (No Auth Required)
export const getPublicPage = createServerFn({ method: 'GET' })
  .inputValidator(z.string())
  .handler(async ({ data: slug }) => {
    const db = getDb()
    const [page] = await db
      .select()
      .from(pages)
      .where(eq(pages.slug, slug))
      .limit(1)

    if (!page) throw new Error('Page not found')
    return page as unknown as PageRenderData
  })

// 4. Create new page
export const createPage = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      title: z.string().min(1),
      theme: z.string().optional(),
    })
  )
  .handler(async ({ data }) => {
    const user = await requireAuth()
    const db = getDb()
    const slug = `${data.title.toLowerCase().replace(/\s+/g, '-')}-${Math.random().toString(36).substring(2, 7)}`

    const [newPage] = await db
      .insert(pages)
      .values({
        userId: user.id,
        title: data.title,
        slug,
        theme: data.theme || 'minimal',
        status: 'draft',
      })
      .returning()

    return newPage as unknown as PageRenderData
  })

// 5. Update page
export const updatePage = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      id: z.string(),
      updates: z.any(),
    })
  )
  .handler(async ({ data }) => {
    const user = await requireAuth()
    return await internalUpdatePage(data.id, user.id, data.updates)
  })

// Internal update logic for modular re-use (AI Agent)
export async function internalUpdatePage(id: string, userId: string, updates: any) {
  const db = getDb()
  const [updated] = await db
    .update(pages)
    .set({
      ...updates,
      updatedAt: new Date(),
    })
    .where(and(eq(pages.id, id), eq(pages.userId, userId)))
    .returning()

  if (!updated) throw new Error('Failed to update page')
  return updated as unknown as PageRenderData
}

// 6. Duplicate page
export const duplicatePage = createServerFn({ method: 'POST' })
  .inputValidator(z.string())
  .handler(async ({ data: id }) => {
    const user = await requireAuth()
    const db = getDb()

    const [source] = await db
      .select()
      .from(pages)
      .where(and(eq(pages.id, id), eq(pages.userId, user.id)))
      .limit(1)

    if (!source) throw new Error('Source page not found')

    const [duplicated] = await db
      .insert(pages)
      .values({
        userId: user.id,
        title: `${source.title} (Copy)`,
        slug: `${source.slug}-copy-${Math.random().toString(36).substring(2, 5)}`,
        theme: source.theme,
        status: 'draft',
        heroSection: source.heroSection,
        featuresSection: source.featuresSection,
        gallerySection: source.gallerySection,
        contactSection: source.contactSection,
        sectionOrder: source.sectionOrder,
      })
      .returning()

    return duplicated as unknown as PageRenderData
  })

// 7. Publish/Unpublish page
export const publishPage = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      id: z.string(),
      publish: z.boolean(),
    })
  )
  .handler(async ({ data }) => {
    const user = await requireAuth()
    const db = getDb()

    const [updated] = await db
      .update(pages)
      .set({
        status: data.publish ? 'published' : 'draft',
        publishedAt: data.publish ? new Date() : null,
      })
      .where(and(eq(pages.id, data.id), eq(pages.userId, user.id)))
      .returning()

    return updated as unknown as PageRenderData
  })
