import { queryOptions } from '@tanstack/react-query'
import type { PageRenderData } from '#/types'

// Helpers
function getAuthToken() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('vk-token')
}

// Fetchers
async function fetchPages(): Promise<PageRenderData[]> {
  const token = getAuthToken()
  if (!token)
    return [
      {
        id: 'mock-1',
        title: 'Project Alpha',
        slug: 'project-alpha',
        status: 'published',
        theme: 'neo-brutal',
        viewCount: 124,
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'mock-2',
        title: 'Vibe Landing',
        slug: 'vibe-landing',
        status: 'draft',
        theme: 'luxury',
        viewCount: 0,
        updatedAt: new Date().toISOString(),
      },
    ] as any[]

  const res = await fetch('/api/pages', {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!res.ok) {
    if (res.status === 401) throw new Error('Unauthorized')
    throw new Error('Failed to fetch pages')
  }

  const data = await res.json()
  return data.pages || []
}

async function fetchPage(id: string): Promise<PageRenderData> {
  const token = getAuthToken()
  if (!token)
    return {
      id: id,
      title: 'VibeKit Project (Mock)',
      slug: 'mock-page',
      status: 'draft',
      theme: 'minimal',
      sectionOrder: ['hero', 'features', 'gallery', 'contact'],
      heroSection: {
        title: 'VibeKit Studio',
        subtitle: 'Premium templates for modern brands.',
        buttonText: 'Get Started',
        buttonUrl: '#features',
      },
      featuresSection: [
        {
          title: 'Modular Design',
          description: 'Built with a scalable feature-based architecture.',
        },
        {
          title: 'Type Safe',
          description: 'Full TypeScript coverage across the entire stack.',
        },
        {
          title: 'High Performance',
          description: 'Optimized for TanStack Start and React 19.',
        },
      ],
      gallerySection: [
        { url: 'https://picsum.photos/seed/vibe1/800/600', alt: 'Vibe 1' },
        { url: 'https://picsum.photos/seed/vibe2/800/600', alt: 'Vibe 2' },
        { url: 'https://picsum.photos/seed/vibe3/800/600', alt: 'Vibe 3' },
      ],
      contactSection: {
        heading: 'Get in Touch',
        subheading: 'Let us build your next big thing.',
      },
      viewCount: 0,
      updatedAt: new Date().toISOString(),
    } as any as PageRenderData

  const res = await fetch(`/api/pages/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!res.ok) {
    if (res.status === 401) throw new Error('Unauthorized')
    if (res.status === 404) throw new Error('NotFound')
    throw new Error('Failed to fetch page')
  }

  const data = await res.json()
  return data.page
}

async function fetchPublicPage(slug: string): Promise<PageRenderData> {
  const res = await fetch(`/api/public/pages/${slug}`)

  if (!res.ok) {
    if (res.status === 404) throw new Error('NotFound')
    throw new Error('Failed to fetch public page')
  }

  const data = await res.json()
  return data.page
}

// Query Options
export const pagesQueryOptions = queryOptions({
  queryKey: ['pages'] as const,
  queryFn: fetchPages,
})

export const pageQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ['pages', id] as const,
    queryFn: () => fetchPage(id),
    enabled: !!id,
  })

export const publicPageQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ['public', 'pages', slug] as const,
    queryFn: () => fetchPublicPage(slug),
    enabled: !!slug,
  })
