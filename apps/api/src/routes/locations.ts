import { Hono } from 'hono';
import { getSimulationState } from '../db/simulation-repository';
import { generatePortraitImage } from '../services/image-generation';

export const locationsRoute = new Hono<{ Bindings: Env }>();

const EXTENSION_BY_CONTENT_TYPE: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
};

/**
 * §19 (issue) / addendum-v1.1 A15 Ortsbibliothek — same generation pipeline
 * as portraits (§163-164), pointed at Location entities instead of
 * Character. No reference-lock here: a location doesn't have an identity
 * to preserve across regenerations the way a face does, so this is always
 * a plain (non-referenced) generation.
 */
locationsRoute.post('/:id/locations/:locationId/image', async (c) => {
  const simulationId = c.req.param('id');
  const locationId = c.req.param('locationId');

  const body = await c.req.json<{ prompt?: string }>().catch(() => null);
  const prompt = body?.prompt?.trim();
  if (!prompt) {
    return c.json({ error: 'prompt is required.' }, 400);
  }

  const location = await c.env.DB.prepare('SELECT id FROM locations WHERE id = ? AND simulation_id = ?')
    .bind(locationId, simulationId)
    .first<{ id: string }>();
  if (!location) {
    return c.json({ error: 'Unknown location id.' }, 404);
  }

  const image = await generatePortraitImage(c.env, prompt);
  if (!image) {
    return c.json({ error: 'Bild konnte weder über Gemini noch über den Fallback erzeugt werden.' }, 502);
  }

  const extension = EXTENSION_BY_CONTENT_TYPE[image.contentType] ?? 'jpg';
  const key = `locations/${simulationId}/${locationId}/${crypto.randomUUID()}.${extension}`;
  await c.env.ASSETS.put(key, image.bytes, { httpMetadata: { contentType: image.contentType } });

  await c.env.DB.prepare('UPDATE locations SET base_asset = ? WHERE id = ? AND simulation_id = ?')
    .bind(`/api/assets/${key}`, locationId, simulationId)
    .run();

  const state = await getSimulationState(c.env.DB, simulationId);
  return c.json({ state, provider: image.provider });
});
