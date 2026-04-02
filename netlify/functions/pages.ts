import type { Context, Config } from '@netlify/functions'
import jwt from 'jsonwebtoken'
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { pages } from '../../db/schema'
import { eq, and } from 'drizzle-orm'
import { nanoid } from 'nanoid'

function getDb() {
  const sql = neon(Netlify.env.get('DATABASE_URL')!)
  return drizzle(sql)
}

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function verifyAuth(req: Request): { userId: string } | null {
  const authHeader = req.headers.get('authorization') || req.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) return null
  try {
    const JWT_SECRET = Netlify.env.get('JWT_SECRET')!
    const token = authHeader.slice(7)
    return jwt.verify(token, JWT_SECRET) as { userId: string }
  } catch {
    return null
  }
}

function slugify(title: string): string {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .slice(0, 60) || nanoid(8)
  )
}

export default async function handler(req: Request, context: Context) {
  const url = new URL(req.url)
  const pathname = url.pathname

  const auth = verifyAuth(req)
  if (!auth) return jsonResponse({ error: 'Unauthorized.' }, 401)

  const db = getDb()

  // ========================
  // GET /api/pages — list user's pages
  // ========================
  if (pathname === '/api/pages' && req.method === 'GET') {
    try {
      const userPages = await db.select().from(pages).where(eq(pages.userId, auth.userId))
      return jsonResponse({ pages: userPages })
    } catch (err) {
      console.error(err)
      return jsonResponse({ error: 'Internal error.' }, 500)
    }
  }

  // ========================
  // POST /api/pages — create page
  // ========================
  if (pathname === '/api/pages' && req.method === 'POST') {
    try {
      const { title, theme = 'minimal' } = await req.json()
      if (!title?.trim()) return jsonResponse({ error: 'Title is required.' }, 400)

      let slug = slugify(title)
      const existing = await db.select({ slug: pages.slug }).from(pages).where(eq(pages.slug, slug)).limit(1)
      if (existing.length > 0) slug = `${slug}-${nanoid(4)}`

      const [page] = await db.insert(pages).values({
        userId: auth.userId,
        title: title.trim(),
        slug,
        theme,
      }).returning()

      return jsonResponse({ page }, 201)
    } catch (err) {
      console.error(err)
      return jsonResponse({ error: 'Internal error.' }, 500)
    }
  }

  // Extract page ID from path segments
  // /api/pages/:id  or  /api/pages/:id/publish  etc.
  const pagePathMatch = pathname.match(/^\/api\/pages\/([^/]+)(?:\/(.+))?$/)
  if (!pagePathMatch) return jsonResponse({ error: 'Not found.' }, 404)

  const pageId = pagePathMatch[1]
  const action = pagePathMatch[2] // 'publish' | 'unpublish' | 'duplicate' | undefined

  // ========================
  // GET /api/pages/:id
  // ========================
  if (!action && req.method === 'GET') {
    try {
      const [page] = await db.select().from(pages)
        .where(and(eq(pages.id, pageId), eq(pages.userId, auth.userId)))
        .limit(1)
      if (!page) return jsonResponse({ error: 'Page not found.' }, 404)
      return jsonResponse({ page })
    } catch {
      return jsonResponse({ error: 'Internal error.' }, 500)
    }
  }

  // ========================
  // PUT /api/pages/:id — update
  // ========================
  if (!action && req.method === 'PUT') {
    try {
      const body = await req.json()
      const allowed = ['title', 'heroSection', 'featuresSection', 'gallerySection', 'contactSection', 'sectionOrder', 'theme']
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updates: Record<string, any> = { updatedAt: new Date() }

      for (const key of allowed) {
        if (body[key] !== undefined) updates[key] = body[key]
      }

      if (body.slug) {
        const newSlug = body.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').slice(0, 60)
        const conflict = await db.select({ id: pages.id }).from(pages)
          .where(eq(pages.slug, newSlug)).limit(1)
        if (!conflict[0] || conflict[0].id === pageId) {
          updates.slug = newSlug
        }
      }

      const [updated] = await db.update(pages)
        .set(updates)
        .where(and(eq(pages.id, pageId), eq(pages.userId, auth.userId)))
        .returning()

      if (!updated) return jsonResponse({ error: 'Page not found.' }, 404)
      return jsonResponse({ page: updated })
    } catch (err) {
      console.error(err)
      return jsonResponse({ error: 'Internal error.' }, 500)
    }
  }

  // ========================
  // POST /api/pages/:id/publish
  // ========================
  if (action === 'publish' && req.method === 'POST') {
    try {
      const [updated] = await db.update(pages)
        .set({ status: 'published', publishedAt: new Date(), updatedAt: new Date() })
        .where(and(eq(pages.id, pageId), eq(pages.userId, auth.userId)))
        .returning()
      if (!updated) return jsonResponse({ error: 'Page not found.' }, 404)
      return jsonResponse({ page: updated })
    } catch {
      return jsonResponse({ error: 'Internal error.' }, 500)
    }
  }

  // ========================
  // POST /api/pages/:id/unpublish
  // ========================
  if (action === 'unpublish' && req.method === 'POST') {
    try {
      const [updated] = await db.update(pages)
        .set({ status: 'draft', updatedAt: new Date() })
        .where(and(eq(pages.id, pageId), eq(pages.userId, auth.userId)))
        .returning()
      if (!updated) return jsonResponse({ error: 'Page not found.' }, 404)
      return jsonResponse({ page: updated })
    } catch {
      return jsonResponse({ error: 'Internal error.' }, 500)
    }
  }

  // ========================
  // POST /api/pages/:id/duplicate
  // ========================
  if (action === 'duplicate' && req.method === 'POST') {
    try {
      const [original] = await db.select().from(pages)
        .where(and(eq(pages.id, pageId), eq(pages.userId, auth.userId)))
        .limit(1)
      if (!original) return jsonResponse({ error: 'Page not found.' }, 404)

      let slug = `${original.slug}-copy`
      const existing = await db.select({ slug: pages.slug }).from(pages).where(eq(pages.slug, slug)).limit(1)
      if (existing.length > 0) slug = `${original.slug}-${nanoid(4)}`

      const [copy] = await db.insert(pages).values({
        userId: auth.userId,
        title: `${original.title} (Copy)`,
        slug,
        theme: original.theme,
        status: 'draft',
        heroSection: original.heroSection as Record<string, unknown>,
        featuresSection: original.featuresSection as Record<string, unknown>[],
        gallerySection: original.gallerySection as Record<string, unknown>[],
        contactSection: original.contactSection as Record<string, unknown>,
        sectionOrder: original.sectionOrder as string[],
      }).returning()

      return jsonResponse({ page: copy }, 201)
    } catch (err) {
      console.error(err)
      return jsonResponse({ error: 'Internal error.' }, 500)
    }
  }

  return jsonResponse({ error: 'Not found.' }, 404)
}

export const config: Config = {
  path: [
    '/api/pages',
    '/api/pages/:id',
    '/api/pages/:id/publish',
    '/api/pages/:id/unpublish',
    '/api/pages/:id/duplicate',
  ],
}
