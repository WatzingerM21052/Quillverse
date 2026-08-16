import { Hono } from 'hono';
import { buildContextPackage } from '../services/context-builder';
import { validateManualTurnResponse, type ValidationOutcome } from '../services/validate-turn-response';
import { applyTurn } from '../db/apply-turn';
import { createAutoSnapshot, undoLastTurn } from '../db/savepoints';
import { logAiCall } from '../db/ai-calls';
import { PROVIDER_ADAPTERS } from '../providers/registry';
import { PROVIDER_IDS, type ProviderId } from '../providers/types';
import { getDecryptedCredential, getSelectedModel } from './ai-providers';

export const turnsRoute = new Hono<{ Bindings: Env }>();

const REPAIR_INSTRUCTION =
  '\n\n=== FORMAT CORRECTION ===\n\nYour previous response could not be parsed as the required JSON object ' +
  '(schemaVersion, scene.worldDate, scene.narration, statePatch). Respond again with ONLY that one JSON object — ' +
  'no prose, no markdown code fence, nothing before or after it.';

interface GenerateAttempt {
  ok: true;
  responseText: string;
  validation: Extract<ValidationOutcome, { ok: true }>;
}
interface GenerateFailure {
  ok: false;
  error: string;
}

/**
 * §188 Response Repair — one retry with an explicit format-correction
 * instruction before giving up on this provider and falling through to the
 * next one. Each attempt is a real request against the provider's quota, so
 * each gets its own ai_calls log entry.
 */
async function generateWithRepair(
  db: D1Database,
  simulationId: string,
  provider: ProviderId,
  apiKey: string,
  contextText: string,
  modelId: string | null,
): Promise<GenerateAttempt | GenerateFailure> {
  for (let attempt = 0; attempt < 2; attempt++) {
    const prompt = attempt === 0 ? contextText : contextText + REPAIR_INSTRUCTION;
    const startedAt = Date.now();

    let responseText: string;
    try {
      responseText = await PROVIDER_ADAPTERS[provider].generateStory(apiKey, prompt, modelId ?? undefined);
    } catch (err) {
      const error = err instanceof Error ? err.message : `${provider} request failed.`;
      await logAiCall(db, simulationId, provider, false, Date.now() - startedAt, 'generation_failed');
      if (attempt === 1) return { ok: false, error };
      continue;
    }

    const validation = validateManualTurnResponse(responseText);
    if (!validation.ok) {
      await logAiCall(db, simulationId, provider, false, Date.now() - startedAt, 'invalid_response');
      if (attempt === 1) {
        return { ok: false, error: `${provider} response could not be parsed: ${validation.error}` };
      }
      continue;
    }

    await logAiCall(db, simulationId, provider, true, Date.now() - startedAt, null);
    return { ok: true, responseText, validation };
  }

  // Unreachable — the loop always returns on attempt 1 — but keeps TS happy.
  return { ok: false, error: `${provider}: exhausted retries.` };
}

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

    const modelId = await getSelectedModel(c.env, provider);
    const attempt = await generateWithRepair(c.env.DB, simulationId, provider, apiKey, context.contextText, modelId);
    if (!attempt.ok) {
      lastError = attempt.error;
      continue;
    }

    await createAutoSnapshot(c.env.DB, simulationId);
    const result = await applyTurn(
      c.env.DB,
      simulationId,
      playerAction,
      context.baseStateVersion,
      provider,
      attempt.validation.response,
    );

    if (!result.ok) {
      return c.json({ error: result.error }, result.status as 404 | 409);
    }
    return c.json({ state: result.state, scene: attempt.validation.response.scene, provider });
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
