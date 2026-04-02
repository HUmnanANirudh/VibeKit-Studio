import type { Context, Config } from '@netlify/functions'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { users } from '../../db/schema'
import { eq } from 'drizzle-orm'

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

export default async function handler(req: Request, context: Context) {
  const path = new URL(req.url).pathname

  // ================================
  // POST /api/auth/signup
  // ================================
  if (path.endsWith('/signup') && req.method === 'POST') {
    try {
      const { name, email, password } = await req.json()
      if (!name || !email || !password) {
        return jsonResponse(
          { error: 'Name, email, and password are required.' },
          400,
        )
      }
      if (password.length < 8) {
        return jsonResponse(
          { error: 'Password must be at least 8 characters.' },
          400,
        )
      }

      const db = getDb()
      const existing = await db
        .select()
        .from(users)
        .where(eq(users.email, email.toLowerCase()))
        .limit(1)
      if (existing.length > 0) {
        return jsonResponse({ error: 'Email already registered.' }, 400)
      }

      const passwordHash = await bcrypt.hash(password, 12)
      const [user] = await db
        .insert(users)
        .values({
          name: name.trim(),
          email: email.toLowerCase().trim(),
          passwordHash,
        })
        .returning()

      const JWT_SECRET = Netlify.env.get('JWT_SECRET')!
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '30d' },
      )

      return jsonResponse(
        { token, user: { id: user.id, name: user.name, email: user.email } },
        201,
      )
    } catch (err) {
      console.error('Signup error:', err)
      return jsonResponse({ error: 'Internal server error.' }, 500)
    }
  }

  // ================================
  // POST /api/auth/login
  // ================================
  if (path.endsWith('/login') && req.method === 'POST') {
    try {
      const { email, password } = await req.json()
      if (!email || !password) {
        return jsonResponse({ error: 'Email and password are required.' }, 400)
      }

      const db = getDb()
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email.toLowerCase()))
        .limit(1)
      if (!user) {
        return jsonResponse({ error: 'Invalid email or password.' }, 401)
      }

      const validPassword = await bcrypt.compare(password, user.passwordHash)
      if (!validPassword) {
        return jsonResponse({ error: 'Invalid email or password.' }, 401)
      }

      const JWT_SECRET = Netlify.env.get('JWT_SECRET')!
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '30d' },
      )

      return jsonResponse({
        token,
        user: { id: user.id, name: user.name, email: user.email },
      })
    } catch (err) {
      console.error('Login error:', err)
      return jsonResponse({ error: 'Internal server error.' }, 500)
    }
  }

  // ================================
  // POST /api/auth/logout
  // ================================
  if (path.endsWith('/logout') && req.method === 'POST') {
    return jsonResponse({ message: 'Logged out.' })
  }

  return jsonResponse({ error: 'Not found.' }, 404)
}

export const config: Config = {
  path: ['/api/auth/signup', '/api/auth/login', '/api/auth/logout'],
}
