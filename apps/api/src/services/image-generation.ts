import { getDecryptedCredential } from '../routes/ai-providers';

export interface GeneratedImage {
  bytes: ArrayBuffer;
  contentType: string;
  provider: 'gemini' | 'pollinations';
}

/**
 * §163 Image Provider Unabhängig — a separate concern from the story
 * provider, allowed to fail/fall back on its own. Prefers Gemini (reuses the
 * existing story credential, no separate BYOK entry — see plan doc) for
 * reference-consistent quality; falls through to the keyless Pollinations
 * API so portraits work with zero API keys, same principle as Manual Relay.
 */
export async function generatePortraitImage(env: Env, prompt: string): Promise<GeneratedImage | null> {
  const geminiKey = await getDecryptedCredential(env, 'gemini');
  if (geminiKey) {
    const viaGemini = await tryGemini(geminiKey, prompt);
    if (viaGemini) return viaGemini;
  }

  return tryPollinations(prompt);
}

interface GeminiModelsResponse {
  models?: Array<{ name: string; supportedGenerationMethods?: string[] }>;
}

interface GeminiGenerateContentResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ inlineData?: { mimeType: string; data: string } }>;
    };
  }>;
}

/**
 * Structurally complete, unverified against a real key (none available this
 * session — see plan doc). Picks an image-capable model from the live
 * models list instead of a hardcoded id, since the exact current model name
 * and request shape (native image output vs. Imagen's separate :predict
 * endpoint) isn't something to freeze into a constant.
 */
async function tryGemini(apiKey: string, prompt: string): Promise<GeneratedImage | null> {
  try {
    const modelsResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    if (!modelsResponse.ok) return null;

    const modelsBody = (await modelsResponse.json()) as GeminiModelsResponse;
    const imageModel = (modelsBody.models ?? []).find(
      (model) => /image/i.test(model.name) && (model.supportedGenerationMethods ?? []).includes('generateContent'),
    );
    if (!imageModel) return null;

    const modelId = imageModel.name.replace(/^models\//, '');
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseModalities: ['IMAGE'] },
        }),
      },
    );
    if (!response.ok) return null;

    const body = (await response.json()) as GeminiGenerateContentResponse;
    const inlineData = body.candidates?.[0]?.content?.parts?.find((part) => part.inlineData)?.inlineData;
    if (!inlineData) return null;

    return {
      bytes: base64ToArrayBuffer(inlineData.data),
      contentType: inlineData.mimeType,
      provider: 'gemini',
    };
  } catch {
    return null;
  }
}

async function tryPollinations(prompt: string): Promise<GeneratedImage | null> {
  try {
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=768&height=1024&nologo=true`;
    const response = await fetch(url);
    if (!response.ok) return null;

    return {
      bytes: await response.arrayBuffer(),
      contentType: response.headers.get('content-type') ?? 'image/jpeg',
      provider: 'pollinations',
    };
  } catch {
    return null;
  }
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}
