import { eq } from 'drizzle-orm'
import { getDb } from '../../../db/index'
import { users, sessions, type User, type NewUser } from '../../../db/schema'

export class AuthRepository {
  async getUserByEmail(email: string): Promise<User | undefined> {
    const db = getDb()
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)
    return user
  }

  async createUser(data: NewUser): Promise<User> {
    const db = getDb()
    const [user] = await db
      .insert(users)
      .values(data)
      .returning()
    return user
  }

  async createSession(userId: string, refreshToken: string, expiresAt: Date) {
    const db = getDb()
    return await db.insert(sessions).values({
      userId,
      refreshToken,
      expiresAt,
    })
  }

  async deleteSession(refreshToken: string) {
    const db = getDb()
    return await db.delete(sessions).where(eq(sessions.refreshToken, refreshToken))
  }

  async getSessionByToken(refreshToken: string) {
    const db = getDb()
    const [session] = await db
      .select()
      .from(sessions)
      .where(eq(sessions.refreshToken, refreshToken))
      .limit(1)
    return session
  }
}
