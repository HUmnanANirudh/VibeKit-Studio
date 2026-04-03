import { Link } from '@tanstack/react-router'
import { Button } from '#/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '#/components/ui/card'
import { Loader2, AlertCircle } from 'lucide-react'

interface AuthFormProps {
  title: string
  description: string
  submitLabel: string
  loadingLabel: string
  loading: boolean
  error: string
  onSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => void
  children: React.ReactNode
  footer: React.ReactNode
}

export function AuthForm({
  title,
  description,
  submitLabel,
  loadingLabel,
  loading,
  error,
  onSubmit,
  children,
  footer,
}: AuthFormProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 animate-fade-in-up">
      <Card className="w-full max-w-[400px] shadow-xl border-border/50">
        <CardHeader className="space-y-1 text-center">
          <Link
            to="/"
            className="text-2xl font-black italic tracking-tighter mb-4 block"
          >
            VIBE<span className="text-primary">KIT</span>
          </Link>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-md flex items-center gap-2">
                <AlertCircle className="h-4 w-4" /> {error}
              </div>
            )}
            
            {children}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? loadingLabel : submitLabel}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          {footer}
        </CardFooter>
      </Card>
    </div>
  )
}
