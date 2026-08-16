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

  /**
   * B25-28 — `/v1/models` has no capability metadata, so this is a heuristic
   * id-pattern filter down to chat-capable gpt models, excluding
   * whisper/tts/dall-e/embedding/moderation ids that would otherwise clutter
   * a "pick a story model" dropdown with models that can't do this job.
   */
  async listModels(apiKey: string): Promise<ModelInfo[]> {
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (!response.ok) return [];

    const body = (await response.json()) as { data?: Array<{ id: string }> };
    return (body.data ?? [])
      .filter((model) => /^gpt-/i.test(model.id) && !/whisper|tts|embedding|moderation|realtime|audio|search|transcribe/i.test(model.id))
      .map((model) => ({
        provider: 'openai',
        id: model.id,
        displayName: model.id,
      }));
  },

  /** Structurally complete, unverified against a real key (none available). */
  async generateStory(apiKey: string, contextText: string, modelId?: string): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: modelId ?? TEXT_MODEL,
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
