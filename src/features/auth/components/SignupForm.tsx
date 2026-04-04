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
import { signupSchema, type SignupFormValues } from '../schemas/auth'

export function SignupForm() {
  const [showPassword, setShowPassword] = useState(false)
  const { signupMutation } = useAuthMutations()
  
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: '', email: '', password: '' },
    mode: 'onTouched',
  })

  async function onSubmit(data: SignupFormValues) {
    signupMutation.mutate(data)
  }

  return (
    <AuthForm
      title="Create account"
      description="Join Themely Studio and start building"
      submitLabel="Create account"
      loadingLabel="Creating account..."
      loading={signupMutation.isPending}
      error={signupMutation.error?.message || ''}
      onSubmit={onSubmit}
      form={form}
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
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
