import { createFileRoute } from '@tanstack/react-router'
import { createAgentUIStreamResponse } from 'ai'
import { vibeAgent } from '#/features/editor/lib/vibe-agent'

export const Route = createFileRoute('/api/vibe-assistant')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages } = await request.json()

        return createAgentUIStreamResponse({
          agent: vibeAgent,
          uiMessages: messages,
        })
      },
    },
  },
})
