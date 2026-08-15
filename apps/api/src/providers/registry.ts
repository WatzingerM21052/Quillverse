import type { AiProviderAdapter, ProviderId } from './types';
import { geminiAdapter } from './gemini';
import { openaiAdapter } from './openai';
import { anthropicAdapter } from './anthropic';

export const PROVIDER_ADAPTERS: Record<ProviderId, AiProviderAdapter> = {
  gemini: geminiAdapter,
  openai: openaiAdapter,
  anthropic: anthropicAdapter,
};
