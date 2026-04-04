import { createFileRoute } from '@tanstack/react-router'
import { vibeAgent } from '#/lib/ai/vibe-assistant'
import { streamText } from 'ai'

export const Route = createFileRoute('/api/vibe-assistant')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')
        const model = searchParams.get('model')
        const theme = searchParams.get('theme')

        if (!id) return new Response('Missing id', { status: 400 })

        const result = streamText({
          ...vibeAgent,
          model: model ? (model as any) : vibeAgent.model,
          prompt: `Website ID: ${id}${theme ? `\nTheme Preference: ${theme}` : ''}`,
        })

        return result.toTextStreamResponse()
      },
    },
  },
})
