import { eq } from 'drizzle-orm'
import { getDb } from '../../../db/index'
import { users, sessions, type User, type NewUser } from '../../../db/schema'

export class AuthRepository {
  private db = getDb()

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)
    return user
  }

  async createUser(data: NewUser): Promise<User> {
    const [user] = await this.db
      .insert(users)
      .values(data)
      .returning()
    return user
  }

  async createSession(userId: string, refreshToken: string, expiresAt: Date) {
    return await this.db.insert(sessions).values({
      userId,
      refreshToken,
      expiresAt,
    })
  }
}
