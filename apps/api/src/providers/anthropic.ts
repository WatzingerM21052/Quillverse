import type { AiProviderAdapter, ModelInfo, ValidationResult } from './types';

const ANTHROPIC_VERSION = '2023-06-01';

export const anthropicAdapter: AiProviderAdapter = {
  providerId: 'anthropic',

  async validateCredential(apiKey: string): Promise<ValidationResult> {
    const response = await fetch('https://api.anthropic.com/v1/models', {
      headers: { 'x-api-key': apiKey, 'anthropic-version': ANTHROPIC_VERSION },
    });
    if (response.ok) return { ok: true };
    return { ok: false, message: 'The API key could not be authenticated.' };
  },

  async listModels(apiKey: string): Promise<ModelInfo[]> {
    const response = await fetch('https://api.anthropic.com/v1/models', {
      headers: { 'x-api-key': apiKey, 'anthropic-version': ANTHROPIC_VERSION },
    });
    if (!response.ok) return [];

    const body = (await response.json()) as { data?: Array<{ id: string; display_name?: string }> };
    return (body.data ?? []).map((model) => ({
      provider: 'anthropic',
      id: model.id,
      displayName: model.display_name ?? model.id,
    }));
  },
};
