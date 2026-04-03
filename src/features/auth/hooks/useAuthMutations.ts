import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { authUserCollection } from '../../../db-collections'

export function useAuthMutations() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Login failed')
      return data
    },
    onSuccess: (data) => {
      authUserCollection.insert(data.user)
      queryClient.setQueryData(['auth', 'user'], data.user)
      router.navigate({ to: '/app' })
    },
  })

  const signupMutation = useMutation({
    mutationFn: async (formData: {
      email: string
      password: string
      name: string
    }) => {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Signup failed')
      return data
    },
    onSuccess: (data) => {
      authUserCollection.insert(data.user)
      queryClient.setQueryData(['auth', 'user'], data.user)
      router.navigate({ to: '/app' })
    },
  })

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await fetch('/api/auth/logout', { method: 'POST' })
    },
    onSuccess: () => {
      const user = queryClient.getQueryData<{ id: string }>(['auth', 'user'])
      if (user?.id) {
        authUserCollection.delete(user.id)
      }
      queryClient.setQueryData(['auth', 'user'], null)
      window.location.href = '/auth/login'
    },
  })

  return {
    loginMutation,
    signupMutation,
    logoutMutation,
  }
}
