import { queryOptions } from '@tanstack/react-query'
import { getPages, getPage, getPublicPage } from './pages.functions'
export const pagesQueryOptions = queryOptions({
  queryKey: ['pages'] as const,
  queryFn: () => getPages(),
})

export const pageQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ['pages', id] as const,
    queryFn: () => getPage({ data: id }),
    enabled: !!id,
  })

export const publicPageQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ['public', 'pages', slug] as const,
    queryFn: () => getPublicPage({ data: slug }),
    enabled: !!slug,
  })
