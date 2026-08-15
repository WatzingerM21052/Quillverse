import { EntityId } from './entity-id';

export type MemoryImportance = 'trivial' | 'minor' | 'notable' | 'important' | 'major' | 'life-changing';

export type InformationStatus = 'fact' | 'known-fact' | 'belief' | 'rumor' | 'assumption' | 'lie' | 'unknown';

export type InformationReach = 'private' | 'household' | 'local' | 'regional' | 'gentry' | 'ton' | 'london' | 'widely-known';

export type MemoryFading = 'fast' | 'slow' | 'very-slow' | 'permanent';

export interface Memory {
  id: EntityId;
  entityIds: EntityId[];
  worldDate: string;
  type: string;
  importance: MemoryImportance;
  fact: string;
  /** Subjective interpretation per involved entity — a memory is not one fact for everyone (§35). */
  interpretation: Record<EntityId, string>;
  status: InformationStatus;
  reach: InformationReach;
  fading: MemoryFading;
  tags: string[];
}
