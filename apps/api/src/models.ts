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

/**
 * What a turn (AI-generated or pasted via Manual Relay) is allowed to change.
 * Deliberately narrower than a full Character/Location/Relationship object —
 * only what the docs' StatePatch principle actually needs (§88, addendum-v1.1
 * A28): changes, never full rewrites.
 */
export interface ManualTurnPatch {
  relationshipUpdates?: Array<{
    from: string;
    to: string;
    type?: string;
    dimensions?: Record<string, number>;
    momentum?: string;
    attention?: string;
    lastContact?: string;
    publicStance?: string;
    privateStance?: string;
    misconceptions?: string[];
    personalBoundaries?: string[];
  }>;
  newMemories?: MemoryResponse[];
  canonUpdates?: Array<{
    id: string;
    name?: string;
    originalCourse?: string;
    requirements?: string[];
    window?: { start: string; end: string };
    status?: string;
    playerInfluence?: string;
    currentLikelyVariant?: string;
    consequences?: string[];
  }>;
  worldUpdates?: {
    londonSeasonStatus?: string;
    socialMood?: string;
    region?: string;
    weather?: string;
    currentWorldDate?: string;
    currentSeason?: string;
  };
  financeUpdates?: Array<{ id: string; date: string; description: string; amount: number }>;
  newLetters?: LetterResponse[];
  newCharacters?: CharacterResponse[];
  newLocations?: LocationResponse[];
  openThreadsAdd?: string[];
  openThreadsRemove?: string[];
}

export interface ManualTurnResponse {
  schemaVersion: number;
  scene: {
    locationId: string;
    worldDate: string;
    time: string;
    weather: string;
    narration: string[];
    dialogue: Array<{ speakerId: string; text: string; expression?: string; position?: string }>;
  };
  statePatch: ManualTurnPatch;
}
