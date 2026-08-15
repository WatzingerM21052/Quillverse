import { Hono } from 'hono';
import { getSimulationState } from '../db/simulation-repository';

export const gmRoute = new Hono<{ Bindings: Env }>();

/**
 * Manual state correction (§152) — e.g. fixing a wrong NPC location. Applied
 * directly (no stateVersion check, unlike a turn — this is an out-of-band GM
 * fix, not narrative progress) and logged as its own event (§152, reusing
 * causality_log as the "admin event" record).
 */
gmRoute.post('/:id/gm/correct-location', async (c) => {
  const simulationId = c.req.param('id');
  const body = await c.req.json<{ characterId?: string; newLocationId?: string | null; reason?: string }>().catch(() => null);

  const characterId = body?.characterId;
  const reason = body?.reason?.trim();
  if (!characterId || !reason) {
    return c.json({ error: 'characterId and reason are required.' }, 400);
  }

  const newLocationId = body?.newLocationId ?? null;

  if (newLocationId) {
    const location = await c.env.DB.prepare('SELECT id FROM locations WHERE id = ? AND simulation_id = ?')
      .bind(newLocationId, simulationId)
      .first();
    if (!location) {
      return c.json({ error: 'Unknown location id.' }, 400);
    }
  }

  const character = await c.env.DB.prepare('SELECT name, location_id FROM characters WHERE id = ? AND simulation_id = ?')
    .bind(characterId, simulationId)
    .first<{ name: string; location_id: string | null }>();
  if (!character) {
    return c.json({ error: 'Unknown character id.' }, 404);
  }

  await c.env.DB.batch([
    c.env.DB.prepare('UPDATE characters SET location_id = ? WHERE id = ? AND simulation_id = ?').bind(
      newLocationId,
      characterId,
      simulationId,
    ),
    c.env.DB.prepare(
      `INSERT INTO causality_log (id, simulation_id, event, cause, direct_consequences_json, secondary_consequences_json, long_term_consequences_json, date)
       VALUES (?, ?, ?, ?, '[]', '[]', '[]', datetime('now'))`,
    ).bind(
      crypto.randomUUID(),
      simulationId,
      `GM-Korrektur: Ort von ${character.name} geändert (${character.location_id ?? 'unbekannt'} -> ${newLocationId ?? 'unbekannt'})`,
      reason,
    ),
  ]);

  const state = await getSimulationState(c.env.DB, simulationId);
  return c.json({ state });
});
