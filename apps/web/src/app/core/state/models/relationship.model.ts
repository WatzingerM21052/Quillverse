import { EntityId } from './entity-id';

/**
 * 28 independent dimensions (simulation-master-prompt-v3.md §29) — none of them
 * substitutes another. Stored numerically (0-100) for internal consistency; the
 * UI must translate these into qualitative language, never raw numbers (§35, §115).
 */
export interface RelationshipDimensions {
  acquaintance: number;
  liking: number;
  trust: number;
  respect: number;
  familiarity: number;
  sharedHumor: number;
  emotionalCloseness: number;
  intellectualConnection: number;
  physicalAttraction: number;
  aestheticAttraction: number;
  romanticCuriosity: number;
  romanticInterest: number;
  romanticFeelings: number;
  romanticTension: number;
  sexualTension: number;
  desireForCloseness: number;
  loyalty: number;
  protectiveness: number;
  socialAcceptance: number;
  willingnessToMarry: number;
  distrust: number;
  insecurity: number;
  hurt: number;
  anger: number;
  jealousy: number;
  rivalry: number;
  fear: number;
  dependency: number;
}

export type RelationshipMomentum =
  | 'strongly-positive-rising'
  | 'positive-rising'
  | 'slightly-positive'
  | 'stable'
  | 'slightly-negative'
  | 'negative-rising'
  | 'strongly-negative';

export type AttentionLevel = 'practically-none' | 'low' | 'occasional' | 'medium' | 'high' | 'very-high';

export type Awareness = 'none' | 'low' | 'partial' | 'high';

export interface InnerThought {
  text: string;
  worldDate: string;
  awareness: Awareness;
}

/**
 * Directional: A→B is stored separately from B→A (§49). Contains GM-only fields
 * (innerThoughts, selfInterpretation, denial, misconceptions) that must never be
 * shown to the player outside GM mode.
 */
export interface Relationship {
  from: EntityId;
  to: EntityId;
  type: string;
  dimensions: RelationshipDimensions;
  momentum: RelationshipMomentum;
  attention: AttentionLevel;
  lastContact: string | null;
  publicStance: string;
  privateStance: string;
  innerThoughts: InnerThought[];
  selfInterpretation: string | null;
  denial: string | null;
  misconceptions: string[];
  personalBoundaries: string[];
  memoryIds: EntityId[];
}
