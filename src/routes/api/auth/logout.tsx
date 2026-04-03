import { createFileRoute } from '@tanstack/react-router'
import { AuthController } from '#/features/auth/api/auth.controller'

const controller = new AuthController()

export const Route = createFileRoute('/api/auth/logout')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        return controller.handleLogout(request)
      },
    },
  },
})
