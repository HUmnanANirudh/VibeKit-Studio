import { createFileRoute } from '@tanstack/react-router'
import { AuthController } from '#/features/auth/api/auth.controller'

const controller = new AuthController()

export const Route = createFileRoute('/api/auth/refresh')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        return controller.handleRefresh(request)
      },
    },
  },
})
