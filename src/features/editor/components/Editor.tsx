import { useState, useEffect, useRef } from 'react'
import { Link } from '@tanstack/react-router'
import {
  useSuspenseQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { ChevronLeft, Loader2, PanelLeftClose, PanelLeftOpen } from 'lucide-react'

import { pageQueryOptions } from '#/lib/queries'
import { updatePage } from '#/lib/pages.functions'
import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
import { cn } from '#/lib/utils'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '#/components/ui/resizable'
import { generatePublishedPageHTML } from '#/lib/page-renderer'
import { AIPanel } from './AIPanel'
import { useVibeAssistant } from '../api/vibe.service'
import type { PanelImperativeHandle } from 'react-resizable-panels'
import type { PageRenderData as Page, EditorProps } from '#/types'

export function Editor({ id }: EditorProps) {
  const queryClient = useQueryClient()
  const { data: serverPage } = useSuspenseQuery(pageQueryOptions(id)) as {
    data: Page
  }

  const [mounted, setMounted] = useState(false)
  const [page, setPage] = useState<Page>(serverPage)
  const [saveState, setSaveState] = useState<
    'idle' | 'saving' | 'saved' | 'error'
  >('idle')
  const [isAIPanelCollapsed, setIsAIPanelCollapsed] = useState(false)
  const aiPanelRef = useRef<PanelImperativeHandle>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (serverPage) {
      setPage(serverPage)
    }
  }, [serverPage])

  const saveMutation = useMutation<Page, Error, Partial<Page>>({
    mutationFn: (data) => updatePage({ data: { id, updates: data } }),
    onSuccess: (data) => {
      queryClient.setQueryData(pageQueryOptions(id).queryKey, data)
      setSaveState('saved')
      setTimeout(() => setSaveState('idle'), 2000)
    },
    onMutate: () => setSaveState('saving'),
    onError: () => setSaveState('error'),
  })

  const { messages, sendMessage, status, stop, error } = useVibeAssistant({
    id,
    onUpdate: (updatedPage) => {
      setPage(updatedPage)
      saveMutation.mutate(updatedPage)
    },
  })

  const handlePublish = () => {
    const newStatus = page.status === 'published' ? 'draft' : 'published'
    setPage((prev) => ({ ...prev, status: newStatus }))
    saveMutation.mutate({ status: newStatus })
  }

  if (!mounted) return null

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background font-sans text-foreground selection:bg-accent/20">
      <header className="z-50 grid h-14 shrink-0 grid-cols-3 items-center border-b bg-background/80 px-6 backdrop-blur-xl">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="h-9 -ml-2 text-muted-foreground hover:text-foreground"
          >
            <Link to="/app">
              <ChevronLeft className="mr-1 size-4" /> Dashboard
            </Link>
          </Button>
          <div className="mx-2 h-4 w-px" />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              const panel = aiPanelRef.current
              if (!panel) return
              if (isAIPanelCollapsed) {
                panel.expand()
              } else {
                panel.collapse()
              }
            }}
          >
            {isAIPanelCollapsed ? (
              <PanelLeftOpen className="size-4" />
            ) : (
              <PanelLeftClose className="size-4" />
            )}
          </Button>
        </div>

        <div className="flex items-center justify-center gap-3">
          <span className="max-w-[200px] truncate text-sm font-bold">
            {page.title}
          </span>
          <Badge
            variant={page.status === 'published' ? 'default' : 'secondary'}
            className="text-[10px] uppercase font-bold tracking-wider"
          >
            {page.status}
          </Badge>
        </div>

        <div className="flex items-center justify-end gap-6">
          <div className="text-[10px] uppercase font-bold tracking-widest">
            {saveState === 'saving' && (
              <span className="animate-pulse text-muted-foreground">
                Saving...
              </span>
            )}
            {saveState === 'saved' && (
              <span className="text-green-500">All saved</span>
            )}
            {saveState === 'error' && (
              <span className="text-destructive">Save failed</span>
            )}
          </div>
          <Button
            size="sm"
            onClick={handlePublish}
            disabled={saveMutation.isPending}
            className={cn(
              'h-9 rounded-full px-6 text-[10px] font-bold uppercase tracking-widest transition-all',
              page.status === 'published'
                ? 'bg-amber-500 text-white hover:bg-amber-600'
                : 'bg-primary text-primary-foreground',
            )}
          >
            {saveMutation.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : page.status === 'published' ? (
              'Unpublish'
            ) : (
              'Go Live'
            )}
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel
            ref={aiPanelRef}
            defaultSize={400}
            minSize={200}
            maxSize={400}
            collapsible={true}
            collapsedSize={0}
            onResize={(size) => {
              setIsAIPanelCollapsed(size.asPercentage === 0)
            }}
          >
            <AIPanel
              messages={messages}
              sendMessage={sendMessage}
              status={status}
              stop={stop}
              error={error}
            />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={400}>
            <div className="relative size-full bg-muted/20 p-8 pt-4">
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage: 'radial-gradient(#000 1px, transparent 0)',
                  backgroundSize: '40px 40px',
                }}
              />
              <div className="flex size-full flex-col shadow-2xl">
                <iframe
                  srcDoc={generatePublishedPageHTML(page)}
                  className="size-full border-none"
                  title="Live Preview"
                />
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </div>
  )
}