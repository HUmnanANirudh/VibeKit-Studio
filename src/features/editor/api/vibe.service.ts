import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { useRef, useEffect, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { pageQueryOptions } from '#/lib/queries'
import type { PageRenderData as Page } from '#/types'

interface AssistantOptions {
  id: string;
  onUpdate: (page: Page) => void;
}

export type SendAssistantMessage = (
  text: string,
  options?: { model?: string; mode?: string; theme?: string }
) => void

export function useVibeAssistant({ id, onUpdate }: AssistantOptions) {
  const queryClient = useQueryClient()
  const processedToolCalls = useRef<Set<string>>(new Set())

  const chat = (useChat as any)({
    id, // Set a stable ID for the chat state
    transport: new DefaultChatTransport({
      api: `/api/assistant`,
    }),
  })

  const { messages, sendMessage: chatSendMessage, status, stop, error } = chat as any

  useEffect(() => {
    for (const message of messages) {
      const invocations = (message as any).toolInvocations;

      if (invocations && Array.isArray(invocations)) {
        for (const tool of invocations) {
          const isResult = tool.state === 'result';
          if (tool.toolName === 'updatePage' && isResult) {
            const callId = tool.toolCallId;
            if (callId && !processedToolCalls.current.has(callId)) {
              if (tool.result) {
                console.log('Applying AI update for page:', id);
                onUpdate(tool.result);
                queryClient.invalidateQueries({ queryKey: pageQueryOptions(id).queryKey });
                processedToolCalls.current.add(callId);
              }
            }
          }
        }
      }
    }
  }, [messages, id, onUpdate, queryClient]);

  const handleSendMessage: SendAssistantMessage = useCallback(
    async (text: string, options?: { model?: string; mode?: string; theme?: string }) => {
      console.log('Sending AI message via sendMessage:', { text, id, ...options });
      try {
        if (typeof chatSendMessage === 'function') {
          await chatSendMessage({ text }, {
            body: {
              id,
              model: options?.model,
              mode: options?.mode,
              theme: options?.theme,
            },
          });
        } else {
          console.error('sendMessage is not a function!', typeof chatSendMessage);
        }
      } catch (err: any) {
        console.error('Failed to send AI message:', err.message, err.stack, err);
      }
    },
    [chatSendMessage, id]
  );

  return {
    messages,
    sendMessage: handleSendMessage,
    status,
    stop,
    error,
  }
}