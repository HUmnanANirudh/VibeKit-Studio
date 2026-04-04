import { useCallback } from 'react'
import { AlertCircle, Loader2, Sparkles } from 'lucide-react'
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from '#/components/ai-elements/conversation'
import {
  Message,
  MessageContent,
  MessageResponse,
} from '#/components/ai-elements/message'
import {
  PromptInput,
  PromptInputProvider,
  PromptInputSubmit,
  PromptInputTextarea,
} from '#/components/ai-elements/prompt-input'
import { Suggestions, Suggestion } from '#/components/ai-elements/suggestion'

interface AIPanelProps {
  messages: any[]
  sendMessage: (text: string) => void
  status: 'idle' | 'streaming' | 'submitting' | 'ready'
  stop: () => void
  error?: Error | null
}

export function AIPanel({
  messages = [],
  sendMessage,
  status,
  stop,
  error,
}: AIPanelProps) {
  const handleSendMessage = useCallback(
    (promptMessage: any) => {
      const text = typeof promptMessage === 'string' ? promptMessage : promptMessage.text
      if (!text || status === 'streaming') return
      sendMessage(text)
    },
    [sendMessage, status],
  )

  const isGenerating = status === 'streaming' || status === 'submitting'

  return (
    <PromptInputProvider>
      <div className="flex size-full flex-col bg-background">
        <Conversation className="flex-1">
          <ConversationContent>
            {messages.length === 0 ? (
              <ConversationEmptyState
                icon={<Sparkles className="size-8 text-accent animate-pulse" />}
                title="Design Assistant"
                description="Describe the website you want to build and let AI handle the layout and styling."
              />
            ) : (
              messages.map((m, idx) => (
                <Message from={m.role} key={m.id || idx}>
                  <MessageContent>
                    {m.parts ? (
                      m.parts.map((p: any, i: number) => {
                        if (p.type === 'text')
                          return (
                            <MessageResponse key={i}>{p.text}</MessageResponse>
                          )
                        return null
                      })
                    ) : typeof m.content === 'string' ? (
                      <MessageResponse>{m.content}</MessageResponse>
                    ) : null}
                  </MessageContent>
                </Message>
              ))
            )}

            {isGenerating && (
              <Message from="assistant">
                <MessageContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground animate-pulse">
                    <Loader2 className="size-4 animate-spin" />
                    Generating your design...
                  </div>
                </MessageContent>
              </Message>
            )}

            {error && (
              <div className="flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-destructive animate-in shake-in duration-500">
                <AlertCircle className="size-5 shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-bold">Generation failed</p>
                  <p className="text-xs opacity-80">{error.message}</p>
                </div>
              </div>
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <div className="shrink-0 space-y-4 border-t bg-muted/5 p-4 transition-all">
          {messages.length === 0 && (
            <Suggestions className="no-scrollbar justify-start">
              <Suggestion
                onClick={(text: string) => sendMessage(text)}
                suggestion="A modern landing page for a coffee shop"
              />
              <Suggestion
                onClick={(text: string) => sendMessage(text)}
                suggestion="A real estate listing page with a grid"
              />
              <Suggestion
                onClick={(text: string) => sendMessage(text)}
                suggestion="A sleek SaaS pricing section"
              />
            </Suggestions>
          )}

          <PromptInput onSubmit={handleSendMessage} className="relative">
            <PromptInputTextarea
              className="min-h-[80px] bg-background pr-12 focus-visible:ring-1"
              placeholder="Describe your design..."
            />
            <PromptInputSubmit
              className="absolute right-1 bottom-1"
              disabled={isGenerating}
              onStop={stop}
              status={isGenerating ? 'streaming' : 'ready'}
            />
          </PromptInput>
        </div>
      </div>
    </PromptInputProvider>
  )
}
