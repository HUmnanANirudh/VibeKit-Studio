import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { AuthForm } from './AuthForm'
import { useAuthMutations } from '../hooks/useAuthMutations'

export function SignupForm() {
  const { signupMutation } = useAuthMutations()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    signupMutation.mutate(formData)
  }

  return (
    <AuthForm
      title="Create account"
      description="Join VibeKit Studio and start building"
      submitLabel="Create account"
      loadingLabel="Creating account..."
      loading={signupMutation.isPending}
      error={signupMutation.error?.message || ''}
      onSubmit={handleSubmit}
      footer={
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            to="/auth/login"
            className="text-primary font-semibold hover:underline"
          >
            Log in
          </Link>
        </p>
      }
    >
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          placeholder="John Doe"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          required
          minLength={8}
        />
      </div>
    </AuthForm>
  )
}
