import { useState, useEffect, useRef, useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import {
  useSuspenseQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { pageQueryOptions } from '#/lib/queries'
import { Button } from '#/components/ui/button'
import {
  ChevronLeft,
  Rocket,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
} from 'lucide-react'
import type { PageRenderData } from '#/types'
import { Puck } from '@puckeditor/core'
import "@puckeditor/core/puck.css"
import { config } from '../lib/puck-config'
import { toPuckData, fromPuckData, fromAssistantUpdate } from '../lib/puck-bridge'
import { VibeAssistant } from './VibeAssistant'

interface EditorProps {
  id: string
}

export function Editor({ id }: EditorProps) {
  const queryClient = useQueryClient()
  const { data: serverPage } = useSuspenseQuery(pageQueryOptions(id))

  const [page, setPage] = useState<PageRenderData>(serverPage)
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [isAssistantOpen, setIsAssistantOpen] = useState(false)
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setPage(serverPage)
  }, [serverPage])

  const puckData = useMemo(() => toPuckData(page), [page])

  const saveMutation = useMutation({
    mutationFn: async (data: PageRenderData) => {
      const token = localStorage.getItem('vk-token')
      if (!token) {
        console.log('Mock save:', data)
        return { page: data }
      }
      const res = await fetch(`/api/pages/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Save failed')
      return res.json()
    },
    onSuccess: (data) => {
      queryClient.setQueryData(pageQueryOptions(id).queryKey, data.page)
      setSaveState('saved')
      setTimeout(() => setSaveState('idle'), 2000)
    },
    onError: () => setSaveState('error'),
  })

  const publishMutation = useMutation({
    mutationFn: async (publish: boolean) => {
      const token = localStorage.getItem('vk-token')
      if (!token) {
        console.log('Mock publish:', publish)
        return { page: { ...page, status: publish ? 'published' : 'draft' } }
      }
      const endpoint = publish
        ? `/api/pages/${id}/publish`
        : `/api/pages/${id}/unpublish`
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Publish failed')
      return res.json()
    },
    onSuccess: (data) =>
      queryClient.setQueryData(pageQueryOptions(id).queryKey, data.page),
  })

  const handlePuckChange = (data: any) => {
    const updated = fromPuckData(data, page)
    setPage(updated)
    
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    setSaveState('saving')
    saveTimerRef.current = setTimeout(() => saveMutation.mutate(updated), 1500)
  }

  const handleAssistantUpdate = (update: any) => {
    const updated = fromAssistantUpdate(update, page)
    setPage(updated)
    saveMutation.mutate(updated)
  }

  return (
    <div className="h-screen bg-background flex flex-col font-sans overflow-hidden">
      <Puck 
        config={config} 
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
            <header className="flex items-center justify-between w-full h-full px-4 bg-background">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild className="h-8">
                  <Link to="/app">
                    <ChevronLeft className="h-4 w-4 mr-1" /> Dashboard
                  </Link>
                </Button>
                <div className="h-4 w-px bg-border" />
                <span className="text-sm font-semibold truncate max-w-[200px]">
                  {page.title}
                </span>
              </div>
              <div className="flex-1" />
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

              <Button 
                variant={isAssistantOpen ? "secondary" : "outline"} 
                size="sm" 
                onClick={() => setIsAssistantOpen(!isAssistantOpen)}
                className="h-8 gap-2 font-bold bg-primary/5 hover:bg-primary/10 border-primary/20 text-primary"
              >
                <Sparkles className="h-4 w-4" />
                Vibe Assistant
              </Button>

              <div className="mx-2 h-4 w-px bg-border" />

              <Button
                size="sm"
                className="h-8"
                onClick={() => publishMutation.mutate(page.status !== 'published')}
                disabled={publishMutation.isPending}
              >
                {publishMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Rocket className="h-4 w-4 mr-2" />
                    {page.status === 'published' ? 'Unpublish' : 'Publish'}
                  </>
                )}
              </Button>
              {children}
            </div>
          )
        }}
      >
        <div className="flex-1 flex overflow-hidden relative">
          <div className="flex-1 flex flex-col min-w-0">
            <Puck.Layout />
          </div>
          
          {isAssistantOpen && (
            <div className="z-[100] absolute inset-y-0 right-0 lg:relative">
              <VibeAssistant 
                onUpdatePage={handleAssistantUpdate}
                onClose={() => setIsAssistantOpen(false)}
              />
            </div>
          )}
        </div>
      </Puck>
    </div>
  )
}
