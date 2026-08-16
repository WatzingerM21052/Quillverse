import { Hono } from 'hono';
import { getSimulationState, listSimulations, touchVisitAndBuildRecap, updateTonePreferences } from '../db/simulation-repository';

export const simulationsRoute = new Hono<{ Bindings: Env }>();

/** Save Selection (§124) — every timeline, for switching or branching from. */
simulationsRoute.get('/', async (c) => {
  return c.json(await listSimulations(c.env.DB));
});

simulationsRoute.get('/:id', async (c) => {
  const simulationId = c.req.param('id');
  const state = await getSimulationState(c.env.DB, simulationId);
  if (!state) {
    return c.json({ error: 'Simulation not found.' }, 404);
  }
  state.recap = await touchVisitAndBuildRecap(c.env.DB, simulationId);
  return c.json(state);
});

/** §174 Simulation Settings — edit the tone sliders any time, not just at Character Creator time. */
simulationsRoute.put('/:id/tone-preferences', async (c) => {
  const simulationId = c.req.param('id');
  const body = await c.req.json().catch(() => ({}));
  await updateTonePreferences(c.env.DB, simulationId, body);

  const state = await getSimulationState(c.env.DB, simulationId);
  if (!state) {
    return c.json({ error: 'Simulation not found.' }, 404);
  }
  return c.json({ state });
});
