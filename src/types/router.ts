import type { QueryClient } from '@tanstack/react-query'

export interface MyRouterContext {
  queryClient: QueryClient
  auth: {
    user: { id: string; email: string; name: string } | null
  }
}
