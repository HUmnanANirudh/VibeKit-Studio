import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '#/components/ui/dialog'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { Loader2 } from 'lucide-react'

const THEMES = [
  { value: 'minimal', label: 'Minimal', color: '#1a1a1a' },
  { value: 'neo-brutal', label: 'Neo-Brutal', color: '#ff3e00' },
  { value: 'dark-neon', label: 'Dark/Neon', color: '#00ffcc' },
  { value: 'pastel-soft', label: 'Pastel Soft', color: '#ffb7ce' },
  { value: 'luxury-serif', label: 'Luxury Serif', color: '#c5a059' },
  { value: 'retro-pixel', label: 'Retro Pixel', color: '#00ff41' },
]

import type { NewPageModalProps, Theme } from '#/types'

export function NewPageModal({
  open,
  onOpenChange,
  onCreate,
  isPending,
}: NewPageModalProps) {
  const [title, setTitle] = useState('')
  const [theme, setTheme] = useState<Theme>('minimal')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || isPending) return
    onCreate(title, theme)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create new page</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Page title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="My Awesome Portfolio"
                autoFocus
                disabled={isPending}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="theme">Choose a vibe</Label>
              <Select
                value={theme}
                onValueChange={(v) => setTheme(v as Theme)}
                disabled={isPending}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a theme" />
                </SelectTrigger>
                <SelectContent>
                  {THEMES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ background: t.color }}
                        />
                        {t.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={isPending || !title.trim()}
              className="w-full"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending ? 'Creating...' : 'Create Page'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
