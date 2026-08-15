import type { AiProviderAdapter, ModelInfo, ValidationResult } from './types';

export const openaiAdapter: AiProviderAdapter = {
  providerId: 'openai',

  async validateCredential(apiKey: string): Promise<ValidationResult> {
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (response.ok) return { ok: true };
    return { ok: false, message: 'The API key could not be authenticated.' };
  },

  async listModels(apiKey: string): Promise<ModelInfo[]> {
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (!response.ok) return [];

    const body = (await response.json()) as { data?: Array<{ id: string }> };
    return (body.data ?? []).map((model) => ({
      provider: 'openai',
      id: model.id,
      displayName: model.id,
    }));
  },
};
