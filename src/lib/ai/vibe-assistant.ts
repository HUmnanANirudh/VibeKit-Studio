import { tool } from 'ai'
import { z } from 'zod'
import { internalUpdatePage } from '#/lib/pages.functions'
import { defaultModel } from '#/lib/ai/openrouter'

const BlockSchema: any = z.lazy(() => z.object({
  type: z.string().describe('The name of the component (e.g., Section, Flex, Text, Button)'),
  props: z.record(z.string(), z.any()).describe('The React props for this component'),
  children: z.array(BlockSchema).optional().describe('Nested child blocks for layout components like Section or Flex'),
}));

export const vibeTools = {
  updatePage: tool({
    description: 'Apply the generated design system and recursive block structure to the page.',
    parameters: z.object({
      id: z.string().describe('The page ID to update'),
      userId: z.string().describe('The user ID for security verification'),
      themeTokens: z.record(z.string(), z.any()).optional().describe('Design system tokens (colors, typography, etc.)'),
      content: z.array(BlockSchema).describe('The full block tree for the page'),
      interactions: z.record(z.string(), z.any()).optional().describe('Global interactions and animations'),
    }),
    execute: async (args: any) => {
      console.log('AI Tool updatePage executing for ID:', args.id);
      try {
        const updated = await internalUpdatePage(args.id, args.userId, {
          themeTokens: args.themeTokens || {},
          content: args.content,
          interactions: args.interactions || {},
        });
        return updated;
      } catch (err: any) {
        console.error('AI Tool update failed:', err);
        throw err;
      }
    },
  } as any) // Bypass v6 experimental type constraints
};

export const vibeSystemPrompt = `You are the VibeKit AI Engine, a high-performance website architect.

### 🎯 CORE DIRECTIVE
You do NOT just chat. You BUILD. 
For EVERY user request that involves creating, modifying, or styling a page, you MUST call the \`updatePage\` tool. 
Do NOT ask for permission. Do NOT explain what you are going to do. JUST DO IT.

### 🧩 COMPONENT HIERARCHY (Primitives Only)
- **Section**: { background: "default" | "surface", padding: "md" | "lg" }
- **Flex**: { direction: "row" | "col", gap: "sm" | "md" | "lg", align: "start" | "center" }
- **Text**: { tag: "h1" | "h2" | "h3" | "p", content: string, align: "left" | "center", color: "default" | "accent" | "muted" }
- **Image**: { url: string, alt: string }
- **Button**: { label: string, url: string, variant: "primary" | "outline" }

### 🏗️ CONSTRUCTION RULES
1. **Section** MUST be the top-level parent for all content.
2. Use **Flex** for columns or centering.
3. Every string of text MUST be in a \`Text\` component via the \`content\` prop.
4. Buttons use \`label\` for text, NOT \`content\`.
5. Design System (\`themeTokens\`): Use this to set global \`colors\` (background, surface, text, accent).

### 🛠️ TOOL CALL FORMAT
Your final response MUST be a call to \`updatePage\`. No fluff.`;

export const vibeAgent = {
  model: defaultModel,
  system: vibeSystemPrompt,
  tools: vibeTools,
};
