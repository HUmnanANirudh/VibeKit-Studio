import bcrypt from 'bcryptjs'
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from '../../../lib/auth'
import { AuthRepository } from './auth.repository'

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000

export class AuthService {
  private repository = new AuthRepository()

  async login(email: string, password: string) {
    const user = await this.repository.getUserByEmail(email)

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new Error('Invalid credentials')
    }

    const { accessToken, refreshToken } = await this.createTokensAndSession(
      user.id,
      user.email,
    )

    return {
      user: { id: user.id, email: user.email, name: user.name },
      accessToken,
      refreshToken,
    }
  }

  async signup(email: string, password: string, name: string) {
    const passwordHash = await bcrypt.hash(password, 10)

    try {
      const user = await this.repository.createUser({
        email,
        passwordHash,
        name,
      })

      const { accessToken, refreshToken } = await this.createTokensAndSession(
        user.id,
        user.email,
      )

      return {
        user: { id: user.id, email: user.email, name: user.name },
        accessToken,
        refreshToken,
      }
    } catch (err: any) {
      const errorMsg = err.message || ''
      const errorCode = err.code || err.cause?.code || ''

      if (
        errorCode === '23505' ||
        errorMsg.includes('unique constraint') ||
        errorMsg.includes('already exists')
      ) {
        throw new Error('User already exists')
      }
      throw err
    }
  }

  async logout(refreshToken: string) {
    await this.repository.deleteSession(refreshToken)
  }

  async refreshTokens(oldRefreshToken: string) {
    // 1. Verify token
    const payload = await verifyToken(oldRefreshToken)
    if (!payload) {
      throw new Error('Invalid refresh token')
    }

    // 2. Check if session exists in DB
    const session = await this.repository.getSessionByToken(oldRefreshToken)
    if (!session || session.expiresAt < new Date()) {
      if (session) await this.repository.deleteSession(oldRefreshToken)
      throw new Error('Session expired or invalid')
    }

    // 3. Delete old session (Rotation)
    await this.repository.deleteSession(oldRefreshToken)

    // 4. Create new tokens and session
    return await this.createTokensAndSession(session.userId, payload.email)
  }

  private async createTokensAndSession(userId: string, email: string) {
    const accessToken = generateAccessToken({ userId, email })
    const refreshToken = generateRefreshToken(userId)

    await this.repository.createSession(
      userId,
      refreshToken,
      new Date(Date.now() + SEVEN_DAYS_MS),
    )

    return { accessToken, refreshToken, userId, email }
  }

  getSevenDaysMs() {
    return SEVEN_DAYS_MS
  }
}
