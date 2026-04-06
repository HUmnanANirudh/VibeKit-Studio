import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import netlify from '@netlify/vite-plugin-tanstack-start'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import neon from './neon-vite-plugin.ts'
import contentCollections from '@content-collections/vite'
let devtoolsPlugin = null
if (process.env.NODE_ENV === 'development') {
  const mod = await import('@tanstack/devtools-vite')
  devtoolsPlugin = (mod as any).devtools()
}
const config = defineConfig({
  plugins: [
    devtoolsPlugin,
    neon,
    contentCollections(),
    tsconfigPaths({ projects: ['./tsconfig.json'] }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
    netlify(),
  ].filter(Boolean),
  server: {
    port: 3000,
    strictPort: true,
  },
})

export default config
