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
import { Form } from '#/components/ui/form'
import type { AuthFormProps } from '#/types'

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
  form,
}: AuthFormProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 animate-fade-in-up">
      <Card className="w-full max-w-100 shadow-xl border-border/50">
        <CardHeader className="space-y-1 text-center">
          <Link
            to="/"
            className="text-3xl font-black italic tracking-tighter mb-6 block"
          >
           VIBE<span className="text-accent italic">KIT</span>
          </Link>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-md flex items-center gap-2 mb-4">
              <AlertCircle className="h-4 w-4" /> {error}
            </div>
          )}
          
          {form ? (
            <Form {...form}>
              <form 
                onSubmit={form.handleSubmit(onSubmit)} 
                className="space-y-4"
                noValidate
              >
                {children}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {loading ? loadingLabel : submitLabel}
                </Button>
              </form>
            </Form>
          ) : (
            <form 
              onSubmit={(e) => {
                e.preventDefault()
                onSubmit(e)
              }} 
              className="space-y-4"
              noValidate
            >
              {children}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? loadingLabel : submitLabel}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          {footer}
        </CardFooter>
      </Card>
    </div>
  )
}
