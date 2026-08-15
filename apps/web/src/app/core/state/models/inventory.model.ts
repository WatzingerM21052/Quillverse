import { EntityId } from './entity-id';

/** §72 — only relevant items ("a letter, a piece of jewelry"), never "7 potatoes". */
export interface InventoryItem {
  id: EntityId;
  ownerId: EntityId;
  name: string;
  description: string;
}
