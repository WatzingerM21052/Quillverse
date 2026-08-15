import { EntityId } from './entity-id';

export interface AppearanceProfile {
  height: string;
  build: string;
  face: string;
  hair: string;
  eyes: string;
  voice: string;
  posture: string;
  typicalExpression: string;
  hands: string;
  grooming: string;
  clothing: string;
  distinguishingFeatures: string;
  generalPresence: string;
}

export interface CharacterVisualState {
  characterId: EntityId;
  basePortrait: string;
  currentOutfit: string;
  currentHairState: string;
  currentAge: string;
  currentCondition: string;
  availableExpressions: string[];
}

export interface CharacterGoals {
  shortTerm: string[];
  midTerm: string[];
  longTerm: string[];
  currentWorries: string[];
  currentObligations: string[];
  currentPriorities: string[];
  plannedActions: string[];
  currentlyImportantPeople: EntityId[];
}

/** §70-71 — a wardrobe item's note is elegant prose, never a gamified "Suitable/Unsuitable" label. */
export interface WardrobeItem {
  id: string;
  name: string;
  note: string;
}

export interface Character {
  id: EntityId;
  name: string;
  isCanon: boolean;
  isPlayer: boolean;
  appearance: AppearanceProfile;
  visualState: CharacterVisualState;
  personality: Record<string, unknown>;
  goals: CharacterGoals;
  /** Only what the player character could plausibly know — never GM-only facts. */
  playerKnowledge: string[];
  /** Private feelings, plans, misconceptions not modeled as Relationship yet. Never rendered outside GM mode. */
  gmState: Record<string, unknown>;
  locationId: EntityId | null;
  memoryIds: EntityId[];
  /** §79 — qualitative levels (e.g. "sehr gut"), never a numeric skill point. */
  skills: Record<string, string>;
  wardrobe: WardrobeItem[];
}
