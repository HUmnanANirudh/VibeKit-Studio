import type { ContactSectionConfig } from '#/types'
import { cn } from '#/lib/utils'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Textarea } from '#/components/ui/textarea'

export interface ContactProps extends ContactSectionConfig {
  className?: string
}

export function Contact({ heading, subheading, className }: ContactProps) {
  return (
    <section className={cn('vk-section bg-background', className)} id="contact">
      <div className="vk-container max-w-2xl mx-auto text-center">
        <h2 className="vk-section-heading mb-4 text-3xl font-bold">
          {heading}
        </h2>
        <p className="vk-hero-subtitle mb-10">{subheading}</p>
        <form className="grid gap-6 text-left">
          <div className="grid gap-2">
            <label className="text-sm font-semibold">Name</label>
            <Input placeholder="Your name" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-semibold">Email</label>
            <Input type="email" placeholder="you@example.com" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-semibold">Message</label>
            <Textarea placeholder="How can we help?" rows={4} />
          </div>
          <Button size="lg" className="vk-btn-primary h-12">
            Send Message
          </Button>
        </form>
      </div>
    </section>
  )
}
