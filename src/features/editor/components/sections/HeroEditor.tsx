import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import type { HeroSection, HeroEditorProps } from '#/types'

export function HeroEditor({ data, onChange }: HeroEditorProps) {
  const fields: { label: string; key: keyof HeroSection; type: string }[] = [
    { label: 'Title', key: 'title', type: 'text' },
    { label: 'Subtitle', key: 'subtitle', type: 'text' },
    { label: 'Button Text', key: 'buttonText', type: 'text' },
    { label: 'Button URL', key: 'buttonUrl', type: 'url' },
  ]

  return (
    <div className="grid gap-4">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Hero Section
      </h3>
      {fields.map((f) => (
        <div key={f.key} className="grid gap-1.5">
          <Label htmlFor={`hero-${f.key}`}>{f.label}</Label>
          <Input
            id={`hero-${f.key}`}
            type={f.type}
            value={data[f.key]}
            onChange={(e) => onChange({ [f.key]: e.target.value })}
            placeholder={f.key === 'buttonUrl' ? 'https://...' : undefined}
          />
        </div>
      ))}
    </div>
  )
}
