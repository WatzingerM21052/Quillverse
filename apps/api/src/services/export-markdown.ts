import type { SimulationStateResponse } from '../models';

/**
 * §A36 Compact Save — human-readable markdown alongside the authoritative
 * JSON (§A41: "JSON bleibt Maschinenwahrheit," markdown is for
 * readability/manual review/AI hand-off, never re-parsed on import).
 * Deterministic templating, no AI call — Compact Save is meant to be fast.
 */
export function buildExportMarkdown(state: SimulationStateResponse): Record<string, string> {
  const player = state.characters[state.playerId];
  const otherCharacters = Object.values(state.characters).filter((c) => c.id !== state.playerId);

  const masterState = `# ${state.label}

- **World Pack:** ${state.worldPackId}
- **State Version:** ${state.stateVersion}
- **Current Date:** ${state.currentWorldDate} (${state.currentSeason})
- **Player:** ${player?.name ?? state.playerId}
- **Social Access Level:** ${state.socialAccessLevel}

Exported ${new Date().toISOString()}.
`;

  const playerMd = player
    ? `# ${player.name}

## Appearance
${Object.entries(player.appearance as Record<string, unknown>)
  .map(([key, value]) => `- **${key}:** ${value}`)
  .join('\n')}

## Skills
${Object.entries(player.skills)
  .map(([key, value]) => `- **${key}:** ${value}`)
  .join('\n')}

## Goals
${JSON.stringify(player.goals, null, 2)}
`
    : '# Player\n\n(no player character found)\n';

  const worldMd = `# World Status

${JSON.stringify(state.worldStatus, null, 2)}

## Recent World Events
${state.worldEvents.map((e) => `- ${JSON.stringify(e)}`).join('\n') || '(none)'}

## Open Threads
${state.openThreads.map((t) => `- ${t}`).join('\n') || '(none)'}
`;

  const relationshipsMd = `# Relationships

${state.relationships
  .map((r) => `## ${r.from} -> ${r.to}\n\n- Type: ${r.type}\n- Momentum: ${r.momentum}\n- Public: ${r.publicStance}\n- Private: ${r.privateStance}\n`)
  .join('\n')}
`;

  const charactersMd = `# Characters

${otherCharacters.map((c) => `## ${c.name} (${c.id})\n\n${JSON.stringify(c.appearance, null, 2)}\n`).join('\n')}
`;

  const canonMd = `# Canon Events

${Object.values(state.canonEvents)
  .map((event) => `- ${JSON.stringify(event)}`)
  .join('\n') || '(none yet)'}
`;

  const historyMd = `# Recent History (Memories & Chapters)

## Chapters
${state.chapters.map((c) => `- ${JSON.stringify(c)}`).join('\n') || '(none)'}

## Memories
${Object.values(state.memories)
  .map((m) => `- **${m.worldDate}** [${m.importance}] ${m.fact}`)
  .join('\n') || '(none)'}
`;

  return {
    'markdown/MASTER_STATE.md': masterState,
    'markdown/PLAYER.md': playerMd,
    'markdown/WORLD.md': worldMd,
    'markdown/RELATIONSHIPS.md': relationshipsMd,
    'markdown/CHARACTERS.md': charactersMd,
    'markdown/CANON.md': canonMd,
    'markdown/HISTORY.md': historyMd,
  };
}
