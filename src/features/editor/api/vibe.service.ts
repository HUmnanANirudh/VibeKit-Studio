import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { useRef, useEffect, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { pageQueryOptions } from '#/lib/queries'
import type { PageRenderData as Page } from '#/types'

interface AssistantOptions {
  id: string
  onUpdate: (page: Page) => void
}

export type SendAssistantMessage = (
  text: string,
  options?: { model?: string; mode?: string; theme?: string },
) => void

export function useVibeAssistant({ id, onUpdate }: AssistantOptions) {
  const queryClient = useQueryClient()
  const processedToolCalls = useRef<Set<string>>(new Set())

  const chat = (useChat as any)({
    id, // Set a stable ID for the chat state
    api: `/api/assistant`,
    transport: new DefaultChatTransport({
      api: `/api/assistant`,
    }),
  })

  const {
    messages,
    sendMessage: chatSendMessage,
    status,
    stop,
    error,
  } = chat as any

  useEffect(() => {
    for (const message of messages) {
      // Check toolInvocations (legacy/compatibility)
      const invocations = (message as any).toolInvocations
      if (invocations && Array.isArray(invocations)) {
        for (const tool of invocations) {
          if (
            tool.toolName === 'updatePage' &&
            tool.state === 'result' &&
            tool.result
          ) {
            const callId = tool.toolCallId
            if (callId && !processedToolCalls.current.has(callId)) {
              console.log(
                'Applying AI update (via toolInvocations) for page:',
                id,
              )
              onUpdate(tool.result)
              queryClient.invalidateQueries({
                queryKey: pageQueryOptions(id).queryKey,
              })
              processedToolCalls.current.add(callId)
            }
          }
        }
      }

      // Check parts (modern AI SDK 5.0+)
      if (message.parts && Array.isArray(message.parts)) {
        for (const part of message.parts) {
          if (
            part.type === 'tool-updatePage' &&
            part.state === 'output-available' &&
            part.output
          ) {
            const callId = part.toolCallId
            if (callId && !processedToolCalls.current.has(callId)) {
              console.log('Applying AI update (via parts) for page:', id)
              onUpdate(part.output)
              queryClient.invalidateQueries({
                queryKey: pageQueryOptions(id).queryKey,
              })
              processedToolCalls.current.add(callId)
            }
          }
        }
      }
    }
  }, [messages, id, onUpdate, queryClient])

  const handleSendMessage: SendAssistantMessage = useCallback(
    async (
      text: string,
      options?: { model?: string; mode?: string; theme?: string },
    ) => {
      console.log('Sending AI message via sendMessage:', {
        text,
        id,
        ...options,
      })
      try {
        if (options?.theme) {
          // Optimistically update the UI and save to database instantly
          onUpdate({ themeTokens: { archetype: options.theme } } as any)
        }

        if (typeof chatSendMessage === 'function') {
          // Use the more explicit parts structure for maximum compatibility
          await chatSendMessage(
            {
              role: 'user',
              parts: [{ type: 'text', text }],
            },
            {
              body: {
                id,
                model: options?.model,
                mode: options?.mode,
                theme: options?.theme,
              },
            },
          )
        } else {
          console.error(
            'sendMessage is not a function!',
            typeof chatSendMessage,
          )
        }
      } catch (err: any) {
        console.error('Failed to send AI message:', err.message, err.stack, err)
      }
    },
    [chatSendMessage, id],
  )

  return {
    messages,
    sendMessage: handleSendMessage,
    status,
    stop,
    error,
  }
}
