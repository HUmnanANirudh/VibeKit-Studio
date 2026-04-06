import {
  getCookieHeader,
  parseCookies,
  getClearCookieHeader,
} from '../../../lib/auth'
import { jsonResponse } from '../../../lib/utils'
import { AuthService } from './auth.service'

export class AuthController {
  private service = new AuthService()

  async handleLogin(req: Request) {
    try {
      const { email, password } = await req.json()
      const result = await this.service.login(email, password)

      const cookie = getCookieHeader(
        'refreshToken',
        result.refreshToken,
        this.service.getSevenDaysMs(),
      )

      return jsonResponse(
        { user: result.user, accessToken: result.accessToken },
        200,
        { 'Set-Cookie': cookie },
      )
    } catch (err: any) {
      if (err.message === 'Invalid credentials') {
        return jsonResponse({ error: 'Invalid credentials' }, 401)
      }
      console.error('Login error:', err)
      return jsonResponse({ error: 'Login failed' }, 500)
    }
  }

  async handleSignup(req: Request) {
    try {
      const { email, password, name } = await req.json()
      const result = await this.service.signup(email, password, name)

      const cookie = getCookieHeader(
        'refreshToken',
        result.refreshToken,
        this.service.getSevenDaysMs(),
      )

      return jsonResponse(
        { user: result.user, accessToken: result.accessToken },
        201,
        { 'Set-Cookie': cookie },
      )
    } catch (err: any) {
      if (err.message === 'User already exists') {
        return jsonResponse({ error: 'User already exists' }, 400)
      }
      console.error('Signup error:', err)
      return jsonResponse({ error: 'Signup failed' }, 500)
    }
  }

  async handleLogout(req: Request) {
    const cookies = parseCookies(req)
    const refreshToken = cookies.refreshToken as string | undefined

    if (refreshToken) {
      await this.service.logout(refreshToken)
    }

    const clearCookie = getClearCookieHeader('refreshToken')
    return jsonResponse({ message: 'Logged out' }, 200, {
      'Set-Cookie': clearCookie,
    })
  }

  async handleRefresh(req: Request) {
    try {
      const cookies = parseCookies(req)
      const oldRefreshToken = cookies.refreshToken as string | undefined

      if (!oldRefreshToken) {
        return jsonResponse({ error: 'No refresh token' }, 401)
      }

      const result = await this.service.refreshTokens(oldRefreshToken)

      const cookie = getCookieHeader(
        'refreshToken',
        result.refreshToken,
        this.service.getSevenDaysMs(),
      )

      return jsonResponse(
        {
          accessToken: result.accessToken,
          user: { id: result.userId, email: result.email },
        },
        200,
        { 'Set-Cookie': cookie },
      )
    } catch (err: any) {
      console.error('Refresh error:', err)
      const clearCookie = getClearCookieHeader('refreshToken')
      return jsonResponse({ error: 'Invalid session' }, 401, {
        'Set-Cookie': clearCookie,
      })
    }
  }
}
