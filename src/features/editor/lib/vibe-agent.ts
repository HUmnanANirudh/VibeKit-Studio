import { ToolLoopAgent, tool, type InferAgentUIMessage } from 'ai'
import { openrouter } from '#/lib/ai/openrouter'
import { z } from 'zod'
export const updatePageTool = tool({
  description: 'Update the page structure with new content and theme.',
  inputSchema: z.object({
    theme: z.enum([
      'minimal',
      'neo-brutal',
      'dark-neon',
      'pastel',
      'luxury',
      'retro',
    ]),
    title: z.string().describe('The page title'),
    blocks: z.array(
      z.object({
        type: z.enum(['Hero', 'Features', 'Gallery', 'Contact']),
        props: z.record(z.string(), z.any()),
      }),
    ),
  }),
  execute: async (args) => {
    return args
  },
})

export const vibeAgent = new ToolLoopAgent({
  model: openrouter('openrouter/auto'),
  instructions: `You are the Vibe Assistant for VibeKit Studio. 
  Your goal is to help users build beautiful mini-sites by generating and updating the page structure.
  
  Available components:
  - Hero: { title, subtitle, buttonText, buttonUrl }
  - Features: { items: Array<{ title, description }> }
  - Gallery: { images: Array<{ url, alt }> }
  - Contact: { heading, subheading }
  
  Allowed themes: minimal, neo-brutal, dark-neon, pastel, luxury, retro.

  When the user asks to create or update a page, use the 'updatePage' tool to provide the new structure.
  Always explain what you are doing in the text response.`,
  tools: {
    updatePage: updatePageTool,
  },
})

export type VibeAgentUIMessage = InferAgentUIMessage<typeof vibeAgent>
