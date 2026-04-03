import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { AuthForm } from './AuthForm'
import { useAuthMutations } from '../hooks/useAuthMutations'

export function LoginForm() {
  const { loginMutation } = useAuthMutations()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    loginMutation.mutate({ email, password })
  }

  return (
    <AuthForm
      title="Welcome back"
      description="Log in to your VibeKit Studio account"
      submitLabel="Log in"
      loadingLabel="Logging in..."
      loading={loginMutation.isPending}
      error={loginMutation.error?.message || ''}
      onSubmit={handleSubmit}
      footer={
        <p className="text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link
            to="/auth/signup"
            className="text-primary font-semibold hover:underline"
          >
            Sign up free
          </Link>
        </p>
      }
    >
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
    </AuthForm>
  )
}
