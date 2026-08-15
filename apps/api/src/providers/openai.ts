import type { AiProviderAdapter, ModelInfo, ValidationResult } from './types';
import { stripToJsonObject } from './response-text';

const TEXT_MODEL = 'gpt-4o-mini';

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

  /** Structurally complete, unverified against a real key (none available). */
  async generateStory(apiKey: string, contextText: string): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: TEXT_MODEL,
        messages: [{ role: 'user', content: contextText }],
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI generateStory failed (${response.status}): ${await response.text()}`);
    }

    const body = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const text = body.choices?.[0]?.message?.content;
    if (!text) {
      throw new Error('OpenAI generateStory: no content in response.');
    }

    return stripToJsonObject(text);
  },
};
