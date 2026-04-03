import type { GalleryProps } from '#/types'
import { cn } from '#/lib/utils'

export function Gallery({ images, className }: GalleryProps) {
  return (
    <section className={cn('vk-section bg-secondary/50', className)}>
      <div className="vk-container">
        <h2 className="vk-section-heading text-center mb-12">Gallery</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images
            .filter((i) => i.url)
            .map((img, i) => (
              <div
                key={`${img.url || img.alt}-${i}`}
                className="aspect-video overflow-hidden rounded-xl border bg-background shadow-sm hover:shadow-md transition-shadow"
              >
                <img
                  src={img.url}
                  alt={img.alt || ''}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
        </div>
      </div>
    </section>
  )
}
