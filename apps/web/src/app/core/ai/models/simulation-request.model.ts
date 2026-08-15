import { EntityId } from '../../state/models/entity-id';
import { Character } from '../../state/models/character.model';
import { Relationship } from '../../state/models/relationship.model';
import { Location } from '../../state/models/location.model';
import { Memory } from '../../state/models/memory.model';
import { CanonEvent } from '../../state/models/canon-event.model';
import { Scene } from '../../state/models/scene.model';

/**
 * The context package built fresh for every turn (§82, A26) — never the whole
 * save file. A scene with a farmer at the market does not need Queen Charlotte's
 * inner thoughts (§83).
 */
export interface SimulationRequest {
  simulationRules: string;
  promptVersion: string;
  baseStateVersion: number;
  currentScene: Scene | null;
  currentWorldDate: string;
  player: Character;
  currentLocation: Location;
  presentCharacters: Character[];
  relevantRelationships: Relationship[];
  relevantMemories: Memory[];
  relevantCanonEvents: CanonEvent[];
  openThreads: string[];
  playerAction: string;
}
