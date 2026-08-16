import { Hono } from 'hono';
import { getSimulationState } from '../db/simulation-repository';

export const lettersRoute = new Hono<{ Bindings: Env }>();

/**
 * §59-63 Letter composer (issue #21) — the player authoring and sending a
 * letter directly, rather than only ever receiving AI-authored ones via a
 * turn's statePatch. Delivery/arrival stays AI-driven (a later turn can
 * update status/dateArrived via statePatch.newLetters or a relationship
 * update), same as it already works for AI-originated letters — this route
 * only covers "written and sent", not simulating travel time itself.
 */
lettersRoute.post('/:id/letters', async (c) => {
  const simulationId = c.req.param('id');
  const body = await c.req.json<{ recipientId?: string; content?: string }>().catch(() => null);
  const recipientId = body?.recipientId?.trim();
  const content = body?.content?.trim();
  if (!recipientId || !content) {
    return c.json({ error: 'recipientId and content are required.' }, 400);
  }

  const state = await getSimulationState(c.env.DB, simulationId);
  if (!state) {
    return c.json({ error: 'Simulation not found.' }, 404);
  }
  if (!state.characters[recipientId]) {
    return c.json({ error: 'Unknown recipient.' }, 400);
  }

  const id = crypto.randomUUID();
  await c.env.DB.prepare(
    `INSERT INTO letters (id, simulation_id, sender_id, recipient_id, date_written, date_sent, date_arrived, content, status, known_by_json)
     VALUES (?, ?, ?, ?, ?, ?, NULL, ?, 'sent', ?)`,
  )
    .bind(
      id,
      simulationId,
      state.playerId,
      recipientId,
      state.currentWorldDate,
      state.currentWorldDate,
      content,
      JSON.stringify([state.playerId, recipientId]),
    )
    .run();

  const nextState = await getSimulationState(c.env.DB, simulationId);
  return c.json({ state: nextState });
});
