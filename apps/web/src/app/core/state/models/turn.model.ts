import { EntityId } from './entity-id';
import { CanonEvent } from './canon-event.model';
import { Memory } from './memory.model';
import { Relationship } from './relationship.model';
import { Scene } from './scene.model';

/**
 * A model never rewrites the full state — it returns a patch (§88, A28).
 * This is what stops one provider from silently clobbering another's facts.
 */
export interface StatePatch {
  relationshipUpdates: Array<Partial<Relationship> & { from: EntityId; to: EntityId }>;
  worldUpdates: Record<string, unknown>[];
  memoryEvents: Memory[];
  timelineEvents: Record<string, unknown>[];
  financeUpdates: Record<string, unknown>[];
  canonUpdates: Array<Partial<CanonEvent> & { id: EntityId }>;
}

export interface Turn {
  id: EntityId;
  simulationId: EntityId;
  turnNumber: number;
  stateVersionBefore: number;
  stateVersionAfter: number;
  worldTimeBefore: string;
  worldTimeAfter: string;
  playerInput: string;
  provider: string;
  model: string;
  sceneOutput: Scene;
  statePatch: StatePatch;
  createdAt: string;
}
