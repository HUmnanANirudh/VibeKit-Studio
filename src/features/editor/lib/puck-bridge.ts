import type { PageRenderData, Theme } from '#/types'

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
  const content = page.sectionOrder.map(type => {
    if (type === 'hero') return { type: 'Hero', props: page.heroSection }
    if (type === 'features') return { type: 'Features', props: { items: page.featuresSection } }
    if (type === 'gallery') return { type: 'Gallery', props: { images: page.gallerySection } }
    if (type === 'contact') return { type: 'Contact', props: page.contactSection }
    return null
  }).filter(Boolean) as PuckData['content']

  return {
    content,
    root: {
      props: {
        theme: page.theme as Theme,
        title: page.title
      }
    }
  }
}

export function fromPuckData(puck: PuckData, originalPage: PageRenderData): PageRenderData {
  const page = { ...originalPage }
  
  page.title = puck.root.props.title
  page.theme = puck.root.props.theme
  
  const sectionOrder: string[] = []
  
  for (const block of puck.content) {
    const type = block.type.toLowerCase()
    sectionOrder.push(type)
    
    if (type === 'hero') page.heroSection = block.props as any
    if (type === 'features') page.featuresSection = block.props.items || []
    if (type === 'gallery') page.gallerySection = block.props.images || []
    if (type === 'contact') page.contactSection = block.props as any
  }
  
  page.sectionOrder = sectionOrder
  return page
}

export function fromAssistantUpdate(update: any, originalPage: PageRenderData): PageRenderData {
  // Assistant update structure from tool call:
  // { theme, title, blocks: Array<{ type, props }> }
  const page = { ...originalPage }
  page.theme = update.theme
  page.title = update.title
  
  const sectionOrder: string[] = []
  for (const block of update.blocks) {
    const type = block.type.toLowerCase()
    sectionOrder.push(type)
    if (type === 'hero') page.heroSection = block.props
    if (type === 'features') page.featuresSection = block.props.items || []
    if (type === 'gallery') page.gallerySection = block.props.images || []
    if (type === 'contact') page.contactSection = block.props
  }
  page.sectionOrder = sectionOrder
  return page
}
