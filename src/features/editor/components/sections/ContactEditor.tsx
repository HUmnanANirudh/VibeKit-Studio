import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import type { ContactSectionConfig } from '#/types'

interface ContactEditorProps {
  data: ContactSectionConfig
  onChange: (data: ContactSectionConfig) => void
}

export function ContactEditor({ data, onChange }: ContactEditorProps) {
  return (
    <div className="grid gap-4">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground text-card-foreground">
        Contact Section
      </h3>
      <div className="grid gap-1.5">
        <Label htmlFor="contact-heading">Heading</Label>
        <Input
          id="contact-heading"
          value={data.heading}
          onChange={(e) => onChange({ ...data, heading: e.target.value })}
        />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="contact-subheading">Subheading</Label>
        <Input
          id="contact-subheading"
          value={data.subheading}
          onChange={(e) => onChange({ ...data, subheading: e.target.value })}
        />
      </div>
    </div>
  )
}
