import { Hono } from 'hono';
import { buildContextPackage } from '../services/context-builder';
import { validateManualTurnResponse } from '../services/validate-turn-response';
import { applyTurn } from '../db/apply-turn';
import { createAutoSnapshot, undoLastTurn } from '../db/savepoints';
import { logAiCall } from '../db/ai-calls';
import { PROVIDER_ADAPTERS } from '../providers/registry';
import { PROVIDER_IDS } from '../providers/types';
import { getDecryptedCredential } from './ai-providers';

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

  await createAutoSnapshot(c.env.DB, c.req.param('id'));
  const result = await applyTurn(c.env.DB, c.req.param('id'), playerAction, baseStateVersion, 'manual-relay', validation.response);

  if (!result.ok) {
    return c.json({ error: result.error }, result.status as 404 | 409);
  }

  return c.json({ state: result.state, scene: validation.response.scene });
});

/**
 * Direct-API turn (Phase 2/6 gap, ui-master-prompt-v1.md) — same pipeline as
 * Manual Relay's /commit, just sourced from a real provider call instead of
 * a human paste: buildContextPackage (existing) -> generateStory (new) ->
 * validateManualTurnResponse (existing) -> applyTurn (existing).
 *
 * A32 Automatischer Fallback — tries every *connected* provider in priority
 * order (PROVIDER_IDS: gemini, openai, anthropic) rather than requiring the
 * frontend to pick one. A rate-limited or malformed-response provider isn't
 * a dead end, the next connected one gets a shot at the same turn. Every
 * attempt is logged to ai_calls (§156 Model Cost/Limit UI) regardless of
 * outcome, since a failed attempt still counts against that provider's
 * daily quota.
 */
turnsRoute.post('/:id/turn/generate', async (c) => {
  const simulationId = c.req.param('id');
  const body = await c.req.json<{ playerAction?: string }>().catch(() => null);
  const playerAction = body?.playerAction?.trim();

  if (!playerAction) {
    return c.json({ error: 'playerAction is required.' }, 400);
  }

  const context = await buildContextPackage(c.env.DB, simulationId, playerAction);
  if (!context) {
    return c.json({ error: 'Simulation not found.' }, 404);
  }

  let anyProviderConnected = false;
  let lastError = 'No AI provider is connected. Connect one in Settings, or use Manual Relay.';

  for (const provider of PROVIDER_IDS) {
    const apiKey = await getDecryptedCredential(c.env, provider);
    if (!apiKey) continue;
    anyProviderConnected = true;

    const startedAt = Date.now();
    let responseText: string;
    try {
      responseText = await PROVIDER_ADAPTERS[provider].generateStory(apiKey, context.contextText);
    } catch (err) {
      lastError = err instanceof Error ? err.message : `${provider} request failed.`;
      await logAiCall(c.env.DB, simulationId, provider, false, Date.now() - startedAt, 'generation_failed');
      continue;
    }

    const validation = validateManualTurnResponse(responseText);
    if (!validation.ok) {
      lastError = `${provider} response could not be parsed: ${validation.error}`;
      await logAiCall(c.env.DB, simulationId, provider, false, Date.now() - startedAt, 'invalid_response');
      continue;
    }

    await logAiCall(c.env.DB, simulationId, provider, true, Date.now() - startedAt, null);
    await createAutoSnapshot(c.env.DB, simulationId);
    const result = await applyTurn(c.env.DB, simulationId, playerAction, context.baseStateVersion, provider, validation.response);

    if (!result.ok) {
      return c.json({ error: result.error }, result.status as 404 | 409);
    }
    return c.json({ state: result.state, scene: validation.response.scene, provider });
  }

  return c.json(
    { error: lastError, allProvidersFailed: anyProviderConnected },
    anyProviderConnected ? 502 : 400,
  );
});

/** §153 Undo Last Turn — reverts to the pre-turn autosave and removes the turn log entry it undoes. */
turnsRoute.post('/:id/undo-last-turn', async (c) => {
  const state = await undoLastTurn(c.env.DB, c.req.param('id'));
  if (!state) {
    return c.json({ error: 'Nothing to undo.' }, 400);
  }
  return c.json({ state });
});
