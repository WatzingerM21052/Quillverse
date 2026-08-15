import { EntityId } from './entity-id';

export interface Location {
  id: EntityId;
  name: string;
  type: string;
  /** Fog of knowledge (§41) — undiscovered locations must not be revealed to the player. */
  discovered: boolean;
  /** e.g. "asset://location/player_farm/base" — never a temporary CDN URL (A52). */
  baseAsset: string;
}
