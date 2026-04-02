import { createFileRoute } from '@tanstack/react-router'
import { publicPageQueryOptions } from '#/lib/queries'
import { PublicPage } from '#/features/public-page/components/PublicPage'

export const Route = createFileRoute('/p/$slug')({
  component: PublicPageRoute,
  loader: ({ context: { queryClient }, params: { slug } }) =>
    queryClient.ensureQueryData(publicPageQueryOptions(slug)),
})

function PublicPageRoute() {
  const { slug } = Route.useParams()
  return <PublicPage slug={slug} />
}
