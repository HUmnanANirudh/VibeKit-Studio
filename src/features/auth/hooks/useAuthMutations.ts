import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { useEffect } from 'react'
import { authUserCollection } from '../../../db-collections'
import { apiFetch, setAccessToken } from '../../../lib/api'

export function useAuthMutations() {
  const router = useRouter()
  const queryClient = useQueryClient()

  useEffect(() => {
    const handleLogout = () => {
      setAccessToken(null)
      queryClient.setQueryData(['auth', 'user'], null)
      // Only redirect if not already on an auth page, and avoid a hard refresh if possible
      if (!window.location.pathname.startsWith('/auth')) {
        router.navigate({ to: '/auth/login' })
      }
    }
    window.addEventListener('auth:logout', handleLogout)
    return () => window.removeEventListener('auth:logout', handleLogout)
  }, [queryClient, router])

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const res = await apiFetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Login failed')
      return data
    },
    onSuccess: (data) => {
      setAccessToken(data.accessToken)
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
      const res = await apiFetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Signup failed')
      return data
    },
    onSuccess: (data) => {
      setAccessToken(data.accessToken)
      authUserCollection.insert(data.user)
      queryClient.setQueryData(['auth', 'user'], data.user)
      router.navigate({ to: '/app' })
    },
  })

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiFetch('/api/auth/logout', { method: 'POST' })
    },
    onSuccess: () => {
      setAccessToken(null)
      const user = queryClient.getQueryData<{ id: string }>(['auth', 'user'])
      if (user?.id) {
        authUserCollection.delete(user.id)
      }
      queryClient.setQueryData(['auth', 'user'], null)
      router.navigate({ to: '/auth/login' })
    },
  })

  return {
    loginMutation,
    signupMutation,
    logoutMutation,
  }
}
