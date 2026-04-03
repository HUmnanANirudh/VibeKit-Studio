import type { ReactNode, SyntheticEvent } from 'react'

export interface AuthFormProps {
  title: string
  description: string
  submitLabel: string
  loadingLabel: string
  loading: boolean
  error: string
  onSubmit: (e: SyntheticEvent<HTMLFormElement>) => void
  children: ReactNode
  footer: ReactNode
}
