import type { AiProviderAdapter, ModelInfo, ValidationResult } from './types';
import { stripToJsonObject } from './response-text';

const ANTHROPIC_VERSION = '2023-06-01';
const TEXT_MODEL = 'claude-sonnet-4-5';

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

  /**
   * Structurally complete, unverified against a real key (none available).
   * No native forced-JSON mode on this API version — relies on the prompt's
   * own "respond with ONE JSON object" instruction plus stripToJsonObject()
   * as a safety net.
   */
  async generateStory(apiKey: string, contextText: string): Promise<string> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': apiKey, 'anthropic-version': ANTHROPIC_VERSION, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: TEXT_MODEL,
        max_tokens: 4096,
        messages: [{ role: 'user', content: contextText }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic generateStory failed (${response.status}): ${await response.text()}`);
    }

    const body = (await response.json()) as { content?: Array<{ type: string; text?: string }> };
    const text = body.content?.find((block) => block.type === 'text')?.text;
    if (!text) {
      throw new Error('Anthropic generateStory: no text in response.');
    }

    return stripToJsonObject(text);
  },
};
