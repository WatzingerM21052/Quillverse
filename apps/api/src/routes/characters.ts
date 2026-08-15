import { Hono } from 'hono';
import { getSimulationState } from '../db/simulation-repository';
import { generatePortraitImage } from '../services/image-generation';

export const charactersRoute = new Hono<{ Bindings: Env }>();

const EXTENSION_BY_CONTENT_TYPE: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
};

/**
 * §163-164 — generates a portrait for one character from a caller-supplied
 * prompt (the frontend assembles it from the character's AppearanceProfile
 * and the world pack's visualStyleBible; this endpoint stays content-agnostic).
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

  const image = await generatePortraitImage(c.env, prompt);
  if (!image) {
    return c.json({ error: 'Portrait konnte weder über Gemini noch über den Fallback erzeugt werden.' }, 502);
  }

  const extension = EXTENSION_BY_CONTENT_TYPE[image.contentType] ?? 'jpg';
  const key = `portraits/${simulationId}/${characterId}/${crypto.randomUUID()}.${extension}`;
  await c.env.ASSETS.put(key, image.bytes, { httpMetadata: { contentType: image.contentType } });

  const visualState = { ...JSON.parse(character.visual_state_json), basePortrait: `/api/assets/${key}` };

  await c.env.DB.prepare('UPDATE characters SET visual_state_json = ? WHERE id = ? AND simulation_id = ?')
    .bind(JSON.stringify(visualState), characterId, simulationId)
    .run();

  const state = await getSimulationState(c.env.DB, simulationId);
  return c.json({ state, provider: image.provider });
});
