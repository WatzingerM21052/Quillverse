import type { CharacterResponse, ManualTurnPatch, SimulationStateResponse } from '../models';
import { PROVIDER_ADAPTERS } from '../providers/registry';
import { stripToJsonObject } from '../providers/response-text';
import type { ProviderId } from '../providers/types';

const IMPORTANT_MEMORY_LEVELS = ['notable', 'important', 'major', 'life-changing'];

/**
 * §106 Continuity Guard is optional and scoped to "important scenes" per
 * spec ("nicht nach jedem Frühstück") — this heuristic gates it using only
 * the proposed patch itself, no current-state lookups. Deliberately does
 * NOT diff relationship-dimension swings against current state (see design
 * spec §3) — the five signals below already cover "narratively significant."
 */
export function isImportantScene(patch: ManualTurnPatch): boolean {
  const importantMemory = (patch.newMemories ?? []).some((m) => IMPORTANT_MEMORY_LEVELS.includes(m.importance));
  return (
    importantMemory ||
    (patch.canonUpdates?.length ?? 0) > 0 ||
    (patch.newCharacters?.length ?? 0) > 0 ||
    (patch.newLocations?.length ?? 0) > 0 ||
    (patch.newSecrets?.length ?? 0) > 0 ||
    (patch.newScandals?.length ?? 0) > 0
  );
}

interface RelevantCharacter {
  id: string;
  name: string;
  playerKnowledge: string[];
  goals: unknown;
}

function relevantCharacter(c: CharacterResponse): RelevantCharacter {
  return { id: c.id, name: c.name, playerKnowledge: c.playerKnowledge, goals: c.goals };
}

/**
 * Deliberately lean — NOT the full context-builder.ts package (that defeats
 * the point of a "cheap" check). Only the entities the proposed patch itself
 * touches: characters referenced by relationshipUpdates or newMemories'
 * entityIds, existing memories already involving those same characters
 * (capped at 8 for token bound), and canon events the patch updates.
 */
function buildContinuityPrompt(currentState: SimulationStateResponse, patch: ManualTurnPatch): string {
  const touchedCharacterIds = new Set<string>();
  for (const r of patch.relationshipUpdates ?? []) {
    touchedCharacterIds.add(r.from);
    touchedCharacterIds.add(r.to);
  }
  for (const m of patch.newMemories ?? []) {
    for (const id of m.entityIds) touchedCharacterIds.add(id);
  }

  const relevantCharacters = [...touchedCharacterIds]
    .map((id) => currentState.characters[id])
    .filter((c): c is CharacterResponse => c !== undefined)
    .map(relevantCharacter);

  const relevantMemories = Object.values(currentState.memories)
    .filter((m) => m.entityIds.some((id) => touchedCharacterIds.has(id)))
    .slice(0, 8)
    .map((m) => ({ fact: m.fact, worldDate: m.worldDate, importance: m.importance }));

  const relevantCanonEvents = (patch.canonUpdates ?? [])
    .map((c) => currentState.canonEvents[c.id])
    .filter((e) => e !== undefined);

  return [
    'You are a continuity checker for a life-simulation game. Given established facts and a proposed',
    'change, determine whether the proposed change contradicts anything already established.',
    'Respond with ONLY a single JSON object: {"contradicts": boolean, "reason": string}',
    '("reason" empty string when contradicts is false). No prose, no markdown code fence.',
    '',
    'ESTABLISHED FACTS (characters, relevant memories, relevant canon events):',
    JSON.stringify({ characters: relevantCharacters, memories: relevantMemories, canonEvents: relevantCanonEvents }),
    '',
    'PROPOSED CHANGE:',
    JSON.stringify(patch),
  ].join('\n');
}

export interface ContinuityResult {
  contradicts: boolean;
  reason?: string;
}

/** Throws on any failure (network, malformed response) — callers treat that as "no contradiction found," never as a reason to fail the turn (§5 resilience rule). */
export async function checkContinuity(
  apiKey: string,
  provider: ProviderId,
  modelId: string | null,
  currentState: SimulationStateResponse,
  patch: ManualTurnPatch,
): Promise<ContinuityResult> {
  const prompt = buildContinuityPrompt(currentState, patch);
  const responseText = await PROVIDER_ADAPTERS[provider].generateStory(apiKey, prompt, modelId ?? undefined);
  const parsed = JSON.parse(stripToJsonObject(responseText)) as { contradicts?: unknown; reason?: unknown };

  if (typeof parsed.contradicts !== 'boolean') {
    throw new Error('Continuity check response missing a boolean "contradicts" field.');
  }

  return { contradicts: parsed.contradicts, reason: typeof parsed.reason === 'string' ? parsed.reason : undefined };
}
