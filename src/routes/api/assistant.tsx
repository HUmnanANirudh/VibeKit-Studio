import { createFileRoute } from '@tanstack/react-router'
import { streamText, convertToModelMessages } from 'ai'
import { vibeAgent } from '#/lib/ai/vibe-assistant'
import { getSessionUser } from '#/lib/session.server'
import { internalUpdatePage } from '#/lib/pages.functions'
import { openrouter } from '#/lib/ai/openrouter'

export const Route = createFileRoute('/api/assistant')({
  server: {
    handlers: {
      GET: async () => {
        return new Response(JSON.stringify({ status: 'ok', service: 'assistant' }), {
          headers: { 'Content-Type': 'application/json' },
        });
      },
      POST: async ({ request }) => {
        console.log('--- AI Assistant Request Start ---');
        const user = await getSessionUser(request)
        if (!user) {
          console.warn('Unauthorized AI request');
          return new Response('Unauthorized', { status: 401 });
        }

        const { messages, id, model, theme } = await request.json()
        console.log('AI Assistant Params:', { id, model, theme, messageCount: messages?.length });

        if (!id) return new Response('Missing id', { status: 400 })

        const result = streamText({
          ...vibeAgent,
          model: model ? openrouter(model) : vibeAgent.model,
          messages: await convertToModelMessages(messages),
          tools: {
            ...vibeAgent.tools,
            updatePage: {
              ...(vibeAgent.tools as any).updatePage,
              execute: async (args: any) => {
                console.log('API Executing updatePage for user:', user.id);
                return await internalUpdatePage(args.id, user.id, {
                  themeTokens: args.themeTokens || {},
                  content: args.content,
                  interactions: args.interactions || {},
                });
              }
            },
          },
          system: `${vibeAgent.system}\n\nCURRENT CONTEXT:\nWebsite ID: ${id}${theme ? `\nTheme Preference: ${theme}` : ''}`,
        })

        console.log('--- AI Assistant Request Streaming ---');
        return (result as any).toUIMessageStreamResponse({
          onError: (error: any) => {
            console.error('AI Streaming Error:', error);
            return error instanceof Error ? error.message : String(error);
          },
        })
      },
    },
  },
})
