import { Hono } from 'hono';
import { buildContextPackage } from '../services/context-builder';
import { validateManualTurnResponse } from '../services/validate-turn-response';
import { applyTurn } from '../db/apply-turn';

export const turnsRoute = new Hono<{ Bindings: Env }>();

// Step 1 of Manual Relay (addendum-v1.1-architecture.md A23-A26): generate the
// text the player copies into an external AI chat.
turnsRoute.post('/:id/context-package', async (c) => {
  const body = await c.req.json<{ playerAction?: string }>().catch(() => null);
  const playerAction = body?.playerAction?.trim();
  if (!playerAction) {
    return c.json({ error: 'playerAction is required.' }, 400);
  }

  const result = await buildContextPackage(c.env.DB, c.req.param('id'), playerAction);
  if (!result) {
    return c.json({ error: 'Simulation not found.' }, 404);
  }

  return c.json(result);
});

// Step 2: validate the pasted response and commit it atomically (A30-A32 stale
// protection, §88/A28 patches-not-rewrites).
turnsRoute.post('/:id/commit', async (c) => {
  const body = await c.req
    .json<{ playerAction?: string; baseStateVersion?: number; responseText?: string }>()
    .catch(() => null);

  const playerAction = body?.playerAction?.trim();
  const baseStateVersion = body?.baseStateVersion;
  const responseText = body?.responseText;

  if (!playerAction || typeof baseStateVersion !== 'number' || !responseText) {
    return c.json({ error: 'playerAction, baseStateVersion and responseText are required.' }, 400);
  }

  const validation = validateManualTurnResponse(responseText);
  if (!validation.ok) {
    return c.json({ error: validation.error }, 400);
  }

  const result = await applyTurn(c.env.DB, c.req.param('id'), playerAction, baseStateVersion, 'manual-relay', validation.response);

  if (!result.ok) {
    return c.json({ error: result.error }, result.status as 404 | 409);
  }

  return c.json({ state: result.state, scene: validation.response.scene });
});
