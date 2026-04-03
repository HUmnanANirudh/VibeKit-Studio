import { getCookieHeader } from '../../../lib/auth'
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
        this.service.getSevenDaysMs()
      )

      return jsonResponse(
        { user: result.user, accessToken: result.accessToken },
        200,
        { 'Set-Cookie': cookie }
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
        this.service.getSevenDaysMs()
      )

      return jsonResponse(
        { user: result.user, accessToken: result.accessToken },
        201,
        { 'Set-Cookie': cookie }
      )
    } catch (err: any) {
      if (err.message === 'User already exists') {
        return jsonResponse({ error: 'User already exists' }, 400)
      }
      console.error('Signup error:', err)
      return jsonResponse({ error: 'Signup failed' }, 500)
    }
  }
}
