import type { AiProviderAdapter, ModelInfo, ValidationResult } from './types';

export const geminiAdapter: AiProviderAdapter = {
  providerId: 'gemini',

  async validateCredential(apiKey: string): Promise<ValidationResult> {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    if (response.ok) return { ok: true };
    return { ok: false, message: 'The API key could not be authenticated.' };
  },

  async listModels(apiKey: string): Promise<ModelInfo[]> {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    if (!response.ok) return [];

    const body = (await response.json()) as { models?: Array<{ name: string; displayName?: string }> };
    return (body.models ?? []).map((model) => ({
      provider: 'gemini',
      id: model.name.replace(/^models\//, ''),
      displayName: model.displayName ?? model.name,
    }));
  },
};
