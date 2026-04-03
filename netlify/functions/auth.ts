import { AuthController } from '../../src/features/auth/api/auth.controller'

const controller = new AuthController()

export default async (req: Request, _context: any) => {
  const url = new URL(req.url)
  const path = url.pathname

  if (req.method === 'POST') {
    if (path === '/api/auth/login' || path.endsWith('/login')) {
      return controller.handleLogin(req)
    }
    if (path === '/api/auth/signup' || path.endsWith('/signup')) {
      return controller.handleSignup(req)
    }
  }

  return new Response(JSON.stringify({ error: 'Not found' }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' },
  })
}

export const config: any = {
  path: ['/api/auth/login', '/api/auth/signup'],
}
