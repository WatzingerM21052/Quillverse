import { Hono } from 'hono';
import { buildCharacterCreationPrompt } from '../services/character-creation-prompt';
import { validateCharacterCreationDraft } from '../services/validate-character-creation-draft';
import { createSimulationFromDraft } from '../db/create-simulation';
import type { TonePreferences as ToneReferences } from '../models';
import { logAiCall } from '../db/ai-calls';
import { PROVIDER_ADAPTERS } from '../providers/registry';
import { PROVIDER_IDS } from '../providers/types';
import { getDecryptedCredential, getSelectedModel } from './ai-providers';
import type { CharacterCreationAnswers, CharacterCreationDraft } from '../models/character-creation';

export const characterCreationRoute = new Hono<{ Bindings: Env }>();

const REPAIR_INSTRUCTION =
  '\n\n=== FORMAT CORRECTION ===\n\nYour previous response could not be parsed as the required JSON object. ' +
  'Respond again with ONLY that one JSON object — no prose, no markdown code fence, nothing before or after it.';

// A draft has no simulation to log ai_calls against yet — logged under a
// fixed pseudo-id so §156 usage tracking still counts these requests
// against the daily quota display.
const DRAFT_LOG_ID = 'character-creation-draft';

/**
 * §131 ANFANGSINITIALISIERUNG — the AI conducts the interview and fills
 * gaps with plausible defaults. Same connected-provider fallback chain as
 * turn/generate (A32), same one-retry-with-format-correction as §188, just
 * against a different prompt/output contract (CharacterCreationDraft, not
 * a turn). Nothing is persisted here — the player reviews/edits first.
 */
characterCreationRoute.post('/draft', async (c) => {
  const answers = await c.req.json<CharacterCreationAnswers>().catch(() => ({}) as CharacterCreationAnswers);
  const prompt = buildCharacterCreationPrompt(answers);

  let anyProviderConnected = false;
  let lastError = 'No AI provider is connected. Connect one in Settings to use the Character Creator.';

  for (const provider of PROVIDER_IDS) {
    const apiKey = await getDecryptedCredential(c.env, provider);
    if (!apiKey) continue;
    anyProviderConnected = true;
    const modelId = await getSelectedModel(c.env, provider);

    for (let attempt = 0; attempt < 2; attempt++) {
      const attemptPrompt = attempt === 0 ? prompt : prompt + REPAIR_INSTRUCTION;
      const startedAt = Date.now();

      let responseText: string;
      try {
        responseText = await PROVIDER_ADAPTERS[provider].generateStory(apiKey, attemptPrompt, modelId ?? undefined);
      } catch (err) {
        lastError = err instanceof Error ? err.message : `${provider} request failed.`;
        await logAiCall(c.env.DB, DRAFT_LOG_ID, provider, false, Date.now() - startedAt, 'generation_failed');
        continue;
      }

      const validation = validateCharacterCreationDraft(responseText);
      if (!validation.ok) {
        lastError = `${provider} response could not be parsed: ${validation.error}`;
        await logAiCall(c.env.DB, DRAFT_LOG_ID, provider, false, Date.now() - startedAt, 'invalid_response');
        continue;
      }

      await logAiCall(c.env.DB, DRAFT_LOG_ID, provider, true, Date.now() - startedAt, null);
      return c.json({ draft: validation.draft, provider });
    }
  }

  return c.json({ error: lastError }, anyProviderConnected ? 502 : 400);
});

/** Persists a (player-reviewed/edited) draft as a brand-new simulation — parent_simulation_id null, unlike a fork. */
characterCreationRoute.post('/confirm', async (c) => {
  const body = await c.req.json<{ draft?: CharacterCreationDraft; label?: string; tone?: ToneReferences }>().catch(() => null);
  const draft = body?.draft;
  const label = body?.label?.trim();

  if (!draft || !label) {
    return c.json({ error: 'draft and label are required.' }, 400);
  }

  const summary = await createSimulationFromDraft(c.env.DB, draft, label, body?.tone ?? {});
  if (!summary) {
    return c.json({ error: 'Simulation could not be created.' }, 500);
  }
  return c.json(summary);
});
