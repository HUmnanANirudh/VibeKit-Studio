import { useChat } from '@ai-sdk/react'
import { useRef, useEffect, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { pageQueryOptions } from '#/lib/queries'
import type { PageRenderData as Page } from '#/types'

interface AssistantOptions {
  id: string;
  onUpdate: (page: Page) => void;
}

export function useVibeAssistant({ id, onUpdate }: AssistantOptions) {
  const queryClient = useQueryClient()
  const processedToolCalls = useRef<Set<string>>(new Set())

  const { messages, append, status, stop, error } = (useChat as any)({
    api: `/api/vibe-assistant?id=${id}`,
    initialMessages: [],
  })

  useEffect(() => {
    for (const message of messages) {
      const invocations = (message as any).toolInvocations ||
        (message as any).parts?.filter((p: any) => p.type === 'tool-invocation' || p.type === 'tool-call')
          .map((p: any) => p.toolInvocation || p.toolCall);

      if (invocations && Array.isArray(invocations)) {
        for (const tool of invocations) {
          const isResult = tool.state === 'result' || tool.result !== undefined;
          if (tool.toolName === 'updatePage' && isResult) {
            const callId = tool.toolCallId || tool.id;
            if (callId && !processedToolCalls.current.has(callId)) {
              const result = tool.result;

              if (result) {
                onUpdate(result as any);
                queryClient.invalidateQueries({ queryKey: pageQueryOptions(id).queryKey });
                processedToolCalls.current.add(callId);
              }
            }
          }
        }
      }
    }
  }, [messages, id, onUpdate, queryClient]);

  const handleSendMessage = useCallback(
    (text: string) => append({ role: 'user', content: text }),
    [append]
  );

  return {
    messages,
    sendMessage: handleSendMessage,
    status,
    stop,
    error,
  }
}