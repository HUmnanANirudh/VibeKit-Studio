import { createOpenRouter } from '@openrouter/ai-sdk-provider'

export const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY || '',
})

export const defaultModel = openrouter('google/gemini-2.0-flash-001')
