import { MASTER_PROMPT_TEXT } from '../assets/master-prompt';
import { getSimulationState } from '../db/simulation-repository';
import type { SimulationStateResponse } from '../models';

const PROMPT_VERSION = 'simulation-v3-final';

const OUTPUT_FORMAT_INSTRUCTIONS = `=== OUTPUT FORMAT ===

Respond with ONE JSON object and nothing else — no prose before or after it, no markdown code
fence. It must match exactly this shape:

{
  "schemaVersion": 1,
  "scene": {
    "locationId": "<an existing location id, or the current one if unchanged>",
    "worldDate": "<current in-world date after this turn>",
    "time": "<e.g. Morgen, Abend>",
    "weather": "<short weather description>",
    "narration": ["<one or more narration paragraphs, German>"],
    "dialogue": [
      { "speakerId": "<an existing character id>", "text": "<German dialogue line>", "expression": "<optional>", "position": "left|right" }
    ]
  },
  "statePatch": {
    "relationshipUpdates": [
      { "from": "<player id>", "to": "<character id>", "dimensions": { "trust": 92 }, "momentum": "stable", "publicStance": "...", "privateStance": "..." }
    ],
    "newMemories": [
      { "id": "<new unique id>", "entityIds": ["..."], "worldDate": "...", "type": "...", "importance": "trivial|minor|notable|important|major|life-changing", "fact": "...", "status": "fact", "reach": "household", "fading": "slow", "tags": [] }
    ],
    "canonUpdates": [],
    "worldUpdates": { "socialMood": "...", "weather": "..." },
    "financeUpdates": [ { "id": "<new unique id>", "date": "...", "description": "...", "amount": -2.5 } ],
    "newLetters": [],
    "newCharacters": [],
    "newLocations": [],
    "openThreadsAdd": [],
    "openThreadsRemove": []
  }
}

Only include fields in statePatch that actually changed — omit empty arrays entirely rather
than sending them empty. dimensions only needs the specific fields that moved, as small,
plausible adjustments (§116 — no single scene may jump a dimension by dozens of points).
Every id you reference (characters, locations) must already exist in CURRENT STATE below,
unless you are deliberately introducing it via newCharacters/newLocations.`;

function describeCharacter(character: SimulationStateResponse['characters'][string]): string {
  const appearance = character.appearance as Record<string, unknown>;
  const goals = character.goals as { currentPriorities?: string[]; currentWorries?: string[] };
  return [
    `- ${character.id} — ${character.name}${character.isPlayer ? ' (PLAYER)' : ''}`,
    `  location: ${character.locationId ?? 'unknown'}`,
    `  appearance: ${JSON.stringify(appearance)}`,
    `  current priorities: ${(goals.currentPriorities ?? []).join(', ') || '-'}`,
    `  current worries: ${(goals.currentWorries ?? []).join(', ') || '-'}`,
  ].join('\n');
}

export async function buildContextPackage(
  db: D1Database,
  simulationId: string,
  playerAction: string,
): Promise<{ contextText: string; baseStateVersion: number } | null> {
  const state = await getSimulationState(db, simulationId);
  if (!state) return null;

  const player = state.characters[state.playerId];
  if (!player) return null;

  const otherCharacters = Object.values(state.characters).filter((c) => c.id !== state.playerId);
  const relevantRelationships = state.relationships.filter((r) => r.from === state.playerId);
  const discoveredLocations = Object.values(state.locations).filter((l) => l.discovered);
  const currentLocation = player.locationId ? state.locations[player.locationId] : undefined;

  const sections = [
    `=== SIMULATION MASTER RULES (promptVersion: ${PROMPT_VERSION}) ===\n\n${MASTER_PROMPT_TEXT}`,

    `=== CURRENT STATE (stateVersion: ${state.stateVersion}) ===

World Date: ${state.currentWorldDate}
Season: ${state.currentSeason}
World Status: ${JSON.stringify(state.worldStatus)}
Current Location: ${currentLocation ? `${currentLocation.id} — ${currentLocation.name}` : 'unknown'}

--- Player Character ---
${describeCharacter(player)}

--- Other Known Characters ---
${otherCharacters.map(describeCharacter).join('\n')}

--- Relationships (player -> other) ---
${relevantRelationships.map((r) => `${r.from} -> ${r.to}: type=${r.type}, momentum=${r.momentum}, dimensions=${JSON.stringify(r.dimensions)}`).join('\n') || '(none yet)'}

--- Discovered Locations ---
${discoveredLocations.map((l) => `${l.id} — ${l.name} (${l.type})`).join('\n')}

--- Open Threads ---
${state.openThreads.join('\n') || '(none)'}`,

    `=== PLAYER ACTION ===\n\n${playerAction}`,

    OUTPUT_FORMAT_INSTRUCTIONS,
  ];

  return { contextText: sections.join('\n\n'), baseStateVersion: state.stateVersion };
}
