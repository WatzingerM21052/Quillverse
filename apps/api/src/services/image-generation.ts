import { getDecryptedCredential } from '../routes/ai-providers';

export interface GeneratedImage {
  bytes: ArrayBuffer;
  contentType: string;
  provider: 'imagen' | 'gemini' | 'pollinations' | 'cloudflare';
}

/**
 * §163 Image Provider Unabhängig — a separate concern from the story
 * provider, allowed to fail/fall back on its own. Reuses the existing
 * Gemini story credential (no separate BYOK entry — see plan doc).
 *
 * Order matters and is based on live-verified quota, not capability order:
 * Imagen has a real free daily quota (confirmed: 25/day on this account,
 * separate quota bucket from text). Gemini's *native* multimodal image
 * models ("Nano Banana") showed 0/0/0 quota live on this account — kept as
 * a second attempt since that's account-specific and may differ for other
 * users, not because it's expected to work here. Pollinations (keyless) is
 * the primary always-available fallback so portraits work with zero API
 * keys. Cloudflare Workers AI is a last-resort fourth attempt — same
 * Cloudflare account this Worker already runs on (no separate signup), free
 * daily neuron allowance, kept behind Pollinations since Pollinations'
 * keyless flux endpoint has never actually failed in practice; this exists
 * as extra resilience if that ever changes, not because it's expected to
 * fire under normal operation.
 */
export async function generatePortraitImage(env: Env, prompt: string): Promise<GeneratedImage | null> {
  const geminiKey = await getDecryptedCredential(env, 'gemini');
  if (geminiKey) {
    const viaImagen = await tryImagen(geminiKey, prompt);
    if (viaImagen) return viaImagen;

    const viaGemini = await tryGeminiNative(geminiKey, prompt);
    if (viaGemini) return viaGemini;
  }

  const viaPollinations = await tryPollinations(prompt);
  if (viaPollinations) return viaPollinations;

  return tryCloudflareWorkersAI(env, prompt);
}

interface ImagenPredictResponse {
  predictions?: Array<{ bytesBase64Encoded?: string; mimeType?: string }>;
}

/**
 * Doc-verified request/response shape (ai.google.dev/gemini-api/docs/imagen,
 * fetched live via context7 rather than recalled) — notably `x-goog-api-key`
 * as a header, not `?key=` as a query param like the other Gemini calls in
 * this file use, and `instances`/`parameters` (Vertex-style predict), not
 * `contents` (generateContent-style).
 *
 * Model id is discovered live, not hardcoded — same lesson as the text
 * adapter, found again the same way: the doc-current
 * `imagen-4.0-generate-001` 404'd live as "no longer available to new
 * users" despite being both the officially documented current model name
 * *and* present in this account's own live models list. Discovery alone
 * wasn't enough this time (unlike text, where the first "-latest" alias
 * tried just worked) — this tries every imagen-capable candidate in
 * preference order (standard quality first, then whatever else is listed)
 * until one actually succeeds, rather than picking one and giving up.
 */
async function tryImagen(apiKey: string, prompt: string): Promise<GeneratedImage | null> {
  const modelsResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`).catch(
    () => null,
  );
  if (!modelsResponse?.ok) {
    console.error('Imagen: models list failed', modelsResponse?.status);
    return null;
  }

  const modelsBody = (await modelsResponse.json()) as GeminiModelsResponse;
  const imagenModels = (modelsBody.models ?? []).filter(
    (model) => /imagen/i.test(model.name) && (model.supportedGenerationMethods ?? []).includes('predict'),
  );
  // Standard quality preferred over -fast/-ultra (portraits are generated
  // occasionally, not per-turn) but every candidate gets a real attempt.
  const orderedCandidates = [
    ...imagenModels.filter((m) => /imagen-4\.0-generate/i.test(m.name)),
    ...imagenModels.filter((m) => !/imagen-4\.0-generate/i.test(m.name)),
  ];

  if (orderedCandidates.length === 0) {
    console.error(
      'Imagen: no imagen model found among',
      (modelsBody.models ?? []).map((m) => m.name),
    );
    return null;
  }

  for (const candidate of orderedCandidates) {
    const modelId = candidate.name.replace(/^models\//, '');
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelId}:predict`, {
        method: 'POST',
        headers: { 'x-goog-api-key': apiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instances: [{ prompt }],
          parameters: { sampleCount: 1 },
        }),
      });

      if (!response.ok) {
        console.error('Imagen: predict failed', modelId, response.status, await response.text());
        continue;
      }

      const body = (await response.json()) as ImagenPredictResponse;
      const prediction = body.predictions?.[0];
      if (!prediction?.bytesBase64Encoded) {
        console.error('Imagen: no bytesBase64Encoded in response', modelId, JSON.stringify(body).slice(0, 500));
        continue;
      }

      return {
        bytes: base64ToArrayBuffer(prediction.bytesBase64Encoded),
        contentType: prediction.mimeType ?? 'image/png',
        provider: 'imagen',
      };
    } catch (err) {
      console.error('Imagen: threw', modelId, err);
    }
  }

  return null;
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
 * Structurally complete; live-verified this session to reach Gemini
 * correctly (auth, model discovery, request/response shape all fine) but
 * RESOURCE_EXHAUSTED with `limit: 0` on this account's free tier — kept as
 * a second attempt behind Imagen, not the primary path, for exactly that
 * reason. Picks an image-capable model from the live models list instead of
 * a hardcoded id, since the exact current model name and request shape
 * (native image output vs. Imagen's separate :predict endpoint) isn't
 * something to freeze into a constant.
 */
async function tryGeminiNative(apiKey: string, prompt: string): Promise<GeneratedImage | null> {
  try {
    const modelsResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    if (!modelsResponse.ok) {
      console.error('Gemini image: models list failed', modelsResponse.status, await modelsResponse.text());
      return null;
    }

    const modelsBody = (await modelsResponse.json()) as GeminiModelsResponse;
    const imageModel = (modelsBody.models ?? []).find(
      (model) => /image/i.test(model.name) && (model.supportedGenerationMethods ?? []).includes('generateContent'),
    );
    if (!imageModel) {
      console.error(
        'Gemini image: no image-capable model found among',
        (modelsBody.models ?? []).map((m) => m.name),
      );
      return null;
    }

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
    if (!response.ok) {
      console.error('Gemini image: generateContent failed', modelId, response.status, await response.text());
      return null;
    }

    const body = (await response.json()) as GeminiGenerateContentResponse;
    const inlineData = body.candidates?.[0]?.content?.parts?.find((part) => part.inlineData)?.inlineData;
    if (!inlineData) {
      console.error('Gemini image: no inlineData in response', JSON.stringify(body).slice(0, 500));
      return null;
    }

    return {
      bytes: base64ToArrayBuffer(inlineData.data),
      contentType: inlineData.mimeType,
      provider: 'gemini',
    };
  } catch (err) {
    console.error('Gemini image: threw', err);
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

/**
 * Doc-verified request/response shape (developers.cloudflare.com/workers-ai,
 * fetched live via context7 rather than recalled): `env.AI.run()` with the
 * flux-1-schnell model id, returns `{ image: <base64 JPEG> }` directly (no
 * candidates/predictions wrapper like the Gemini-family calls above).
 */
async function tryCloudflareWorkersAI(env: Env, prompt: string): Promise<GeneratedImage | null> {
  try {
    const response = await env.AI.run('@cf/black-forest-labs/flux-1-schnell', { prompt, steps: 8 });
    if (!response.image) {
      console.error('Cloudflare Workers AI: no image in response', JSON.stringify(response).slice(0, 500));
      return null;
    }

    return {
      bytes: base64ToArrayBuffer(response.image),
      contentType: 'image/jpeg',
      provider: 'cloudflare',
    };
  } catch (err) {
    console.error('Cloudflare Workers AI: threw', err);
    return null;
  }
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}
