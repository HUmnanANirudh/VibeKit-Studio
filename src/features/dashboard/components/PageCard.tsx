import { Link } from '@tanstack/react-router'
import { Card, CardContent } from '#/components/ui/card'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { ExternalLink, Copy, Edit, Loader2 } from 'lucide-react'

const THEMES: Record<string, { label: string; color: string }> = {
  minimal: { label: 'Minimal', color: '#18181B' },
  'neo-brutal': { label: 'Neo-Brutal', color: '#FF3F00' },
  'dark-neon': { label: 'Dark/Neon', color: '#00FFB2' },
  pastel: { label: 'Pastel', color: '#C084FC' },
  luxury: { label: 'Luxury', color: '#C9A96E' },
  retro: { label: 'Retro', color: '#FFD700' },
}

import type { PageCardProps } from '#/types'

export function PageCard({ page, onDuplicate, isDuplicating }: PageCardProps) {
  return (
    <Card className="overflow-hidden bg-card border-border shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-3 h-3 rounded-full"
            style={{ background: THEMES[page.theme]?.color || '#999' }}
            title={THEMES[page.theme]?.label}
          />
          <Badge
            variant={page.status === 'published' ? 'default' : 'secondary'}
          >
            {page.status}
          </Badge>
        </div>

        <h3 className="text-lg font-bold mb-1 truncate text-card-foreground">
          {page.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          /{page.slug} · {page.viewCount || 0} views
        </p>

        <div className="flex gap-2">
          <Button asChild variant="default" className="flex-1 h-9 shadow-sm">
            <Link to="/app/pages/$id" params={{ id: page.id }}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Link>
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={() => onDuplicate(page.id)}
            disabled={isDuplicating}
            title="Duplicate page"
          >
            {isDuplicating ? (
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>

          {page.status === 'published' && (
            <Button asChild variant="outline" size="icon" className="h-9 w-9">
              <a
                href={`/p/${page.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                title="View published page"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
