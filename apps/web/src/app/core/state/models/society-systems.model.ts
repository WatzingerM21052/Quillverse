import { EntityId } from './entity-id';

/** §56 — separate dimensions (local/regional/business/servants/gentry/ton/crown), never one number. */
export interface ReputationEntry {
  characterId: EntityId;
  scope: string;
  standing: string;
}

/** §57 — distinct from reputation; always traceable to a source. */
export interface InfluenceEntry {
  id: EntityId;
  characterId: EntityId;
  source: string;
  description: string;
}

/** §58 — a favor never guarantees future help, it just weighs on decisions. */
export interface FavorEntry {
  id: EntityId;
  personId: EntityId;
  direction: 'owed-to-player' | 'player-owes';
  description: string;
  publiclyKnown: boolean;
  fulfilled: boolean;
}

/** §60-64 — rumors travel and mutate; truthStatus is what actually happened, not what people believe. */
export interface RumorEntry {
  id: EntityId;
  content: string;
  truthStatus: 'true' | 'false' | 'distorted' | 'unknown';
  reach: string;
  knownBy: EntityId[];
  originDate: string;
}

/** §61 — GM-only by nature; never rendered to the player outside GM Mode. */
export interface SecretEntry {
  id: EntityId;
  description: string;
  truth: string;
  knownBy: EntityId[];
  suspectedBy: EntityId[];
  playerKnows: boolean;
}

/** §65 — needs an act, social relevance, and credible spread; not every embarrassment qualifies. */
export interface ScandalEntry {
  id: EntityId;
  description: string;
  severity: string;
  date: string;
  involved: EntityId[];
}

/** §123 — structured, unlike the free-text openThreads list. */
export interface ObligationEntry {
  id: EntityId;
  description: string;
  owedTo: string;
  deadline: string | null;
  status: string;
}

/** §121 — GM-only technical record of cause and effect. */
export interface CausalityLogEntry {
  id: EntityId;
  event: string;
  cause: string;
  directConsequences: string[];
  secondaryConsequences: string[];
  longTermConsequences: string[];
  date: string;
}
