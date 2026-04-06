import { Home, ArrowLeft } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Button } from '#/components/ui/button'

export function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center overflow-hidden relative">
      <div className="relative z-10 flex flex-col items-center">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-full pointer-events-none select-none overflow-hidden animate-blur-in">
          <span className="text-[13.5rem] sm:text-[15rem] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-primary/20 to-transparent block">
            404
          </span>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-5xl font-black tracking-tight sm:text-7xl uppercase animate-blur-in">
              VIBE<span className="text-primary italic">KIT</span> LOST
            </h2>
            <p className="text-lg text-muted-foreground max-w-md mx-auto sm:text-xl font-medium animate-fade-in-up [animation-delay:0.3s] opacity-0 [animation-fill-mode:forwards]">
              Whatever vibe you're hunting for, it seems to have drifted into
              another dimension.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-fade-in-up [animation-delay:0.5s] opacity-0 [animation-fill-mode:forwards]">
            <Button
              variant="outline"
              size="lg"
              onClick={() => window.history.back()}
              className="rounded-full cursor-pointer px-8 text-base font-bold border-2 hover:bg-secondary/10 transition-all hover:-translate-x-1 active:scale-95"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Previous Page
            </Button>
            <Button
              asChild
              size="lg"
              className="rounded-full px-8  text-base font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-105 active:scale-95"
            >
              <Link to="/">
                <Home className="mr-2 h-5 w-5" />
                Go Back Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
