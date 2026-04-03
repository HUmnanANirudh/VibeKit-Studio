import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Trash2, Plus, Image as ImageIcon } from 'lucide-react'
import type { GalleryImage, GalleryEditorProps } from '#/types'

export function GalleryEditor({ data, onChange }: GalleryEditorProps) {
  const updateImage = (
    index: number,
    field: keyof GalleryImage,
    value: string,
  ) => {
    const updated = [...data]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  const addImage = () => {
    if (data.length >= 8) return
    onChange([...data, { url: '', alt: '' }])
  }

  const removeImage = (index: number) => {
    if (data.length <= 1) return
    onChange(data.filter((_, i) => i !== index))
  }

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Gallery ({data.length}/8)
        </h3>
        {data.length < 8 && (
          <Button variant="outline" size="sm" onClick={addImage}>
            <Plus className="h-4 w-4 mr-1" /> Add Image
          </Button>
        )}
      </div>

      <div className="grid gap-4">
        {data.map((image, i) => (
          <div
            key={`${image.url || image.alt}-${i}`}
            className="group relative rounded-lg border bg-muted/30 p-4"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="flex h-16 w-24 shrink-0 items-center justify-center rounded border bg-background overflow-hidden relative group">
                {image.url ? (
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ImageIcon className="h-6 w-6 text-muted-foreground/40" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-muted-foreground uppercase">
                  Image {i + 1}
                </p>
                <p className="text-xs truncate text-muted-foreground/60">
                  {image.url || 'No URL provided'}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={() => removeImage(i)}
                disabled={data.length <= 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor={`img-url-${i}`}>Image URL</Label>
                <Input
                  id={`img-url-${i}`}
                  type="url"
                  placeholder="https://..."
                  value={image.url}
                  onChange={(e) => updateImage(i, 'url', e.target.value)}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor={`img-alt-${i}`}>Alt Text</Label>
                <Input
                  id={`img-alt-${i}`}
                  value={image.alt}
                  onChange={(e) => updateImage(i, 'alt', e.target.value)}
                  placeholder="Describe your image"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
