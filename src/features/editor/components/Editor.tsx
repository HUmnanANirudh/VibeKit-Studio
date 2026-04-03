import { useState, useEffect, useRef, useMemo, useCallback, memo } from 'react'
import { Link } from '@tanstack/react-router'
import {
  useSuspenseQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { pageQueryOptions } from '#/lib/queries'
import { updatePage } from '#/lib/pages.functions'
import { Button } from '#/components/ui/button'
import {
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Wand2,
  PenLine,
} from 'lucide-react'
import type { PageRenderData as Page, EditorProps } from '#/types'
import { Puck, Render } from '@puckeditor/core'
import '@puckeditor/core/puck.css'
import { config } from '../lib/puck-config'
import { WebPreview, WebPreviewBody, WebPreviewNavigation, WebPreviewUrl } from '#/components/ai-elements/web-preview'
import { Conversation, ConversationContent, ConversationScrollButton } from '#/components/ai-elements/conversation'
import { Message, MessageContent, MessageResponse } from '#/components/ai-elements/message'
import { PromptInput, PromptInputSubmit, PromptInputTextarea, PromptInputProvider } from '#/components/ai-elements/prompt-input'
import { Suggestion, Suggestions } from '#/components/ai-elements/suggestion'
import { useVibeAssistant } from '../api/vibe.service'
import { Spinner } from '#/components/ui/spinner'
import { toPuckData, fromPuckData } from '../lib/puck-bridge'

interface SuggestionItemProps {
  text: string;
  onSuggestionClick: (text: string) => void;
}

const SuggestionItem = memo(
  ({ text, onSuggestionClick }: SuggestionItemProps) => {
    const handleClick = useCallback(
      () => onSuggestionClick(text),
      [onSuggestionClick, text]
    );
    return <Suggestion onClick={handleClick} suggestion={text} />;
  }
);
SuggestionItem.displayName = "SuggestionItem";

export function Editor({ id }: EditorProps) {
  const queryClient = useQueryClient()
  const { data: serverPage } = useSuspenseQuery(pageQueryOptions(id)) as { data: Page }

  const [page, setPage] = useState<Page>(serverPage)
  const [editorMode, setEditorMode] = useState<'chat' | 'edit'>('chat')
  const [saveState, setSaveState] = useState<
    'idle' | 'saving' | 'saved' | 'error'
  >('idle')
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setPage(serverPage)
  }, [serverPage])

  const puckData = useMemo(() => toPuckData(page), [page])
  const isEmpty = !puckData.content || puckData.content.length === 0

  const saveMutation = useMutation<Page, Error, Page>({
    mutationFn: (data) => 
      updatePage({ data: { id, updates: data } }),
    onSuccess: (data) => {
      queryClient.setQueryData(pageQueryOptions(id).queryKey, data)
      setSaveState('saved')
      setTimeout(() => setSaveState('idle'), 2000)
    },
    onError: () => setSaveState('error'),
  })

  const handlePuckChange = (data: any) => {
    const updated = fromPuckData(data, page)
    setPage(updated)

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    setSaveState('saving')
    saveTimerRef.current = setTimeout(() => saveMutation.mutate(updated), 1500)
  }

  const { messages, sendMessage, status, stop, error } = useVibeAssistant({
    id,
    onUpdate: setPage,
  })

  const [chatMessage, setChatMessage] = useState("")

  const handleSendMessage = useCallback(
    async (promptMessage: any) => {
      const hasText = Boolean(promptMessage.text);
      if (!hasText || status === 'streaming') return;
      sendMessage(promptMessage.text);
      setChatMessage("");
    },
    [sendMessage, status]
  );

  const handleSuggestionClick = useCallback((suggestion: string) => {
    sendMessage(suggestion);
  }, [sendMessage]);

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => setChatMessage(e.target.value),
    []
  );

  if (editorMode === 'chat') {
    return (
      <div className="flex size-full divide-x h-screen bg-background font-sans overflow-hidden">
        {/* Chat Panel */}
        <div className="flex flex-1 flex-col">
          <div className="flex-1 space-y-4 overflow-y-auto p-4 bg-muted/5 border-r border-border relative">
            {messages.length === 0 ? (
              <div className="mt-8 text-center font-semibold">
                <p className="mt-4 text-3xl font-[var(--heading-font)] tracking-tight">What vibe are we going for?</p>
              </div>
            ) : (
              <>
                <Conversation>
                  <ConversationContent>
                    {messages.map((m) => (
                      <Message from={m.role as any} key={m.id}>
                        <MessageContent>
                          {m.parts.map((p, i) => (
                            p.type === 'text' ? <MessageResponse key={i}>{p.text}</MessageResponse> : null
                          ))}
                        </MessageContent>
                      </Message>
                    ))}
                  </ConversationContent>
                </Conversation>
                {status === 'streaming' && (
                  <Message from="assistant">
                    <MessageContent>
                      <p className="flex items-center gap-2 text-sm text-muted-foreground animate-pulse">
                        <Spinner className="size-4" />
                        Generating your layout...
                      </p>
                    </MessageContent>
                  </Message>
                )}
                {error && (
                  <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md flex items-center gap-2 mt-4">
                    <AlertCircle className="size-4" />
                    <div className="flex-1">
                      <p className="font-semibold">Error communicating with AI Assistant</p>
                      <p className="text-xs opacity-80">{error.message}</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Input */}
          <div className="border-t p-4 bg-muted/10">
            {messages.length === 0 && (
              <Suggestions>
                <SuggestionItem
                  onSuggestionClick={handleSuggestionClick}
                  text="Create a dark brutalist SaaS template"
                />
                <SuggestionItem
                  onSuggestionClick={handleSuggestionClick}
                  text="Make a luxurious, soft pastel portfolio"
                />
                <SuggestionItem
                  onSuggestionClick={handleSuggestionClick}
                  text="Build an aggressive neon-themed startup landing page"
                />
              </Suggestions>
            )}
            <div className="flex gap-2 w-full max-w-2xl mx-auto">
              <PromptInputProvider>
                <PromptInput
                  className="relative w-full"
                  onSubmit={handleSendMessage}
                >
                  <PromptInputTextarea
                    className="min-h-[60px] pr-12 focus-visible:ring-1 bg-background"
                    onChange={handleTextChange}
                    value={chatMessage}
                    placeholder="Describe your design..."
                  />
                  <PromptInputSubmit
                    className="absolute right-2 bottom-2"
                    disabled={!chatMessage || status === 'streaming'}
                    status={status === 'streaming' ? "streaming" : "ready"}
                    onStop={stop}
                  />
                </PromptInput>
              </PromptInputProvider>
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="flex flex-1 flex-col relative bg-muted/5 z-0">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center flex-1 text-muted-foreground/40 gap-4">
               <Wand2 className="size-16 opacity-20" />
               <p className="text-sm font-medium">Your design will stream here in real-time</p>
            </div>
          ) : (
            <WebPreview className="rounded-none border-0 h-full w-full">
              <WebPreviewNavigation className="justify-between items-center h-14 bg-background">
                <WebPreviewUrl
                  className="max-w-[400px] h-8 text-xs font-mono bg-muted/20"
                  value={`https://preview.themely.co/page/${id}`}
                  readOnly
                />
                <Button onClick={() => setEditorMode('edit')} className="gap-2 shadow-sm mr-2 h-8" size="sm" variant="default">
                  <PenLine className="size-[14px]" /> Edit Blocks
                </Button>
              </WebPreviewNavigation>
              <WebPreviewBody className="h-full bg-[var(--bg)]">
                <div className="h-full w-full overflow-auto">
                  <Render config={config as any} data={puckData} />
                </div>
              </WebPreviewBody>
            </WebPreview>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-background flex flex-col font-sans overflow-hidden">
      <Puck
        config={config as any}
        data={puckData}
        onChange={handlePuckChange}
        headerTitle={page.title}
        headerPath="/app"
        initialHistory={{
          histories: [{ state: { data: puckData } }],
          index: 0,
          appendData: true,
        }}
        overrides={{
          header: ({ children }) => (
            <header className="flex">
              <div className="flex items-center">
                <Button variant="ghost" size="sm" asChild className="h-8">
                  <Link to="/app">
                    <ChevronLeft className="h-4 w-4 mr-1" /> Dashboard
                  </Link>
                </Button>
              </div>
              {children}
            </header>
          ),
          headerActions: ({ children }) => (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 mr-4 text-[10px] font-medium uppercase tracking-tighter opacity-70">
                {saveState === 'saving' && (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" /> Saving
                  </>
                )}
                {saveState === 'saved' && (
                  <>
                    <CheckCircle2 className="h-3 w-3 text-green-500" /> Synced
                  </>
                )}
                {saveState === 'error' && (
                  <>
                    <AlertCircle className="h-3 w-3 text-destructive" /> Error
                  </>
                )}
              </div>
              <Button variant="outline" size="sm" onClick={() => setEditorMode('chat')} className="gap-2 mr-2">
                <Wand2 className="size-4" /> AI Chat
              </Button>
              {children}
            </div>
          ),
        }}
      >
        <div className="flex-1 flex overflow-hidden relative">
          <div className="flex-1 flex flex-col min-w-0">
            <Puck.Layout />
          </div>
        </div>
      </Puck>
    </div>
  )
}

