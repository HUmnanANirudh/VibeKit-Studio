import { useState, useEffect, useRef } from 'react'
import { Link } from '@tanstack/react-router'
import { useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { pageQueryOptions } from '#/lib/queries'
import { EditorSidebar } from './EditorSidebar'
import { LivePreview, type Viewport } from './LivePreview'
import { Button } from '#/components/ui/button'
import { 
  ChevronLeft, 
  Monitor, 
  Tablet, 
  Smartphone, 
  Rocket, 
  Eye, 
  CheckCircle2, 
  AlertCircle,
  Loader2 
} from 'lucide-react'
import type { PageRenderData } from '#/types'

interface EditorProps {
  id: string
}

export function Editor({ id }: EditorProps) {
  const queryClient = useQueryClient()
  const { data: serverPage } = useSuspenseQuery(pageQueryOptions(id))
  
  const [page, setPage] = useState<PageRenderData>(serverPage)
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [viewport, setViewport] = useState<Viewport>('desktop')
  const [activeSection, setActiveSection] = useState('hero')
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => { setPage(serverPage) }, [serverPage])

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
          Authorization: `Bearer ${token}` 
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
      const endpoint = publish ? `/api/pages/${id}/publish` : `/api/pages/${id}/unpublish`
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Publish failed')
      return res.json()
    },
    onSuccess: (data) => queryClient.setQueryData(pageQueryOptions(id).queryKey, data.page),
  })

  const updatePage = (updates: Partial<PageRenderData>) => {
    const updated = { ...page, ...updates }
    setPage(updated)
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    setSaveState('saving')
    saveTimerRef.current = setTimeout(() => saveMutation.mutate(updated), 1500)
  }

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...page.sectionOrder]
    const swapIdx = direction === 'up' ? index - 1 : index + 1
    if (swapIdx < 0 || swapIdx >= newOrder.length) return
    ;[newOrder[index], newOrder[swapIdx]] = [newOrder[swapIdx], newOrder[index]]
    updatePage({ sectionOrder: newOrder })
  }

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      <header className="h-14 border-b flex items-center justify-between px-4 bg-card shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/app"><ChevronLeft className="h-4 w-4 mr-1" /> Dashboard</Link>
          </Button>
          <div className="h-4 w-px bg-border" />
          <span className="text-sm font-semibold truncate max-w-[200px]">{page.title}</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 mr-4 text-xs font-medium">
            {saveState === 'saving' && <><Loader2 className="h-3 w-3 animate-spin" /> Saving...</>}
            {saveState === 'saved' && <><CheckCircle2 className="h-3 w-3 text-green-500" /> Saved</>}
            {saveState === 'error' && <><AlertCircle className="h-3 w-3 text-destructive" /> Error</>}
          </div>

          <div className="flex gap-1 bg-muted p-1 rounded-md">
            <Button variant={viewport === 'desktop' ? 'secondary' : 'ghost'} size="icon" className="h-7 w-7" onClick={() => setViewport('desktop')}><Monitor className="h-4 w-4" /></Button>
            <Button variant={viewport === 'tablet' ? 'secondary' : 'ghost'} size="icon" className="h-7 w-7" onClick={() => setViewport('tablet')}><Tablet className="h-4 w-4" /></Button>
            <Button variant={viewport === 'mobile' ? 'secondary' : 'ghost'} size="icon" className="h-7 w-7" onClick={() => setViewport('mobile')}><Smartphone className="h-4 w-4" /></Button>
          </div>

          <div className="mx-2 h-4 w-px bg-border" />
          
          {page.status === 'published' && <Button variant="outline" size="sm" asChild><a href={`/p/${page.slug}`} target="_blank" rel="noopener noreferrer"><Eye className="h-4 w-4 mr-2" /> View</a></Button>}
          <Button size="sm" onClick={() => publishMutation.mutate(page.status !== 'published')} disabled={publishMutation.isPending}>{publishMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Rocket className="h-4 w-4 mr-2" />{page.status === 'published' ? 'Unpublish' : 'Publish'}</>}</Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <EditorSidebar page={page} activeSection={activeSection} onUpdatePage={updatePage} onSetActiveSection={setActiveSection} onMoveSection={moveSection} />
        <LivePreview page={page} viewport={viewport} />
      </div>
    </div>
  )
}
