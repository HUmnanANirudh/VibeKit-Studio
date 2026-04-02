export type Theme = 'minimal' | 'neo-brutal' | 'dark-neon' | 'pastel' | 'luxury' | 'retro'

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

export type PageStatus = 'draft' | 'published'

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

export interface ApiResponse<T = any> {
  error?: string
  data?: T
  [key: string]: any
}

export interface PageResponse {
  page: PageRenderData
}

export interface PagesResponse {
  pages: PageRenderData[]
}
