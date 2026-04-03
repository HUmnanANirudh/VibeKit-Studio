import { createFileRoute } from '@tanstack/react-router'
import { createAgentUIStreamResponse } from 'ai'
import { vibeAgent } from '#/lib/ai/vibe-assistant'
import { getSessionUser } from '#/lib/session.server'

export const Route = createFileRoute('/api/vibe-assistant')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const user = await getSessionUser(request)
        if (!user) return new Response('Unauthorized', { status: 401 })

        const { messages, id } = await request.json()

        return createAgentUIStreamResponse({
          agent: vibeAgent,
          uiMessages: [
            { role: 'system', content: `[CONTEXT] Page ID: ${id}, User ID: ${user.id}. You MUST use these IDs when calling the updatePage tool.` },
            ...messages
          ],
        })
      },
    },
  },
})
