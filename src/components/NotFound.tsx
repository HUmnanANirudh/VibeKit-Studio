import { motion } from 'motion/react'
import { Home } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Button } from '#/components/ui/button'

export function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center overflow-hidden relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="absolute -translate-y-1/2 text-[clamp(6rem,20vw,15rem)] font-black text-primary/10 select-none w-full pointer-events-none select-none overflow-hidden"
        >
          <span className="text-[13rem] md:text-[15rem] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-primary/20 to-transparent block">
            404
          </span>
        </motion.div>

        <div className='space-y-4'>
          <div className="space-y-2">
            <motion.h2 
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.8 }}
              className="text-5xl font-black tracking-tight sm:text-7xl uppercase"
            >
              VIBE<span className="text-primary italic">KIT</span> LOST
            </motion.h2>
            <p className="text-lg text-muted-foreground max-w-md mx-auto sm:text-xl font-medium">
              Whatever vibe you're hunting for, it seems to have drifted into another dimension.
            </p>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-4 pt-4"
          >
            <Button asChild size="lg" className="rounded-full px-8 py-6 text-base font-bold transition-all hover:scale-105 active:scale-95">
              <Link to="/">
                <Home className="h-5 w-5" />
                Go Back Home
              </Link>
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
