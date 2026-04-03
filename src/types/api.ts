import type { PageRenderData } from './editor'

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
