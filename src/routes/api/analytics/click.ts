import { createFileRoute } from '@tanstack/react-router'
import { incrementViewCount } from '#/lib/pages.functions'

export const Route = createFileRoute('/api/analytics/click')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { id } = await request.json()
          if (!id) return new Response('Missing id', { status: 400 })
          
          await incrementViewCount({ data: id })
          return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' },
          })
        } catch (error) {
          console.error('Analytics error:', error)
          return new Response('Internal Server Error', { status: 500 })
        }
      },
    },
  },
})
