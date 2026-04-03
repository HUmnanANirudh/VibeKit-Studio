import { createFileRoute } from '@tanstack/react-router'
import { createAgentUIStreamResponse } from 'ai'
import { vibeAgent } from '#/features/editor/lib/vibe-agent'
import { getSessionUser } from '#/lib/session.server'

export const Route = createFileRoute('/api/vibe-assistant')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const user = await getSessionUser(request)
        if (!user) return new Response('Unauthorized', { status: 401 })

        const { messages } = await request.json()

        return createAgentUIStreamResponse({
          agent: vibeAgent,
          uiMessages: messages,
        })
      },
    },
  },
})
