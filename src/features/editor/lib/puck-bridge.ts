import type { 
  PageRenderData, 
  Theme, 
  HeroSection, 
  FeatureCard, 
  GalleryImage, 
  ContactSectionConfig 
} from '#/types'

export interface PuckData {
  content: Array<{
    type: string
    props: Record<string, any>
  }>
  root: {
    props: {
      theme: Theme
      title: string
    }
  }
}

export function toPuckData(page: PageRenderData): PuckData {
  const content = page.sectionOrder
    .map((type) => {
      if (type === 'hero') return { type: 'Hero', props: page.heroSection }
      if (type === 'features')
        return { type: 'Features', props: { items: page.featuresSection } }
      if (type === 'gallery')
        return { type: 'Gallery', props: { images: page.gallerySection } }
      if (type === 'contact')
        return { type: 'Contact', props: page.contactSection }
      return null
    })
    .filter(Boolean) as any

  return {
    content,
    root: {
      props: {
        theme: page.theme as Theme,
        title: page.title,
      },
    },
  }
}

export function fromPuckData(
  puck: PuckData,
  originalPage: PageRenderData,
): PageRenderData {
  const page = { ...originalPage }

  page.title = puck.root.props.title
  page.theme = puck.root.props.theme

  const sectionOrder: string[] = []

  for (const block of puck.content) {
    const type = block.type.toLowerCase()
    sectionOrder.push(type)

    if (type === 'hero') page.heroSection = block.props as HeroSection
    if (type === 'features') page.featuresSection = (block.props.items || []) as FeatureCard[]
    if (type === 'gallery') page.gallerySection = (block.props.images || []) as GalleryImage[]
    if (type === 'contact') page.contactSection = block.props as ContactSectionConfig
  }

  page.sectionOrder = sectionOrder
  return page
}

export interface AssistantUpdate {
  theme: Theme
  title: string
  blocks: Array<{
    type: 'Hero' | 'Features' | 'Gallery' | 'Contact'
    props: any
  }>
}

export function fromAssistantUpdate(
  update: AssistantUpdate,
  originalPage: PageRenderData,
): PageRenderData {
  const page = { ...originalPage }
  page.theme = update.theme as Theme
  page.title = update.title

  const sectionOrder: string[] = []
  for (const block of update.blocks) {
    const type = block.type.toLowerCase()
    sectionOrder.push(type)
    if (type === 'hero') page.heroSection = block.props as HeroSection
    if (type === 'features') page.featuresSection = (block.props.items || []) as FeatureCard[]
    if (type === 'gallery') page.gallerySection = (block.props.images || []) as GalleryImage[]
    if (type === 'contact') page.contactSection = block.props as ContactSectionConfig
  }
  page.sectionOrder = sectionOrder
  return page
}
