import type { AiProviderAdapter, ModelInfo, ValidationResult } from './types';
import { stripToJsonObject } from './response-text';

interface GeminiModelListEntry {
  name: string;
  supportedGenerationMethods?: string[];
}

/**
 * Model ids get deprecated/renamed over time (found live: a previously-valid
 * "gemini-2.5-flash" id started 404ing with "no longer available to new
 * users") — pick a current text-capable model from the live list instead of
 * trusting a hardcoded id to stay valid, same reasoning as the image adapter.
 */
async function findTextModel(apiKey: string): Promise<string | null> {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
  if (!response.ok) return null;

  const body = (await response.json()) as { models?: GeminiModelListEntry[] };
  const candidates = (body.models ?? []).filter(
    (model) =>
      (model.supportedGenerationMethods ?? []).includes('generateContent') && !/image|embed|vision|tts|aqa/i.test(model.name),
  );

  if (candidates.length === 0) return null;

  // Prefer the "-latest" alias Google publishes specifically so callers don't
  // have to track version numbers (found live: the newest-looking versioned
  // name in the list, gemini-2.5-flash, was actually the oldest one still
  // exposed and 404s as "no longer available to new users" — version-number
  // sorting is not a safe heuristic here).
  const preferred =
    candidates.find((model) => /gemini-flash-latest/i.test(model.name)) ??
    candidates.find((model) => /flash-latest/i.test(model.name)) ??
    candidates.find((model) => /flash/i.test(model.name)) ??
    candidates[0];
  return preferred ? preferred.name.replace(/^models\//, '') : null;
}

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

  async generateStory(apiKey: string, contextText: string): Promise<string> {
    const model = await findTextModel(apiKey);
    if (!model) {
      throw new Error('Gemini generateStory: no text-capable model found.');
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: contextText }] }],
          generationConfig: { responseMimeType: 'application/json' },
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`Gemini generateStory failed (${response.status}): ${await response.text()}`);
    }

    const body = (await response.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };
    const text = body.candidates?.[0]?.content?.parts?.map((part) => part.text ?? '').join('');
    if (!text) {
      throw new Error('Gemini generateStory: no text in response.');
    }

    return stripToJsonObject(text);
  },
};
