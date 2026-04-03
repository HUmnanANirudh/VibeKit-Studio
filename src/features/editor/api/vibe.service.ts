import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { useRef, useEffect, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { pageQueryOptions } from '#/lib/queries'
import { transformAssistantUpdate } from '#/lib/ai/transformer'
import type { PageRenderData as Page } from '#/types'

interface AssistantOptions {
  id: string;
  onUpdate: (page: Page) => void;
}

export function useVibeAssistant({ id, onUpdate }: AssistantOptions) {
  const queryClient = useQueryClient()
  const processedToolCalls = useRef<Set<string>>(new Set())

  const { messages, sendMessage, status, stop, error } = useChat({
    transport: new DefaultChatTransport({ api: '/api/vibe-assistant' }),
    initialMessages: [],
  } as any) // Use any to bypass version mismatch linting in UseChatOptions

  useEffect(() => {
    for (const message of messages) {
       const toolInvocations = (message as any).toolInvocations;
       if (message.role === 'assistant' && toolInvocations) {
          for (const tool of toolInvocations) {
             if (tool.toolName === 'updatePage' && tool.state === 'result') {
                if (!processedToolCalls.current.has(tool.toolCallId)) {
                   const result = tool.result;
                   // Transform tool result into Page content
                   const data = transformAssistantUpdate(result);
                   onUpdate(data as any); 

                   // Sync Cache
                   queryClient.invalidateQueries({ queryKey: pageQueryOptions(id).queryKey });
                   processedToolCalls.current.add(tool.toolCallId);
                }
             }
          }
       }
    }
  }, [messages, id, onUpdate, queryClient]);

  const handleSendMessage = useCallback(
    (text: string) => sendMessage({ text }),
    [sendMessage]
  );

  return {
    messages,
    sendMessage: handleSendMessage,
    status,
    stop,
    error,
  }
}
