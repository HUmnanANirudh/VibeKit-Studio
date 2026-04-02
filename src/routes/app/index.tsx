import { createFileRoute } from '@tanstack/react-router'
import { pagesQueryOptions } from '#/lib/queries'
import { Dashboard } from '#/features/dashboard/components/Dashboard'

export const Route = createFileRoute('/app/')({
  component: Dashboard,
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(pagesQueryOptions),
})
