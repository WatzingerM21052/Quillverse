import { EntityId } from './entity-id';

export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

export interface FarmStats {
  landAcres: number;
  annualRent: string;
  livestock: string;
  supplies: string;
  workers: string;
}

export interface FarmCalendarTask {
  season: Season;
  task: string;
}

/** Visual progression per §46 — buildings must reflect repairs/expansions, not just state text. */
export type BuildingCondition = 'derelict' | 'worn' | 'sound' | 'well-kept' | 'renovated';

export interface FarmBuilding {
  id: string;
  name: string;
  condition: BuildingCondition;
}

export interface Farm {
  id: EntityId;
  ownerId: EntityId;
  stats: FarmStats;
  calendar: FarmCalendarTask[];
  buildings: FarmBuilding[];
}
