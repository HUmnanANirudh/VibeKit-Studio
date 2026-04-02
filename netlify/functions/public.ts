import type { Context, Config } from '@netlify/functions'
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { pages, pageViews, contactSubmissions } from '../../db/schema'
import { eq, and, sql } from 'drizzle-orm'

function getDb() {
  const sqlClient = neon(Netlify.env.get('DATABASE_URL')!)
  return drizzle(sqlClient)
}

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default async function handler(req: Request, context: Context) {
  const url = new URL(req.url)
  const pathname = url.pathname

  // Match /api/public/pages/:slug[/action]
  const match = pathname.match(/^\/api\/public\/pages\/([^/]+)(?:\/(.+))?$/)
  if (!match) return jsonResponse({ error: 'Not found.' }, 404)

  const slug = match[1]
  const action = match[2] // 'view' | 'contact' | undefined

  const db = getDb()

  // ========================
  // GET /api/public/pages/:slug
  // ========================
  if (!action && req.method === 'GET') {
    try {
      const [page] = await db.select().from(pages)
        .where(and(eq(pages.slug, slug), eq(pages.status, 'published')))
        .limit(1)
      if (!page) return jsonResponse({ error: 'Page not found or not published.' }, 404)
      return jsonResponse({ page })
    } catch (err) {
      console.error(err)
      return jsonResponse({ error: 'Internal error.' }, 500)
    }
  }

  // ========================
  // POST /api/public/pages/:slug/view
  // ========================
  if (action === 'view' && req.method === 'POST') {
    try {
      const [page] = await db.select({ id: pages.id }).from(pages)
        .where(and(eq(pages.slug, slug), eq(pages.status, 'published')))
        .limit(1)
      if (!page) return jsonResponse({ error: 'Page not found.' }, 404)

      await db.update(pages)
        .set({ viewCount: sql`${pages.viewCount} + 1` })
        .where(eq(pages.id, page.id))

      await db.insert(pageViews).values({
        pageId: page.id,
        userAgent: req.headers.get('user-agent') || undefined,
        referer: req.headers.get('referer') || undefined,
      })

      return jsonResponse({ ok: true })
    } catch (err) {
      console.error(err)
      return jsonResponse({ error: 'Internal error.' }, 500)
    }
  }

  // ========================
  // POST /api/public/pages/:slug/contact
  // ========================
  if (action === 'contact' && req.method === 'POST') {
    try {
      const { name, email, message } = await req.json()

      if (!name?.trim()) return jsonResponse({ error: 'Name is required.' }, 400)
      if (!email?.trim() || !validateEmail(email)) return jsonResponse({ error: 'Valid email is required.' }, 400)
      if (!message?.trim() || message.length < 5) return jsonResponse({ error: 'Message must be at least 5 characters.' }, 400)
      if (message.length > 5000) return jsonResponse({ error: 'Message too long.' }, 400)

      const [page] = await db.select({ id: pages.id }).from(pages)
        .where(and(eq(pages.slug, slug), eq(pages.status, 'published')))
        .limit(1)
      if (!page) return jsonResponse({ error: 'Page not found.' }, 404)

      await db.insert(contactSubmissions).values({
        pageId: page.id,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        message: message.trim(),
      })

      return jsonResponse({ ok: true, message: 'Submission received.' }, 201)
    } catch (err) {
      console.error(err)
      return jsonResponse({ error: 'Internal error.' }, 500)
    }
  }

  return jsonResponse({ error: 'Not found.' }, 404)
}

export const config: Config = {
  path: [
    '/api/public/pages/:slug',
    '/api/public/pages/:slug/view',
    '/api/public/pages/:slug/contact',
  ],
}
