import type { FeatureCard } from '#/types'
import { cn } from '#/lib/utils'

export interface FeaturesProps {
  items: FeatureCard[]
  className?: string
}

export function Features({ items, className }: FeaturesProps) {
  return (
    <section className={cn('vk-section', className)}>
      <div className="vk-container">
        <h2 className="vk-section-heading text-center mb-12">Features</h2>
        <div className="vk-features-grid">
          {items.map((item, i) => (
            <div key={i} className="vk-feature-card vk-card">
              <div className="vk-feature-icon text-2xl mb-4">✦</div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
