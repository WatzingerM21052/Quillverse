import type { ManualTurnResponse } from '../models';

export type ValidationOutcome = { ok: true; response: ManualTurnResponse } | { ok: false; error: string };

/**
 * Structural check before anything touches D1 (§104 Manual Import Safety,
 * §151 Conflict Detection) — this is not a full schema validator, just enough
 * to reject garbage before it becomes a "continuity conflict" three turns later.
 */
export function validateManualTurnResponse(raw: string): ValidationOutcome {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { ok: false, error: 'That is not valid JSON. Make sure you copied the whole response, with no extra text before or after it.' };
  }

  if (typeof parsed !== 'object' || parsed === null) {
    return { ok: false, error: 'Expected a single JSON object.' };
  }

  const candidate = parsed as Record<string, unknown>;

  if (typeof candidate['schemaVersion'] !== 'number') {
    return { ok: false, error: 'Missing or invalid "schemaVersion".' };
  }

  const scene = candidate['scene'];
  if (typeof scene !== 'object' || scene === null) {
    return { ok: false, error: 'Missing "scene".' };
  }
  const sceneObj = scene as Record<string, unknown>;
  if (typeof sceneObj['worldDate'] !== 'string' || !Array.isArray(sceneObj['narration'])) {
    return { ok: false, error: '"scene" is missing "worldDate" or "narration".' };
  }

  const statePatch = candidate['statePatch'];
  if (typeof statePatch !== 'object' || statePatch === null) {
    return { ok: false, error: 'Missing "statePatch" (send an empty object if nothing changed).' };
  }

  return { ok: true, response: candidate as unknown as ManualTurnResponse };
}
