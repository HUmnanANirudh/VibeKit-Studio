import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Trash2, Plus } from 'lucide-react'
import type { FeatureCard } from '#/types'

interface FeaturesEditorProps {
  data: FeatureCard[]
  onChange: (data: FeatureCard[]) => void
}

export function FeaturesEditor({ data, onChange }: FeaturesEditorProps) {
  const updateFeature = (index: number, field: keyof FeatureCard, value: string) => {
    const updated = [...data]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  const addFeature = () => {
    if (data.length >= 6) return
    onChange([...data, { title: 'New Feature', description: 'Describe this feature.' }])
  }

  const removeFeature = (index: number) => {
    if (data.length <= 1) return
    onChange(data.filter((_, i) => i !== index))
  }

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Features ({data.length}/6)
        </h3>
        {data.length < 6 && (
          <Button variant="outline" size="sm" onClick={addFeature}>
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        )}
      </div>

      <div className="grid gap-4">
        {data.map((feature, i) => (
          <div key={i} className="group relative rounded-lg border bg-muted/30 p-4 pt-10">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 h-7 w-7 text-muted-foreground hover:text-destructive"
              onClick={() => removeFeature(i)}
              disabled={data.length <= 1}
            >
              <Trash2 className="h-4 w-4" />
            </Button>

            <div className="grid gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor={`feature-title-${i}`}>Title</Label>
                <Input
                  id={`feature-title-${i}`}
                  value={feature.title}
                  onChange={(e) => updateFeature(i, 'title', e.target.value)}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor={`feature-desc-${i}`}>Description</Label>
                <Input
                  id={`feature-desc-${i}`}
                  value={feature.description}
                  onChange={(e) => updateFeature(i, 'description', e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
