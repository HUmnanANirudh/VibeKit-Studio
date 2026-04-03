import jwt from 'jsonwebtoken'
import { serialize, parse } from 'cookie'

declare global {
  var Netlify: any
}

const JWT_SECRET = process.env.JWT_SECRET || 'vibekit-dev-default-secret-secure-123'
const ACCESS_TOKEN_EXPIRY = '15m'
const REFRESH_TOKEN_EXPIRY = '7d'

export interface AuthUser {
  userId: string
  email: string
}

export function generateAccessToken(payload: AuthUser) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY })
}

export function generateRefreshToken(userId: string) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY })
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthUser
  } catch (err) {
    return null
  }
}

export function getCookieHeader(name: string, value: string, maxAge: number) {
  return serialize(name, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge,
  })
}

export function getClearCookieHeader(name: string) {
  return serialize(name, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: -1,
  })
}

export function parseCookies(req: Request) {
  const cookieHeader = req.headers.get('cookie') || ''
  return parse(cookieHeader)
}
