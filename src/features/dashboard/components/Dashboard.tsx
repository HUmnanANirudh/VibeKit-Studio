import { useState } from 'react'
import { useNavigate, Link } from '@tanstack/react-router'
import { useAuthMutations } from '#/features/auth/hooks/useAuthMutations'
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
  const { logoutMutation } = useAuthMutations()
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
      <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link
              to="/"
              className="text-xl font-black italic tracking-tighter text-slate-900 transition-opacity hover:opacity-80"
            >
              VIBEKIT<span className="italic"> STUDIO </span>
            </Link>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="h-9 rounded-full px-4 text-xs font-bold uppercase tracking-wider"
                onClick={() => logoutMutation.mutate()}
              >
                <LogOut className="mr-2 h-3.5 w-3.5" />
                {logoutMutation.isPending ? 'Signing out...' : 'Log out'}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-10 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 animate-fade-in-up">
          {stats.map((s, idx) => (
            <div
              key={s.label}
              className="group flex flex-col gap-4 rounded-2xl border bg-white p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className="rounded-xl bg-primary/10 p-2.5 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  <s.icon className="h-5 w-5" />
                </div>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
                  {s.label}
                </p>
                <p className="mt-1 text-3xl font-black tracking-tight">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-8 flex items-end justify-between border-b pb-6 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <div>
            <h2 className="text-3xl font-black tracking-tighter sm:text-4xl">Your Pages</h2>
          </div>
          <Button 
            onClick={() => setShowNewModal(true)}
            className="h-11 rounded-full px-6 text-xs font-bold uppercase tracking-widest shadow-lg shadow-primary/20 transition-transform active:scale-95"
          >
            <Plus className="mr-2 h-4 w-4" /> Create New
          </Button>
        </div>

        {pages.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed p-16 text-center bg-white shadow-sm mt-8 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
            <div className="rounded-2xl bg-slate-50 p-6 mb-6">
              <Layout className="h-12 w-12 text-muted-foreground opacity-30" />
            </div>
            <h3 className="text-xl font-bold tracking-tight">No pages found</h3>
            <p className="text-muted-foreground mb-8 max-w-sm">
              Ready to launch something beautiful? Start by building your first AI-themed page.
            </p>
            <Button 
              size="lg"
              onClick={() => setShowNewModal(true)}
              className="rounded-full px-8 text-xs font-bold uppercase tracking-widest shadow-xl shadow-primary/20"
            >
              Generate my first page
            </Button>
          </div>
        ) : (
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 animate-fade-in-up [animation-delay:0.6s] opacity-0 [animation-fill-mode:forwards]">
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
