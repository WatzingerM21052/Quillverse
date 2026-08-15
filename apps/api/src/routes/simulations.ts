import { Hono } from 'hono';
import { getSimulationState } from '../db/simulation-repository';

export const simulationsRoute = new Hono<{ Bindings: Env }>();

simulationsRoute.get('/:id', async (c) => {
  const state = await getSimulationState(c.env.DB, c.req.param('id'));
  if (!state) {
    return c.json({ error: 'Simulation not found.' }, 404);
  }
  return c.json(state);
});
