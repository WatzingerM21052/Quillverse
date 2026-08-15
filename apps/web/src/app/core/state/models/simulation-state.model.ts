import { EntityId } from './entity-id';
import { Character } from './character.model';
import { Relationship } from './relationship.model';
import { Location } from './location.model';
import { Memory } from './memory.model';
import { Letter } from './letter.model';
import { CanonEvent } from './canon-event.model';

/**
 * The single source of truth (§77, §86, A6). No AI model, chat log, or browser
 * cache ever holds this — they only ever see a temporary projection of it.
 */
export interface SimulationState {
  simulationId: EntityId;
  /** Which World Pack this simulation was started from — the engine/content seam. */
  worldPackId: string;
  stateVersion: number;
  currentWorldDate: string;
  playerId: EntityId;
  characters: Record<EntityId, Character>;
  relationships: Relationship[];
  locations: Record<EntityId, Location>;
  memories: Record<EntityId, Memory>;
  letters: Record<EntityId, Letter>;
  canonEvents: Record<EntityId, CanonEvent>;
  openThreads: string[];
}
