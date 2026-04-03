import type { 
  PageRenderData, 
  Theme, 
  PuckData
} from '#/types'

export function toPuckData(page: PageRenderData): PuckData {
  // Use the new dynamic content field if it exists and is not empty
  if (page.content && (page.content as any).blocks) {
    const data = page.content as any
    return {
      content: data.blocks || [],
      zones: data.zones || {},
      root: {
        props: {
          theme: page.theme as Theme,
          title: page.title,
          themeTokens: page.themeTokens,
        },
      },
    } as any
  }

  return {
    content: page.content || [],
    root: {
      props: {
        theme: page.theme as Theme,
        title: page.title,
        themeTokens: page.themeTokens,
      },
    },
  } as any
}

export function fromPuckData(
  puck: PuckData,
  originalPage: PageRenderData,
): PageRenderData {
  const page = { ...originalPage }

  page.title = puck.root.props.title
  page.theme = puck.root.props.theme
  page.content = { blocks: puck.content, zones: (puck as any).zones } as any

  page.sectionOrder = []
  return page
}

export function fromAssistantUpdate(
  update: any,
  originalPage: PageRenderData,
): PageRenderData {
  const page = { ...originalPage }
  
  page.themeTokens = update.theme
  page.interactions = update.interactions
  page.content = { blocks: update.blocks || [], zones: update.zones || {} } as any

  page.sectionOrder = []
  return page
}

