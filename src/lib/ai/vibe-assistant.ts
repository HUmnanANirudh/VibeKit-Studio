import { ToolLoopAgent, tool, type InferAgentUIMessage } from 'ai'
import { openrouter } from '#/lib/ai/openrouter'
import { z } from 'zod'
import { internalUpdatePage } from '#/lib/pages.functions'
import { transformAssistantUpdate } from './transformer'

const PrimitiveType = z.union([z.string(), z.number(), z.boolean(), z.null()]);

// Helper schema for Props as Key-Value array
const PropEntrySchema = z.object({ key: z.string(), value: PrimitiveType });

const BlockSchema = z.object({
  type: z.string(),
  props: z.array(PropEntrySchema).describe('Array of key-value pairs representing React props'),
});

export const updatePageTool = tool({
  description: 'Apply the generated design system and block structure to the page.',
  inputSchema: z.object({
     id: z.string().describe('The page ID to update'),
     userId: z.string().describe('The user ID for security verification'),
     theme: z.array(z.object({
       category: z.string(),
       tokens: z.array(PropEntrySchema)
     })).optional().describe('Design tokens grouped by category'),
     blocks: z.array(BlockSchema),
     zones: z.array(z.object({
       zoneId: z.string().describe('Must match blockId:zoneName format'),
       blocks: z.array(BlockSchema)
     })).optional(),
     interactions: z.object({
       hoverEffects: z.boolean(),
       scrollAnimations: z.boolean(),
     }).optional(),
  }),
  execute: async (args) => {
    // Transform tool's KV-pair formatting back to Page format
    const transformed = transformAssistantUpdate(args);

    // PERSISTENCE! (Actual server-side update)
    try {
      const updated = await internalUpdatePage(args.id, args.userId, transformed);
      // Return the updated page so the client can sync state if needed
      return updated; 
    } catch (err: any) {
      console.error('AI Tool update failed:', err);
      // Still return the data so the UI can at least reflect it without a page reload if needed
      return transformed;
    }
  },
})

export const vibeAgent = new ToolLoopAgent({
  model: openrouter('openrouter/auto'),
  instructions: `You are an AI-powered Website Builder + Design System Generator.
  The user is chatting with you to build a website layout dynamically.

  ### 🧩 COMPONENT ASSEMBLY
  Use 5 primitive components: Section, Flex, Text, Image, Button.
  You MUST structure the JSON exactly as expected in the tool call input schema.
  
  Example:
  \`\`\`json
  {
    "theme": [{ "category": "colors", "tokens": [{ "key": "background", "value": "#fdfbf7" }] }],
    "blocks": [{ "type": "Section", "props": [{ "key": "id", "value": "hero-sec" }, { "key": "background", "value": "surface" }] }],
    "zones": [
      {
        "zoneId": "hero-sec:content",
        "blocks": [
          { "type": "Text", "props": [{ "key": "id", "value": "hero-text" }, { "key": "tag", "value": "h1" }, { "key": "content", "value": "Welcome" }] }
        ]
      }
    ]
  }
  \`\`\`
  
  ### ✅ FINAL OUTPUT
  Call the \`updatePage\` tool to update the layout. DO NOT output raw JSON in your text response.`,
  tools: {
    updatePage: updatePageTool,
  },
})

export type VibeAgentUIMessage = InferAgentUIMessage<typeof vibeAgent>
