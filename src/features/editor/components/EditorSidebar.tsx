import { HeroEditor } from './sections/HeroEditor'
import { FeaturesEditor } from './sections/FeaturesEditor'
import { GalleryEditor } from './sections/GalleryEditor'
import { ContactEditor } from './sections/ContactEditor'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { Button } from '#/components/ui/button'
import { ChevronUp, ChevronDown } from 'lucide-react'
import type { PageRenderData, Theme } from '#/types'

const THEMES: Record<Theme, string> = {
  minimal: 'Minimal',
  'neo-brutal': 'Neo-Brutal',
  'dark-neon': 'Dark/Neon',
  pastel: 'Pastel',
  luxury: 'Luxury',
  retro: 'Retro',
}

interface EditorSidebarProps {
  page: PageRenderData
  activeSection: string
  onUpdatePage: (updates: Partial<PageRenderData>) => void
  onSetActiveSection: (section: string) => void
  onMoveSection: (index: number, direction: 'up' | 'down') => void
}

export function EditorSidebar({
  page,
  activeSection,
  onUpdatePage,
  onSetActiveSection,
  onMoveSection,
}: EditorSidebarProps) {
  return (
    <aside className="w-[340px] border-r bg-card flex flex-col h-full">
      <div className="flex flex-col border-b p-2 gap-1">
        {page.sectionOrder.map((section, index) => (
          <div
            key={section}
            className={`flex items-center rounded-md transition-colors ${
              activeSection === section ? 'bg-muted' : 'hover:bg-muted/50'
            }`}
          >
            <button
              onClick={() => onSetActiveSection(section)}
              className={`flex-1 text-left px-3 py-2 text-sm font-medium ${
                activeSection === section ? 'text-primary' : 'text-foreground'
              }`}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </button>
            <div className="flex flex-col pr-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-6"
                disabled={index === 0}
                onClick={() => onMoveSection(index, 'up')}
              >
                <ChevronUp className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-6"
                disabled={index === page.sectionOrder.length - 1}
                onClick={() => onMoveSection(index, 'down')}
              >
                <ChevronDown className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-8">
        <div className="space-y-4 pb-6 border-b">
          <div className="grid gap-1.5">
            <Label htmlFor="page-title">Page Title</Label>
            <Input
              id="page-title"
              value={page.title}
              onChange={(e) => onUpdatePage({ title: e.target.value })}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="page-slug">Slug</Label>
            <Input
              id="page-slug"
              value={page.slug}
              onChange={(e) =>
                onUpdatePage({
                  slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
                })
              }
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="page-theme">Theme / Vibe</Label>
            <Select
              value={page.theme}
              onValueChange={(v) => onUpdatePage({ theme: v as Theme })}
            >
              <SelectTrigger id="page-theme">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(THEMES).map(([k, v]) => (
                  <SelectItem key={k} value={k}>
                    {v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {activeSection === 'hero' && (
          <HeroEditor
            data={page.heroSection}
            onChange={(updates) =>
              onUpdatePage({ heroSection: { ...page.heroSection, ...updates } })
            }
          />
        )}
        {activeSection === 'features' && (
          <FeaturesEditor
            data={page.featuresSection}
            onChange={(data) => onUpdatePage({ featuresSection: data })}
          />
        )}
        {activeSection === 'gallery' && (
          <GalleryEditor
            data={page.gallerySection}
            onChange={(data) => onUpdatePage({ gallerySection: data })}
          />
        )}
        {activeSection === 'contact' && (
          <ContactEditor
            data={page.contactSection}
            onChange={(data) => onUpdatePage({ contactSection: data })}
          />
        )}
      </div>
    </aside>
  )
}
