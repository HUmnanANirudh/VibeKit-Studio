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

export interface PageRenderData {
  id: string
  title: string
  slug: string
  theme: Theme
  status: PageStatus
  heroSection: HeroSection
  featuresSection: FeatureCard[]
  gallerySection: GalleryImage[]
  contactSection: ContactSectionConfig
  sectionOrder: string[]
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
    props: {
      theme: Theme
      title: string
    }
  }
}

export interface AssistantUpdate {
  theme: Theme
  title: string
  blocks: Array<{
    type: 'Hero' | 'Features' | 'Gallery' | 'Contact'
    props: any
  }>
}

export type RootProps = {
  theme: Theme
  title: string
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
