import { createOpenRouter } from '@openrouter/ai-sdk-provider'

export const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY || '',
})

export const MODELS = [
  'stepfun/step-3.5-flash:free',
  'nvidia/nemotron-3-super-120b-a12b:free',
  'arcee-ai/trinity-large-preview:free',
  'qwen/qwen3.6-plus:free',
  'minimax/minimax-m2.5:free',
  'qwen/qwen3-coder:free',
  'qwen/qwen3-next-80b-a3b-instruct:free',
  'openai/gpt-oss-120b:free',
  'openai/gpt-oss-20b:free',
  'google/gemma-3-27b-it:free',
  'google/gemma-3-4b-it:free',
  'google/gemma-3n-e4b-it:free',
  'google/gemma-3n-e2b-it:free',
  'google/gemma-3-12b-it:free',
]

export const defaultModel = openrouter('openrouter/auto')
