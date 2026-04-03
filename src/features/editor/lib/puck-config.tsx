import type { Config } from '@puckeditor/core'
import { DropZone } from '@puckeditor/core'
import type { RootProps } from '#/types'

export const config: Config<any, RootProps, 'layout' | 'content'> = {
  categories: {
    layout: {
      components: ['Section', 'Flex'],
    },
    content: {
      components: ['Text', 'Image', 'Button'],
    },
  },
  root: {
    render: ({ children, theme, themeTokens }: any) => {
      const styles = themeTokens ? {
        '--bg': themeTokens.colors?.background,
        '--surface': themeTokens.colors?.surface,
        '--text': themeTokens.colors?.text,
        '--accent': themeTokens.colors?.accent,
        '--heading-font': themeTokens.typography?.headingFont,
        '--body-font': themeTokens.typography?.bodyFont,
        '--radius': themeTokens.radius,
        '--spacing-section': themeTokens.spacing?.section,
        '--spacing-element': themeTokens.spacing?.element,
      } as React.CSSProperties : {}

      return (
        <div 
          className="vk-editor-root min-h-screen text-[var(--text)] bg-[var(--bg)]" 
          data-theme={theme}
          style={styles}
        >
          {children}
        </div>
      )
    },
  },
  components: {
    Section: {
      fields: {
        background: { type: 'select', options: [{label: 'Default', value: 'default'}, {label: 'Surface', value: 'surface'}] },
        padding: { type: 'select', options: [{label: 'Medium', value: 'md'}, {label: 'Large', value: 'lg'}] },
      },
      defaultProps: { background: 'default', padding: 'md' },
      render: ({ background, padding }) => {
        const bgClass = background === 'surface' ? 'bg-[var(--surface)]' : 'bg-[var(--bg)]'
        const pyClass = padding === 'lg' ? 'py-24' : 'py-16'
        return (
          <section className={`${bgClass} ${pyClass} px-6 md:px-12 w-full`}>
            <div className="max-w-6xl mx-auto w-full">
              <DropZone zone="content" />
            </div>
          </section>
        )
      }
    },
    Flex: {
      fields: {
        direction: { type: 'select', options: [{label: 'Row', value: 'row'}, {label: 'Column', value: 'col'}] },
        gap: { type: 'select', options: [{label: 'Small', value: 'sm'}, {label: 'Medium', value: 'md'}, {label: 'Large', value: 'lg'}] },
        align: { type: 'select', options: [{label: 'Start', value: 'start'}, {label: 'Center', value: 'center'}] },
      },
      defaultProps: { direction: 'col', gap: 'md', align: 'start' },
      render: ({ direction, gap, align }) => {
        const flexDir = direction === 'row' ? 'flex-col md:flex-row' : 'flex-col'
        const gapMap = { sm: 'gap-4', md: 'gap-8', lg: 'gap-12' }
        const itemsMap = { start: 'items-start', center: 'items-center' }
        return (
          <div className={`flex ${flexDir} ${gapMap[gap as keyof typeof gapMap]} ${itemsMap[align as keyof typeof itemsMap]} w-full`}>
            <div className="flex-1 w-full"><DropZone zone="col1" /></div>
            {direction === 'row' && <div className="flex-1 w-full"><DropZone zone="col2" /></div>}
          </div>
        )
      }
    },
    Text: {
      fields: {
        tag: { type: 'select', options: [{label: 'H1', value: 'h1'}, {label: 'H2', value: 'h2'}, {label: 'H3', value: 'h3'}, {label: 'Paragraph', value: 'p'}] },
        content: { type: 'textarea' },
        align: { type: 'select', options: [{label: 'Left', value: 'left'}, {label: 'Center', value: 'center'}] },
        color: { type: 'select', options: [{label: 'Default', value: 'default'}, {label: 'Accent', value: 'accent'}, {label: 'Muted', value: 'muted'}] },
      },
      defaultProps: { tag: 'p', content: 'Enter text here', align: 'left', color: 'default' },
      render: ({ tag, content, align, color }) => {
        const Tag = tag as keyof JSX.IntrinsicElements
        let baseClass = ''
        if (tag === 'h1') baseClass = 'text-5xl md:text-6xl font-bold mb-4 font-[var(--heading-font)] tracking-tight'
        if (tag === 'h2') baseClass = 'text-3xl md:text-4xl font-semibold mb-4 font-[var(--heading-font)] tracking-tight'
        if (tag === 'h3') baseClass = 'text-xl md:text-2xl font-medium mb-3 font-[var(--heading-font)]'
        if (tag === 'p') baseClass = 'text-lg leading-relaxed mb-4 font-[var(--body-font)]'
        
        let colorClass = 'text-[var(--text)]'
        if (color === 'accent') colorClass = 'text-[var(--accent)]'
        if (color === 'muted') colorClass = 'opacity-70'
        
        const alignClass = align === 'center' ? 'text-center' : 'text-left'
        
        return <Tag className={`${baseClass} ${colorClass} ${alignClass} w-full`}>{content}</Tag>
      }
    },
    Image: {
      fields: {
        url: { type: 'text' },
        alt: { type: 'text' },
      },
      defaultProps: { url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop', alt: 'Abstract image' },
      render: ({ url, alt }) => (
        <img src={url} alt={alt} className="w-full h-auto object-cover rounded-[var(--radius)] shadow-lg !my-4" />
      )
    },
    Button: {
      fields: {
        label: { type: 'text' },
        url: { type: 'text' },
        variant: { type: 'select', options: [{label: 'Primary', value: 'primary'}, {label: 'Outline', value: 'outline'}] },
      },
      defaultProps: { label: 'Click Me', url: '#', variant: 'primary' },
      render: ({ label, url, variant }) => {
        const baseClass = "inline-flex items-center justify-center px-6 py-3 font-medium transition-all focus-visible:ring-2 focus-visible:outline-none"
        const variantClass = variant === 'primary' 
          ? "bg-[var(--accent)] text-white hover:opacity-90 shadow-md" 
          : "border-2 border-[var(--text)] text-[var(--text)] hover:bg-[var(--text)] hover:text-[var(--bg)]"
        
        return (
          <a href={url} className={`${baseClass} ${variantClass}`} style={{ borderRadius: 'var(--radius)' }}>
            {label}
          </a>
        )
      }
    }
  },
}
