import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from '@tanstack/react-router'
import { QueryClient } from '@tanstack/react-query'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import * as React from 'react'
import appCss from '#/styles/styles.css?url'
import themeCss from '#/styles/theme-tokens.css?url'
import { TooltipProvider } from '#/components/ui/tooltip'

import { getAuthUser } from '#/lib/auth.functions'

interface MyRouterContext {
  queryClient: QueryClient
  auth: {
    user: { id: string; email: string; name: string } | null
  }
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: async () => {
    const user = await getAuthUser()
    return {
      auth: { user },
    }
  },
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'stylesheet', href: themeCss },
      { rel: 'icon', href: '/favicon.ico' },
    ],
  }),
  component: RootLayout,
  shellComponent: RootDocument,
  notFoundComponent: () => (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
      <h1 className="text-4xl font-bold mb-4 italic italic tracking-tighter">
        VIBE<span className="text-primary">KIT</span> 404
      </h1>
      <p className="text-muted-foreground mb-6 max-w-md">
        Oops! Whatever vibe you're looking for, it's not at this URL.
      </p>
      <a
        href="/"
        className="text-primary font-semibold hover:underline"
      >
        Go back home
      </a>
    </div>
  ),
})

function RootLayout() {
  return <Outlet />
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <TooltipProvider>{children}</TooltipProvider>
        <TanStackRouterDevtools position="bottom-right" />
        <ReactQueryDevtools buttonPosition="bottom-left" />
        <Scripts />
      </body>
    </html>
  )
}
