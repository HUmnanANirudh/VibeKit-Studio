import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from '#/components/ui/input'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '#/components/ui/form'
import { AuthForm } from './AuthForm'
import { useAuthMutations } from '../hooks/useAuthMutations'
import { loginSchema } from '../schemas/auth'
import type { LoginFormValues } from '../schemas/auth'

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const { loginMutation } = useAuthMutations()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onTouched',
  })

  async function onSubmit(data: LoginFormValues) {
    loginMutation.mutate(data)
  }

  return (
    <AuthForm
      title="Welcome back"
      description="Log in to your Themely Studio account"
      submitLabel="Log in"
      loadingLabel="Logging in..."
      loading={loginMutation.isPending}
      error={loginMutation.error?.message || ''}
      onSubmit={onSubmit}
      form={form}
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
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="pr-10"
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </AuthForm>
  )
}
