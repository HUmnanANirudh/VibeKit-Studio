import { eq } from 'drizzle-orm'
import { getDb } from '../db/index'
import { users, sessions } from '../db/schema'
import { parseCookies, verifyToken } from './auth'

export async function getSessionUser(request: Request) {
  try {
    const cookies = parseCookies(request)
    const refreshToken = cookies.refreshToken
    
    if (!refreshToken) return null

    const payload = verifyToken(refreshToken)
    if (!payload || !payload.userId) return null

    const db = getDb()
    const [session] = await db
      .select()
      .from(sessions)
      .where(eq(sessions.refreshToken, refreshToken))
      .limit(1)

    if (!session || new Date(session.expiresAt).getTime() < Date.now()) return null

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, session.userId))
      .limit(1)

    if (!user) return null

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    }
  } catch (err) {
    console.error('Session user error:', err)
    return null
  }
}
