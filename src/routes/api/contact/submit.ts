import { createFileRoute } from '@tanstack/react-router'
import { submitContactForm } from '#/lib/pages.functions'

export const Route = createFileRoute('/api/contact/submit')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const data = await request.json()
          await submitContactForm({ data })
          return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' },
          })
        } catch (error) {
          console.error('Contact submit error:', error)
          return new Response('Internal Server Error', { status: 500 })
        }
      },
    },
  },
})
