import { Hono } from 'hono';
import { createSavepoint, listSavepoints, restoreSavepoint } from '../db/savepoints';

export const savepointsRoute = new Hono<{ Bindings: Env }>();

savepointsRoute.get('/:id/savepoints', async (c) => {
  return c.json(await listSavepoints(c.env.DB, c.req.param('id')));
});

savepointsRoute.post('/:id/savepoints', async (c) => {
  const body = await c.req.json<{ label?: string }>().catch(() => null);
  const label = body?.label?.trim();
  if (!label) {
    return c.json({ error: 'label is required.' }, 400);
  }

  const savepoint = await createSavepoint(c.env.DB, c.req.param('id'), label);
  if (!savepoint) {
    return c.json({ error: 'Simulation not found.' }, 404);
  }
  return c.json(savepoint);
});

savepointsRoute.post('/:id/savepoints/:savepointId/restore', async (c) => {
  const state = await restoreSavepoint(c.env.DB, c.req.param('id'), c.req.param('savepointId'));
  if (!state) {
    return c.json({ error: 'Savepoint not found.' }, 404);
  }
  return c.json({ state });
});
