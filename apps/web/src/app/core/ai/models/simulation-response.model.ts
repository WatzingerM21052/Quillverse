import { Scene } from '../../state/models/scene.model';
import { StatePatch } from '../../state/models/turn.model';
import { Memory } from '../../state/models/memory.model';
import { Relationship } from '../../state/models/relationship.model';
import { CanonEvent } from '../../state/models/canon-event.model';

/**
 * Every provider adapter must normalize onto this exact shape (addendum-v1.2-byok.md
 * B38, B41) — provider-specific request/auth/token quirks stay inside the adapter
 * and never reach the simulation core.
 */
export interface SimulationResponse {
  schemaVersion: number;
  scene: Scene;
  statePatch: StatePatch;
  memories: Memory[];
  relationshipChanges: Array<Partial<Relationship> & { from: string; to: string }>;
  canonChanges: Array<Partial<CanonEvent> & { id: string }>;
  worldChanges: Record<string, unknown>[];
}
