import { Hono } from 'hono';
import { getSimulationState } from '../db/simulation-repository';
import { generatePortraitImage } from '../services/image-generation';

export const charactersRoute = new Hono<{ Bindings: Env }>();

const EXTENSION_BY_CONTENT_TYPE: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
};

const PLACEHOLDER_SCHEME = 'asset://';

/**
 * §163-164, §166 — generates a portrait for one character from a
 * caller-supplied prompt (the frontend assembles it from the character's
 * AppearanceProfile and the world pack's visualStyleBible; this endpoint
 * stays content-agnostic). If the character's appearance is locked
 * (§166), the current basePortrait is fetched from R2 and passed as an
 * img2img reference so the new variant stays visually consistent instead
 * of generating an unrelated face.
 */
charactersRoute.post('/:id/characters/:characterId/portrait', async (c) => {
  const simulationId = c.req.param('id');
  const characterId = c.req.param('characterId');

  const body = await c.req.json<{ prompt?: string }>().catch(() => null);
  const prompt = body?.prompt?.trim();
  if (!prompt) {
    return c.json({ error: 'prompt is required.' }, 400);
  }

  const character = await c.env.DB.prepare('SELECT visual_state_json FROM characters WHERE id = ? AND simulation_id = ?')
    .bind(characterId, simulationId)
    .first<{ visual_state_json: string }>();
  if (!character) {
    return c.json({ error: 'Unknown character id.' }, 404);
  }

  const visualState = JSON.parse(character.visual_state_json);
  const referenceImage = await loadReferenceImage(c.env, visualState);

  let image = await generatePortraitImage(c.env, prompt, referenceImage);
  // §166 escape hatch: img2img capacity can be genuinely unavailable
  // (live-observed: Cloudflare's shared SD1.5 img2img capacity, not
  // something retries fix). Rather than a dead end for a locked
  // character, fall through to a plain generation and say so — the lock
  // itself is untouched, so the next attempt still tries img2img first.
  let referenceFallback = false;
  if (!image && referenceImage) {
    image = await generatePortraitImage(c.env, prompt);
    referenceFallback = image !== null;
  }

  if (!image) {
    const message = referenceImage
      ? 'Portrait konnte mit gesperrtem Aussehen nicht erzeugt werden.'
      : 'Portrait konnte weder über Gemini noch über den Fallback erzeugt werden.';
    return c.json({ error: message }, 502);
  }

  const extension = EXTENSION_BY_CONTENT_TYPE[image.contentType] ?? 'jpg';
  const key = `portraits/${simulationId}/${characterId}/${crypto.randomUUID()}.${extension}`;
  await c.env.ASSETS.put(key, image.bytes, { httpMetadata: { contentType: image.contentType } });

  const nextVisualState = { ...visualState, basePortrait: `/api/assets/${key}` };

  await c.env.DB.prepare('UPDATE characters SET visual_state_json = ? WHERE id = ? AND simulation_id = ?')
    .bind(JSON.stringify(nextVisualState), characterId, simulationId)
    .run();

  const state = await getSimulationState(c.env.DB, simulationId);
  return c.json({ state, provider: image.provider, referenceFallback });
});

/** §166 Character Reference Lock — makes the current portrait the reference for future variants. */
charactersRoute.post('/:id/characters/:characterId/portrait/lock', async (c) => {
  const simulationId = c.req.param('id');
  const characterId = c.req.param('characterId');

  const character = await c.env.DB.prepare('SELECT visual_state_json FROM characters WHERE id = ? AND simulation_id = ?')
    .bind(characterId, simulationId)
    .first<{ visual_state_json: string }>();
  if (!character) {
    return c.json({ error: 'Unknown character id.' }, 404);
  }

  const visualState = JSON.parse(character.visual_state_json);
  if (!visualState.basePortrait || (visualState.basePortrait as string).startsWith(PLACEHOLDER_SCHEME)) {
    return c.json({ error: 'Kein Portrait vorhanden, das gesperrt werden könnte.' }, 400);
  }

  const nextVisualState = { ...visualState, portraitLocked: true };
  await c.env.DB.prepare('UPDATE characters SET visual_state_json = ? WHERE id = ? AND simulation_id = ?')
    .bind(JSON.stringify(nextVisualState), characterId, simulationId)
    .run();

  const state = await getSimulationState(c.env.DB, simulationId);
  return c.json({ state });
});

charactersRoute.delete('/:id/characters/:characterId/portrait/lock', async (c) => {
  const simulationId = c.req.param('id');
  const characterId = c.req.param('characterId');

  const character = await c.env.DB.prepare('SELECT visual_state_json FROM characters WHERE id = ? AND simulation_id = ?')
    .bind(characterId, simulationId)
    .first<{ visual_state_json: string }>();
  if (!character) {
    return c.json({ error: 'Unknown character id.' }, 404);
  }

  const nextVisualState = { ...JSON.parse(character.visual_state_json), portraitLocked: false };
  await c.env.DB.prepare('UPDATE characters SET visual_state_json = ? WHERE id = ? AND simulation_id = ?')
    .bind(JSON.stringify(nextVisualState), characterId, simulationId)
    .run();

  const state = await getSimulationState(c.env.DB, simulationId);
  return c.json({ state });
});

/** Fetches the current portrait from R2 as an img2img reference — only when locked and a real portrait exists. */
async function loadReferenceImage(env: Env, visualState: Record<string, unknown>): Promise<ArrayBuffer | undefined> {
  if (!visualState.portraitLocked) return undefined;

  const basePortrait = visualState.basePortrait as string | undefined;
  if (!basePortrait || basePortrait.startsWith(PLACEHOLDER_SCHEME)) return undefined;

  const key = basePortrait.replace(/^\/api\/assets\//, '');
  const object = await env.ASSETS.get(key);
  if (!object) return undefined;

  return object.arrayBuffer();
}
