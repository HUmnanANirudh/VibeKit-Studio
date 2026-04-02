import { useSuspenseQuery } from '@tanstack/react-query'
import { publicPageQueryOptions } from '#/lib/queries'
import { generatePublishedPageHTML } from '#/lib/page-renderer'

interface PublicPageProps {
  slug: string
}

export function PublicPage({ slug }: PublicPageProps) {
  const { data: page } = useSuspenseQuery(publicPageQueryOptions(slug))

  if (!page) return null

  return (
    <div className="min-h-screen bg-background">
      <iframe
        srcDoc={generatePublishedPageHTML(page)}
        className="w-full h-screen border-none block"
        title={page.title}
      />
    </div>
  )
}
