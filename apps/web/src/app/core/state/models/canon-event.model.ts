import { EntityId } from './entity-id';

export type CanonEventStatus =
  | 'stable'
  | 'slightly-at-risk'
  | 'strongly-at-risk'
  | 'changed'
  | 'replaced'
  | 'prevented'
  | 'already-occurred';

export type PlayerInfluence = 'none' | 'indirect' | 'low' | 'medium' | 'strong' | 'decisive';

export interface CanonEvent {
  id: EntityId;
  name: string;
  originalCourse: string;
  requirements: string[];
  originalWindow: { start: string; end: string };
  status: CanonEventStatus;
  playerInfluence: PlayerInfluence;
  currentLikelyVariant: string;
  consequences: string[];
}

/** Recorded whenever a canon event meaningfully diverges (simulation-master-prompt-v3.md §7). */
export interface CounterfactualRecord {
  canonEventId: EntityId;
  originalCourse: string;
  actualCourse: string;
  playerInfluence: string;
  directDifferences: string[];
  possibleLongTermConsequences: string[];
}
