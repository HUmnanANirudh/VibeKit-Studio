import { useState } from 'react'
import { useNavigate, Link } from '@tanstack/react-router'
import {
  useSuspenseQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { pagesQueryOptions } from '#/lib/queries'
import { createPage, duplicatePage } from '#/lib/pages.functions'
import { PageCard } from './PageCard'
import { NewPageModal } from './NewPageModal'
import { Button } from '#/components/ui/button'
import {
  Plus,
  LogOut,
  Layout,
  Rocket,
  FileText,
  MousePointer2,
} from 'lucide-react'
import type { PageRenderData as Page, Theme } from '#/types'

export function Dashboard() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { data: pages = [] } = useSuspenseQuery(pagesQueryOptions) as { data: Page[] }
  const [showNewModal, setShowNewModal] = useState(false)

  const createMutation = useMutation<Page, Error, { title: string; theme: Theme }>({
    mutationFn: (data) => createPage({ data }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: pagesQueryOptions.queryKey })
      setShowNewModal(false)
      navigate({ to: '/app/pages/$id', params: { id: data.id } })
    },
  })

  const duplicateMutation = useMutation<Page, Error, string>({
    mutationFn: (id) => duplicatePage({ data: id }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: pagesQueryOptions.queryKey }),
  })

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await fetch('/api/auth/logout', { method: 'POST' })
    },
    onSuccess: () => {
      window.location.href = '/auth/login'
    },
  })

  const stats = [
    { label: 'Total Pages', value: pages.length, icon: Layout },
    {
      label: 'Published',
      value: pages.filter((p) => p.status === 'published').length,
      icon: Rocket,
    },
    {
      label: 'Drafts',
      value: pages.filter((p) => p.status === 'draft').length,
      icon: FileText,
    },
    {
      label: 'Total Views',
      value: pages.reduce((a, p) => a + (p.viewCount || 0), 0),
      icon: MousePointer2,
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50/50">
      <nav className="sticky top-0 z-10 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link
            to="/"
            className="text-xl font-black italic tracking-tighter text-slate-900"
          >
            VIBE<span className="text-primary italic">KIT</span>
          </Link>
          <div className="flex items-center gap-4">
            <Button size="sm" onClick={() => setShowNewModal(true)}>
              <Plus className="mr-2 h-4 w-4" /> New Page
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => logoutMutation.mutate()}
            >
              <LogOut className="mr-2 h-4 w-4" />{' '}
              {logoutMutation.isPending ? '...' : 'Log out'}
            </Button>
          </div>
        </div>
      </nav>

      <main className="container py-8 px-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-4 rounded-xl border bg-white p-6 shadow-sm"
            >
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <s.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {s.label}
                </p>
                <p className="text-2xl font-bold">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Your Pages</h2>
          <Button variant="outline" onClick={() => setShowNewModal(true)}>
            <Plus className="mr-2 h-4 w-4" /> Create
          </Button>
        </div>

        {pages.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed p-12 text-center bg-white shadow-sm mt-8">
            <Layout className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
            <h3 className="text-lg font-semibold">No pages yet</h3>
            <p className="text-muted-foreground mb-6">
              Start building your first themed page.
            </p>
            <Button onClick={() => setShowNewModal(true)}>
              Generate my first page
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pages.map((page) => (
              <PageCard
                key={page.id}
                page={page}
                onDuplicate={(id) => duplicateMutation.mutate(id)}
                isDuplicating={
                  duplicateMutation.isPending &&
                  duplicateMutation.variables === page.id
                }
              />
            ))}
          </div>
        )}
      </main>

      <NewPageModal
        open={showNewModal}
        onOpenChange={setShowNewModal}
        onCreate={(title, theme) => createMutation.mutate({ title, theme })}
        isPending={createMutation.isPending}
      />
    </div>
  )
}
