export type Theme =
  | 'minimal'
  | 'neo-brutal'
  | 'dark-neon'
  | 'pastel'
  | 'luxury'
  | 'retro'

export type PageStatus = 'draft' | 'published'

export interface HeroSection {
  title: string
  subtitle: string
  buttonText: string
  buttonUrl: string
}

export interface FeatureCard {
  title: string
  description: string
}

export interface GalleryImage {
  url: string
  alt: string
}

export interface ContactSectionConfig {
  heading: string
  subheading: string
}

export interface ThemeTokens {
  colors: {
    background: string
    surface: string
    text: string
    accent: string
    primary?: string
    secondary?: string
    muted?: string
    border?: string
  }
  typography: {
    headingFont: string
    bodyFont: string
    scale: {
      h1: string
      h2: string
      body: string
    }
    weights: string[]
  }
  spacing: {
    section: string
    element: string
  }
  radius: string
  buttons: {
    style: 'solid' | 'outline' | 'glow' | 'brutal'
    padding: string
    radius: string
  }
}

export interface InteractionSettings {
  hover: string
  animations: string
  accessibility: string
}

export interface PageRenderData {
  id: string
  title: string
  slug: string
  theme: Theme // The Vibe preset name
  themeTokens: ThemeTokens
  interactions: InteractionSettings
  status: PageStatus
  heroSection?: HeroSection
  featuresSection?: FeatureCard[]
  gallerySection?: GalleryImage[]
  contactSection?: ContactSectionConfig
  sectionOrder: string[]
  content: any[] // Dynamic Puck blocks
  viewCount: number
  updatedAt?: string | Date
}

// Block Props
export interface HeroProps extends HeroSection {
  className?: string
}

export interface FeaturesProps {
  items: FeatureCard[]
  className?: string
}

export interface GalleryProps {
  images: GalleryImage[]
  className?: string
}

export interface ContactProps extends ContactSectionConfig {
  className?: string
}

// Editor Components Props
export interface EditorProps {
  id: string
}

export interface EditorSidebarProps {
  page: PageRenderData
  activeSection: string
  onUpdatePage: (updates: Partial<PageRenderData>) => void
  onSetActiveSection: (section: string) => void
  onMoveSection: (index: number, direction: 'up' | 'down') => void
}

export interface VibeAssistantProps {
  onUpdatePage: (data: any) => void
  onClose: () => void
}

export type Viewport = 'desktop' | 'tablet' | 'mobile'

export interface LivePreviewProps {
  page: PageRenderData
  viewport: Viewport
}

// Puck & Bridge Internal Types
export interface PuckData {
  content: Array<{
    type: string
    props: Record<string, any>
  }>
  root: {
    props: RootProps
  }
}

export interface AssistantUpdate {
  theme: ThemeTokens
  blocks: Array<{
    id: string
    type: string
    content: Record<string, any>
    style: Record<string, any>
    media?: {
      type: string
      prompt: string
    }
  }>
  interactions: InteractionSettings
}

export type RootProps = {
  theme: Theme
  title: string
  themeTokens?: ThemeTokens
}

export interface EditorComponents {
  Hero: HeroProps
  Features: FeaturesProps
  Gallery: GalleryProps
  Contact: ContactProps
}

export interface HeroEditorProps {
  data: HeroSection
  onChange: (updates: Partial<HeroSection>) => void
}

export interface FeaturesEditorProps {
  data: FeatureCard[]
  onChange: (data: FeatureCard[]) => void
}

export interface GalleryEditorProps {
  data: GalleryImage[]
  onChange: (data: GalleryImage[]) => void
}

export interface ContactEditorProps {
  data: ContactSectionConfig
  onChange: (data: ContactSectionConfig) => void
}
