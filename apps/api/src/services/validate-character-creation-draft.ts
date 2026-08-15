import type { CharacterCreationDraft } from '../models/character-creation';

export type DraftValidationOutcome = { ok: true; draft: CharacterCreationDraft } | { ok: false; error: string };

const APPEARANCE_FIELDS = [
  'height',
  'build',
  'face',
  'hair',
  'eyes',
  'voice',
  'posture',
  'typicalExpression',
  'hands',
  'grooming',
  'clothing',
  'distinguishingFeatures',
  'generalPresence',
];

function isValidAppearance(value: unknown): value is Record<string, string> {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return APPEARANCE_FIELDS.every((field) => typeof obj[field] === 'string');
}

/** Structural check before anything touches D1 — same discipline as validateManualTurnResponse. */
export function validateCharacterCreationDraft(raw: string): DraftValidationOutcome {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { ok: false, error: 'That is not valid JSON.' };
  }

  if (typeof parsed !== 'object' || parsed === null) {
    return { ok: false, error: 'Expected a single JSON object.' };
  }
  const candidate = parsed as Record<string, unknown>;

  const player = candidate['player'];
  if (typeof player !== 'object' || player === null) {
    return { ok: false, error: 'Missing "player".' };
  }
  const playerObj = player as Record<string, unknown>;

  if (typeof playerObj['name'] !== 'string' || !playerObj['name'].trim()) {
    return { ok: false, error: 'Missing "player.name".' };
  }
  if (!isValidAppearance(playerObj['appearance'])) {
    return { ok: false, error: '"player.appearance" is missing one or more required fields.' };
  }
  if (!Array.isArray(playerObj['personalityTraits'])) {
    return { ok: false, error: 'Missing "player.personalityTraits".' };
  }
  if (typeof playerObj['skills'] !== 'object' || playerObj['skills'] === null) {
    return { ok: false, error: 'Missing "player.skills".' };
  }
  if (typeof playerObj['goals'] !== 'object' || playerObj['goals'] === null) {
    return { ok: false, error: 'Missing "player.goals".' };
  }
  if (typeof playerObj['backstory'] !== 'string') {
    return { ok: false, error: 'Missing "player.backstory".' };
  }

  const family = candidate['family'];
  if (!Array.isArray(family)) {
    return { ok: false, error: 'Missing "family" (send an empty array if the character starts alone).' };
  }
  for (const member of family) {
    if (typeof member !== 'object' || member === null) {
      return { ok: false, error: 'A "family" entry is not an object.' };
    }
    const memberObj = member as Record<string, unknown>;
    if (typeof memberObj['name'] !== 'string' || typeof memberObj['relation'] !== 'string') {
      return { ok: false, error: 'A "family" entry is missing "name" or "relation".' };
    }
    if (!isValidAppearance(memberObj['appearance'])) {
      return { ok: false, error: `"family" entry "${memberObj['name']}" has an incomplete appearance.` };
    }
  }

  const farm = candidate['farm'];
  if (typeof farm !== 'object' || farm === null) {
    return { ok: false, error: 'Missing "farm".' };
  }
  const farmObj = farm as Record<string, unknown>;
  if (typeof farmObj['landAcres'] !== 'number') {
    return { ok: false, error: 'Missing or invalid "farm.landAcres".' };
  }

  if (typeof candidate['openingSummary'] !== 'string' || !candidate['openingSummary'].trim()) {
    return { ok: false, error: 'Missing "openingSummary".' };
  }

  return { ok: true, draft: candidate as unknown as CharacterCreationDraft };
}
