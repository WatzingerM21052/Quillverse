import { Hono } from 'hono';
import {
  getSimulationState,
  addPlayerNote,
  removePlayerNote,
  addFavoriteQuote,
  removeFavoriteQuote,
  getLastNarration,
} from '../db/simulation-repository';
import { createSavepoint } from '../db/savepoints';

export const journalRoute = new Hono<{ Bindings: Env }>();

/** §195 BOOKMARK MOMENT — "Remember this moment" turns a story beat into an IMPORTANT Memory. */
journalRoute.post('/:id/bookmark', async (c) => {
  const simulationId = c.req.param('id');
  const body = await c.req.json<{ text?: string }>().catch(() => null);
  const text = body?.text?.trim();
  if (!text) {
    return c.json({ error: 'text is required.' }, 400);
  }

  const state = await getSimulationState(c.env.DB, simulationId);
  if (!state) {
    return c.json({ error: 'Simulation not found.' }, 404);
  }

  const id = crypto.randomUUID();
  await c.env.DB.prepare(
    `INSERT INTO memories (id, simulation_id, entity_ids_json, world_date, type, importance, fact, interpretation_json, status, reach, fading, tags_json)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      id,
      simulationId,
      JSON.stringify([state.playerId]),
      state.currentWorldDate,
      'bookmark',
      'important',
      text,
      '{}',
      'fact',
      'personal',
      'permanent',
      JSON.stringify(['bookmark']),
    )
    .run();

  const nextState = await getSimulationState(c.env.DB, simulationId);
  return c.json({ state: nextState });
});

/** §194 OPTIONAL PLAYER NOTES — private, never simulation truth. */
journalRoute.post('/:id/notes', async (c) => {
  const simulationId = c.req.param('id');
  const body = await c.req.json<{ text?: string }>().catch(() => null);
  const text = body?.text?.trim();
  if (!text) {
    return c.json({ error: 'text is required.' }, 400);
  }

  const state = await getSimulationState(c.env.DB, simulationId);
  if (!state) {
    return c.json({ error: 'Simulation not found.' }, 404);
  }

  await addPlayerNote(c.env.DB, simulationId, text, state.currentWorldDate);
  const nextState = await getSimulationState(c.env.DB, simulationId);
  return c.json({ state: nextState });
});

journalRoute.delete('/:id/notes/:noteId', async (c) => {
  const simulationId = c.req.param('id');
  await removePlayerNote(c.env.DB, simulationId, c.req.param('noteId'));
  const state = await getSimulationState(c.env.DB, simulationId);
  return c.json({ state });
});

/** §196 FAVORITE QUOTES — a dialogue line the player chose to keep. */
journalRoute.post('/:id/quotes', async (c) => {
  const simulationId = c.req.param('id');
  const body = await c.req.json<{ text?: string; speakerId?: string; locationId?: string }>().catch(() => null);
  const text = body?.text?.trim();
  if (!text || !body?.speakerId) {
    return c.json({ error: 'text and speakerId are required.' }, 400);
  }

  const state = await getSimulationState(c.env.DB, simulationId);
  if (!state) {
    return c.json({ error: 'Simulation not found.' }, 404);
  }

  await addFavoriteQuote(c.env.DB, simulationId, {
    text,
    speakerId: body.speakerId,
    worldDate: state.currentWorldDate,
    locationId: body.locationId ?? '',
  });
  const nextState = await getSimulationState(c.env.DB, simulationId);
  return c.json({ state: nextState });
});

journalRoute.delete('/:id/quotes/:quoteId', async (c) => {
  const simulationId = c.req.param('id');
  await removeFavoriteQuote(c.env.DB, simulationId, c.req.param('quoteId'));
  const state = await getSimulationState(c.env.DB, simulationId);
  return c.json({ state });
});

/**
 * §192 SESSION END "Close Chapter" — a short summary + a chapters row + a
 * savepoint snapshot. Deliberately skips "eventuell Kapitelillustration"
 * (spec marks it optional, and it would route straight back into the
 * capacity-constrained image pipeline for no clear benefit here).
 */
journalRoute.post('/:id/close-chapter', async (c) => {
  const simulationId = c.req.param('id');
  const body = await c.req.json<{ title?: string }>().catch(() => null);

  const state = await getSimulationState(c.env.DB, simulationId);
  if (!state) {
    return c.json({ error: 'Simulation not found.' }, 404);
  }

  const nextNumber = state.chapters.length > 0 ? Math.max(...state.chapters.map((ch) => (ch as { number: number }).number)) + 1 : 1;
  const title = body?.title?.trim() || `Chapter ${nextNumber}`;
  const summary = (await getLastNarration(c.env.DB, simulationId)) ?? `Der Stand zum ${state.currentWorldDate}.`;

  await c.env.DB.prepare('INSERT INTO chapters (id, simulation_id, number, title, summary, start_date) VALUES (?, ?, ?, ?, ?, ?)')
    .bind(crypto.randomUUID(), simulationId, nextNumber, title, summary, state.currentWorldDate)
    .run();

  await createSavepoint(c.env.DB, simulationId, `${title} — Ende`);

  const nextState = await getSimulationState(c.env.DB, simulationId);
  return c.json({ state: nextState });
});
