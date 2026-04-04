'use client'

import { GripVerticalIcon } from 'lucide-react'
import * as ResizablePrimitive from 'react-resizable-panels'
import { forwardRef } from 'react'

import { cn } from '#/lib/utils'

const ResizablePanelGroup = forwardRef<
  ResizablePrimitive.GroupImperativeHandle,
  ResizablePrimitive.GroupProps & {
    direction?: 'horizontal' | 'vertical'
  }
>(({ className, direction, ...props }, ref) => {
  return (
    <ResizablePrimitive.Group
      groupRef={ref}
      data-slot="resizable-panel-group"
      orientation={direction || props.orientation}
      className={cn(
        'flex h-full w-full aria-[orientation=vertical]:flex-col',
        className,
      )}
      {...props}
    />
  )
})
ResizablePanelGroup.displayName = 'ResizablePanelGroup'

const ResizablePanel = forwardRef<
  ResizablePrimitive.PanelImperativeHandle,
  ResizablePrimitive.PanelProps
>(({ ...props }, ref) => {
  return (
    <ResizablePrimitive.Panel
      panelRef={ref}
      data-slot="resizable-panel"
      {...props}
    />
  )
})
ResizablePanel.displayName = 'ResizablePanel'

const ResizableHandle = forwardRef<
  HTMLDivElement,
  ResizablePrimitive.SeparatorProps & {
    withHandle?: boolean
  }
>(({ withHandle, className, ...props }, ref) => {
  return (
    <ResizablePrimitive.Separator
      elementRef={ref}
      data-slot="resizable-handle"
      className={cn(
        'relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:outline-hidden aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full aria-[orientation=horizontal]:after:left-0 aria-[orientation=horizontal]:after:h-1 aria-[orientation=horizontal]:after:w-full aria-[orientation=horizontal]:after:translate-x-0 aria-[orientation=horizontal]:after:-translate-y-1/2 [&[aria-orientation=horizontal]>div]:rotate-90',
        className,
      )}
      {...props}
    >
      {withHandle && (
        <div className="z-10 flex h-4 w-3 items-center justify-center rounded-xs border bg-border">
          <GripVerticalIcon className="size-2.5" />
        </div>
      )}
    </ResizablePrimitive.Separator>
  )
})
ResizableHandle.displayName = 'ResizableHandle'

export { ResizableHandle, ResizablePanel, ResizablePanelGroup }
