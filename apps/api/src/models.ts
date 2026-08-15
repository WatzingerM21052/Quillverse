// Mirrors apps/web/src/app/core/state/models/*.ts field-for-field so the
// frontend can consume this JSON with zero transformation.

export interface SimulationStateResponse {
  simulationId: string;
  worldPackId: string;
  stateVersion: number;
  currentWorldDate: string;
  currentSeason: string;
  playerId: string;
  socialAccessLevel: number;
  characters: Record<string, CharacterResponse>;
  relationships: RelationshipResponse[];
  locations: Record<string, LocationResponse>;
  memories: Record<string, MemoryResponse>;
  letters: Record<string, LetterResponse>;
  canonEvents: Record<string, unknown>;
  openThreads: string[];
  farm: unknown;
  financeLedger: unknown[];
  worldStatus: unknown;
  worldEvents: unknown[];
  socialCalendar: unknown[];
  chapters: unknown[];
}

export interface CharacterResponse {
  id: string;
  name: string;
  isCanon: boolean;
  isPlayer: boolean;
  locationId: string | null;
  appearance: unknown;
  visualState: unknown;
  personality: unknown;
  goals: unknown;
  playerKnowledge: string[];
  gmState: unknown;
}

export interface RelationshipResponse {
  from: string;
  to: string;
  type: string;
  dimensions: unknown;
  momentum: string;
  attention: string;
  lastContact: string | null;
  publicStance: string;
  privateStance: string;
  innerThoughts: unknown[];
  selfInterpretation: string | null;
  denial: string | null;
  misconceptions: string[];
  personalBoundaries: string[];
}

export interface LocationResponse {
  id: string;
  name: string;
  type: string;
  discovered: boolean;
  baseAsset: string;
  mapPosition: { x: number; y: number };
  travel: unknown | null;
}

export interface MemoryResponse {
  id: string;
  entityIds: string[];
  worldDate: string;
  type: string;
  importance: string;
  fact: string;
  interpretation: unknown;
  status: string;
  reach: string;
  fading: string;
  tags: string[];
}

export interface LetterResponse {
  id: string;
  senderId: string;
  recipientId: string;
  dateWritten: string;
  dateSent: string | null;
  dateArrived: string | null;
  content: string;
  status: string;
  knownBy: string[];
}
