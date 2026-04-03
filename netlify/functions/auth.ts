import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { getDb } from '../../src/db/index'
import { users, sessions } from '../../src/db/schema'
import {
  generateAccessToken,
  generateRefreshToken,
  getCookieHeader,
} from '../../src/lib/auth'

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000

function jsonResponse(data: any, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  })
}

export default async (req: Request, _context: any) => {
  const url = new URL(req.url)
  const path = url.pathname
  const db = getDb()

  // Handle Login
  if (req.method === 'POST' && (path === '/api/auth/login' || path.endsWith('/login'))) {
    try {
      const { email, password } = await req.json()
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1)

      if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
        return jsonResponse({ error: 'Invalid credentials' }, 401)
      }

      const accessToken = generateAccessToken({
        userId: user.id,
        email: user.email,
      })
      const refreshToken = generateRefreshToken(user.id)

      await db.insert(sessions).values({
        userId: user.id,
        refreshToken,
        expiresAt: new Date(Date.now() + SEVEN_DAYS_MS),
      })

      const cookie = getCookieHeader('refreshToken', refreshToken, SEVEN_DAYS_MS)

      return jsonResponse(
        { user: { id: user.id, email: user.email, name: user.name }, accessToken },
        200,
        { 'Set-Cookie': cookie }
      )
    } catch (err) {
      console.error('Login error:', err)
      return jsonResponse({ error: 'Login failed' }, 500)
    }
  }

  // Handle Signup
  if (req.method === 'POST' && (path === '/api/auth/signup' || path.endsWith('/signup'))) {
    try {
      const { email, password, name } = await req.json()
      const passwordHash = await bcrypt.hash(password, 10)

      const [user] = await db
        .insert(users)
        .values({ email, passwordHash, name })
        .returning()

      const accessToken = generateAccessToken({
        userId: user.id,
        email: user.email,
      })
      const refreshToken = generateRefreshToken(user.id)

      await db.insert(sessions).values({
        userId: user.id,
        refreshToken,
        expiresAt: new Date(Date.now() + SEVEN_DAYS_MS),
      })

      const cookie = getCookieHeader('refreshToken', refreshToken, SEVEN_DAYS_MS)

      return jsonResponse(
        { user: { id: user.id, email: user.email, name: user.name }, accessToken },
        201,
        { 'Set-Cookie': cookie }
      )
    } catch (err) {
      console.error('Signup error:', err)
      return jsonResponse({ error: 'Signup failed' }, 500)
    }
  }

  return jsonResponse({ error: 'Not found' }, 404)
}

export const config: any = {
  path: ['/api/auth/login', '/api/auth/signup'],
}
