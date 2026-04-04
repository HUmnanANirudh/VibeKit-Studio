import { useCallback, useState } from 'react'
import { AlertCircle, ChevronDown, Loader2, Palette, Sparkles } from 'lucide-react'
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from '#/components/ai-elements/conversation'
import type { SendAssistantMessage } from '../api/vibe.service'
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
import {
  ModelSelector,
  ModelSelectorContent,
  ModelSelectorGroup,
  ModelSelectorInput,
  ModelSelectorItem,
  ModelSelectorList,
  ModelSelectorLogo,
  ModelSelectorName,
  ModelSelectorTrigger,
} from '#/components/ai-elements/model-selector'
import { Button } from '#/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'


const MODELS = [
  'openrouter/auto',
  'stepfun/step-3.5-flash:free',
  'nvidia/nemotron-3-super-120b-a12b:free',
  'arcee-ai/trinity-large-preview:free',
  'qwen/qwen3.6-plus:free',
  'minimax/minimax-m2.5:free',
  'qwen/qwen3-coder:free',
  'qwen/qwen3-next-80b-a3b-instruct:free',
  'openai/gpt-oss-120b:free',
  'openai/gpt-oss-20b:free',
  'google/gemma-3-27b-it:free',
  'google/gemma-3-4b-it:free',
  'google/gemma-3n-e4b-it:free',
  'google/gemma-3n-e2b-it:free',
  'google/gemma-3-12b-it:free',
]

const THEMES = [
  'minimal',
  'neo-brutal',
  'dark-neon',
  'pastel-soft',
  'luxury-serif',
  'retro-pixel',
]

interface AIPanelProps {
  messages: any[]
  sendMessage: SendAssistantMessage
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
  const [selectedModel, setSelectedModel] = useState('openrouter/auto')
  const [selectedTheme, setSelectedTheme] = useState('minimal')

  const handleSendMessage = useCallback(
    (promptMessage: any) => {
      const text = typeof promptMessage === 'string' ? promptMessage : promptMessage.text
      if (!text || status === 'streaming') return
      sendMessage(text, { model: selectedModel, theme: selectedTheme })
    },
    [sendMessage, status, selectedModel, selectedTheme],
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
          <div className="flex items-center gap-2">
            <ModelSelector>
              <ModelSelectorTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 flex-1 gap-2 rounded-lg px-3 text-[10px] font-bold uppercase tracking-wider">
                  <ModelSelectorLogo provider={selectedModel.includes('/') ? selectedModel.split('/')[0] : 'openrouter'} className="size-3" />
                  <ModelSelectorName className="max-w-[100px] text-left">{selectedModel.includes('/') ? selectedModel.split('/')[1] : selectedModel}</ModelSelectorName>
                  <ChevronDown className="size-3 opacity-50" />
                </Button>
              </ModelSelectorTrigger>
              <ModelSelectorContent className="w-[320px]">
                <ModelSelectorInput placeholder="Search models..." />
                <ModelSelectorList className="max-h-[300px]">
                  <ModelSelectorGroup heading="Models">
                    {MODELS.map((model) => (
                      <ModelSelectorItem key={model} onSelect={() => setSelectedModel(model)}>
                        <ModelSelectorLogo provider={model.includes('/') ? model.split('/')[0] : 'openrouter'} />
                        <ModelSelectorName>{model}</ModelSelectorName>
                      </ModelSelectorItem>
                    ))}
                  </ModelSelectorGroup>
                </ModelSelectorList>
              </ModelSelectorContent>
            </ModelSelector>

            <Select value={selectedTheme} onValueChange={setSelectedTheme}>
              <SelectTrigger size="sm" className="h-8 flex-1 gap-2 rounded-lg px-3 text-[10px] font-bold uppercase tracking-wider">
                <Palette className="size-3" />
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                {THEMES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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
