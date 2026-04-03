import { generatePublishedPageHTML } from '#/lib/page-renderer'
import type { LivePreviewProps } from '#/types'

const VIEWPORT_WIDTHS: Record<string, string> = {
  desktop: '100%',
  tablet: '768px',
  mobile: '375px',
}

export function LivePreview({ page, viewport }: LivePreviewProps) {
  return (
    <div className="flex-1 bg-muted/30 overflow-hidden flex flex-col p-4 sm:p-8">
      <div className="flex-1 flex justify-center overflow-auto">
        <div
          className="h-full min-h-[600px] bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-300 ease-in-out border"
          style={{
            width: VIEWPORT_WIDTHS[viewport],
            maxWidth: '100%',
          }}
        >
          <iframe
            srcDoc={generatePublishedPageHTML(page)}
            className="w-full h-full border-none block"
            title="Page preview"
          />
        </div>
      </div>
    </div>
  )
}
