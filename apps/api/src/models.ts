// Mirrors apps/web/src/app/core/state/models/*.ts field-for-field so the
// frontend can consume this JSON with zero transformation.

export interface SimulationSummary {
  id: string;
  label: string;
  worldPackId: string;
  currentWorldDate: string;
  stateVersion: number;
  playerName: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SimulationStateResponse {
  simulationId: string;
  label: string;
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
  inventory: InventoryItemResponse[];
  whistledownIssues: WhistledownIssueResponse[];
  reputation: ReputationEntry[];
  influence: InfluenceEntry[];
  favors: FavorEntry[];
  rumors: RumorEntry[];
  secrets: SecretEntry[];
  scandals: ScandalEntry[];
  obligations: ObligationEntry[];
  causalityLog: CausalityLogEntry[];
}

export interface WardrobeItem {
  id: string;
  name: string;
  note: string;
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
  skills: Record<string, string>;
  wardrobe: WardrobeItem[];
}

export interface WhistledownIssueResponse {
  id: string;
  issueNumber: number;
  date: string;
  headline: string;
  body: string[];
}

export interface ReputationEntry {
  characterId: string;
  scope: string;
  standing: string;
}

export interface InfluenceEntry {
  id: string;
  characterId: string;
  source: string;
  description: string;
}

export interface FavorEntry {
  id: string;
  personId: string;
  direction: 'owed-to-player' | 'player-owes';
  description: string;
  publiclyKnown: boolean;
  fulfilled: boolean;
}

export interface RumorEntry {
  id: string;
  content: string;
  truthStatus: 'true' | 'false' | 'distorted' | 'unknown';
  reach: string;
  knownBy: string[];
  originDate: string;
}

export interface SecretEntry {
  id: string;
  description: string;
  truth: string;
  knownBy: string[];
  suspectedBy: string[];
  playerKnows: boolean;
}

export interface ScandalEntry {
  id: string;
  description: string;
  severity: string;
  date: string;
  involved: string[];
}

export interface ObligationEntry {
  id: string;
  description: string;
  owedTo: string;
  deadline: string | null;
  status: string;
}

export interface CausalityLogEntry {
  id: string;
  event: string;
  cause: string;
  directConsequences: string[];
  secondaryConsequences: string[];
  longTermConsequences: string[];
  date: string;
}

export interface InventoryItemResponse {
  id: string;
  ownerId: string;
  name: string;
  description: string;
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
  newInventoryItems?: InventoryItemResponse[];
  newWhistledownIssues?: WhistledownIssueResponse[];
  reputationUpdates?: ReputationEntry[];
  newInfluence?: InfluenceEntry[];
  newFavors?: FavorEntry[];
  favorUpdates?: Array<{ id: string; fulfilled?: boolean; publiclyKnown?: boolean }>;
  newRumors?: RumorEntry[];
  newSecrets?: SecretEntry[];
  newScandals?: ScandalEntry[];
  newObligations?: ObligationEntry[];
  obligationUpdates?: Array<{ id: string; status: string }>;
  newCausalityEntries?: CausalityLogEntry[];
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
