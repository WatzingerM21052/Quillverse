import { EntityId } from './entity-id';

export interface TravelInfo {
  distance: string;
  travelTime: string;
  transport: string;
  cost: string;
}

export interface Location {
  id: EntityId;
  name: string;
  type: string;
  /** Fog of knowledge (§41) — undiscovered locations must not be revealed to the player. */
  discovered: boolean;
  /** e.g. "asset://location/player_farm/base" — never a temporary CDN URL (A52). */
  baseAsset: string;
  /** Percent coordinates on the Map screen. */
  mapPosition: { x: number; y: number };
  /** Absent for the player's own home — nothing to travel to. */
  travel?: TravelInfo;
}
