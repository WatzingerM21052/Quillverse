import { Hono } from 'hono';
import { getSimulationState, listSimulations } from '../db/simulation-repository';

export const simulationsRoute = new Hono<{ Bindings: Env }>();

/** Save Selection (§124) — every timeline, for switching or branching from. */
simulationsRoute.get('/', async (c) => {
  return c.json(await listSimulations(c.env.DB));
});

simulationsRoute.get('/:id', async (c) => {
  const state = await getSimulationState(c.env.DB, c.req.param('id'));
  if (!state) {
    return c.json({ error: 'Simulation not found.' }, 404);
  }
  return c.json(state);
});
