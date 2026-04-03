import { useState, useEffect, useRef, useMemo } from 'react'
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
} from 'lucide-react'
import type { PageRenderData as Page, EditorProps } from '#/types'
import { Puck } from '@puckeditor/core'
import '@puckeditor/core/puck.css'
import { config } from '../lib/puck-config'
import {
  toPuckData,
  fromPuckData,
} from '../lib/puck-bridge'

export function Editor({ id }: EditorProps) {
  const queryClient = useQueryClient()
  const { data: serverPage } = useSuspenseQuery(pageQueryOptions(id)) as { data: Page }

  const [page, setPage] = useState<Page>(serverPage)
  const [saveState, setSaveState] = useState<
    'idle' | 'saving' | 'saved' | 'error'
  >('idle')
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setPage(serverPage)
  }, [serverPage])

  const puckData = useMemo(() => toPuckData(page), [page])

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

  // const publishMutation = useMutation<Page, Error, boolean>({
  //   mutationFn: (publish) => 
  //     publishPage({ data: { id, publish } }),
  //   onSuccess: (data) =>
  //     queryClient.setQueryData(pageQueryOptions(id).queryKey, data),
  // })

  const handlePuckChange = (data: any) => {
    const updated = fromPuckData(data, page)
    setPage(updated)

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    setSaveState('saving')
    saveTimerRef.current = setTimeout(() => saveMutation.mutate(updated), 1500)
  }

  // const handleAssistantUpdate = (update: any) => {
  //   const updated = fromAssistantUpdate(update, page)
  //   setPage(updated)
  //   saveMutation.mutate(updated)
  // }

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
            <header className='flex'>
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
