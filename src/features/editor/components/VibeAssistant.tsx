'use client'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import type { VibeAgentUIMessage } from '../lib/vibe-agent'
import {
  Conversation,
  ConversationContent,
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
  PromptInputTextarea,
  PromptInputSubmit,
} from '#/components/ai-elements/prompt-input'
import { Button } from '#/components/ui/button'
import { Sparkles, Wand2, X } from 'lucide-react'
import { useEffect, useRef } from 'react'

interface VibeAssistantProps {
  onUpdatePage: (data: any) => void
  onClose: () => void
}

export function VibeAssistant({ onUpdatePage, onClose }: VibeAssistantProps) {
  const { messages, sendMessage, status, stop } = useChat<VibeAgentUIMessage>({
    transport: new DefaultChatTransport({ api: '/api/vibe-assistant' }),
  })

  // Track processed tool call IDs to avoid duplicate updates
  const processedToolCalls = useRef<Set<string>>(new Set())

  // Watch messages for tool call results (reactive)
  useEffect(() => {
    for (const message of messages) {
      if (message.role === 'assistant') {
        for (const part of message.parts) {
          if (
            part.type === 'tool-updatePage' &&
            part.state === 'output-available'
          ) {
            if (!processedToolCalls.current.has(part.toolCallId)) {
              onUpdatePage(part.output)
              processedToolCalls.current.add(part.toolCallId)
            }
          }
        }
      }
    }
  }, [messages, onUpdatePage])

  const handleSubmit = (msg: { text: string }) => {
    sendMessage({ text: msg.text })
  }

  return (
    <div className="flex flex-col h-full bg-background border-l w-80 lg:w-96 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
            <Sparkles className="size-4 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-bold leading-none">Vibe Assistant</h2>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
              Gemini 2.0 Flash
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="rounded-full"
        >
          <X className="size-4" />
        </Button>
      </div>

      {/* Conversation Area */}
      <div className="flex-1 overflow-hidden relative font-sans">
        <Conversation>
          <ConversationContent>
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-8 mt-12">
                <div className="p-4 rounded-full bg-primary/5 mb-4 group-hover:bg-primary/10 transition-colors">
                  <Wand2 className="size-8 text-primary/40" />
                </div>
                <h3 className="text-sm font-semibold mb-1">How can I help?</h3>
                <p className="text-xs text-muted-foreground mb-6">
                  "Make me a brutalist portfolio for a coder"
                  <br />
                  "Add a dark-neon theme with a hero and gallery"
                </p>
                <div className="grid gap-2 w-full">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-[10px] h-8 justify-start font-medium bg-muted/20"
                    onClick={() =>
                      sendMessage({
                        text: 'Generate a minimal photography portfolio',
                      })
                    }
                  >
                    ✦ Photography landing page
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-[10px] h-8 justify-start font-medium bg-muted/20"
                    onClick={() =>
                      sendMessage({
                        text: 'Create a high-energy SaaS landing page with dark-neon theme',
                      })
                    }
                  >
                    ✦ SaaS dark-neon vibe
                  </Button>
                </div>
              </div>
            ) : (
              messages.map((m) => (
                <Message key={m.id} from={m.role}>
                  <MessageContent>
                    {m.parts.map((part, i) => {
                      if (part.type === 'text') {
                        return (
                          <MessageResponse key={i}>{part.text}</MessageResponse>
                        )
                      }
                      // We don't render tool parts in the UI for now,
                      // they just trigger the editor update.
                      return null
                    })}
                  </MessageContent>
                </Message>
              ))
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t bg-muted/10">
        <PromptInputProvider>
          <PromptInput onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2 w-full">
              <PromptInputTextarea
                placeholder="Type your vibe..."
                className="min-h-12 max-h-32 text-sm bg-transparent border-none focus-visible:ring-0 resize-none p-0"
              />
              <div className="flex justify-end">
                <PromptInputSubmit status={status} onStop={stop} />
              </div>
            </div>
          </PromptInput>
        </PromptInputProvider>
      </div>
    </div>
  )
}
