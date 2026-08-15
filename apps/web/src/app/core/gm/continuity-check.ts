import { SimulationState } from '../state/models/simulation-state.model';

export interface ContinuityIssue {
  severity: 'warning' | 'error';
  message: string;
}

/**
 * A real audit (§124 Continuity Audit, §181 dashboard), not a decorative
 * "✓ Healthy" badge: every reference an entity makes to another entity must
 * actually resolve, or the simulation has drifted.
 */
export function runContinuityCheck(state: SimulationState): ContinuityIssue[] {
  const issues: ContinuityIssue[] = [];
  const characterIds = new Set(Object.keys(state.characters));
  const locationIds = new Set(Object.keys(state.locations));

  for (const character of Object.values(state.characters)) {
    if (character.locationId && !locationIds.has(character.locationId)) {
      issues.push({
        severity: 'error',
        message: `${character.name} (${character.id}) hat einen unbekannten Ort: ${character.locationId}`,
      });
    }
  }

  for (const relationship of state.relationships) {
    if (!characterIds.has(relationship.from)) {
      issues.push({ severity: 'error', message: `Beziehung verweist auf unbekannte Person: ${relationship.from}` });
    }
    if (!characterIds.has(relationship.to)) {
      issues.push({ severity: 'error', message: `Beziehung verweist auf unbekannte Person: ${relationship.to}` });
    }
  }

  for (const letter of Object.values(state.letters)) {
    if (!characterIds.has(letter.senderId)) {
      issues.push({ severity: 'warning', message: `Brief ${letter.id}: unbekannter Absender ${letter.senderId}` });
    }
    if (!characterIds.has(letter.recipientId)) {
      issues.push({ severity: 'warning', message: `Brief ${letter.id}: unbekannter Empfänger ${letter.recipientId}` });
    }
  }

  for (const memory of Object.values(state.memories)) {
    for (const entityId of memory.entityIds) {
      if (!characterIds.has(entityId)) {
        issues.push({ severity: 'warning', message: `Erinnerung ${memory.id}: unbekannte Person ${entityId}` });
      }
    }
  }

  return issues;
}
