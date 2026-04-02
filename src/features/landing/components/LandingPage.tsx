import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export function LandingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="text-center px-6 py-12 max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 italic">
          VIBE<span className="text-primary italic">KIT</span> STUDIO
        </h1>
        <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
          The ultimate playground for generating high-vibe themes and mini-sites. 
          Stop focusing on code, start focusing on the <span className="italic font-semibold">vibe</span>.
        </p>
        <Button asChild size="lg" className="h-12 px-8 text-lg font-bold shadow-lg shadow-primary/20">
          <Link to="/app">
            Launch Studio →
          </Link>
        </Button>
      </div>
    </div>
  )
}
