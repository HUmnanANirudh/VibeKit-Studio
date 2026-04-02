import type { HeroSection } from '#/types'
import { cn } from '#/lib/utils'

export interface HeroProps extends HeroSection {
  className?: string
}

export function Hero({ title, subtitle, buttonText, buttonUrl, className }: HeroProps) {
  return (
    <section className={cn('vk-section vk-hero-section', className)}>
      <div className="vk-container">
        <h1 className="vk-hero-title">{title}</h1>
        <p className="vk-hero-subtitle">{subtitle}</p>
        {buttonText && (
          <a href={buttonUrl || '#'} className="vk-btn vk-btn-primary">
            {buttonText}
          </a>
        )}
      </div>
    </section>
  )
}
