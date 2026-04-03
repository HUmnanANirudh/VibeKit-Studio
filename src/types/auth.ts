import type { ReactNode } from 'react'
import type { UseFormReturn } from 'react-hook-form'

export interface AuthFormProps {
  title: string
  description: string
  submitLabel: string
  loadingLabel: string
  loading: boolean
  error: string
  onSubmit: (data: any) => void
  children: ReactNode
  footer: ReactNode
  form?: UseFormReturn<any>
}
