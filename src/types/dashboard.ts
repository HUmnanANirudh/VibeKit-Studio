import type { PageRenderData, Theme } from './editor'

export interface NewPageModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (title: string, theme: Theme) => void
  isPending: boolean
}

export interface PageCardProps {
  page: PageRenderData
  onDuplicate: (id: string) => void
  isDuplicating: boolean
}
