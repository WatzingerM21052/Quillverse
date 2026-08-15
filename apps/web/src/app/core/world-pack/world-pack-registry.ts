import { WorldPack } from './world-pack.model';
import { BRIDGERTON_WORLD_PACK } from './world-packs/bridgerton/bridgerton.world-pack';

/**
 * Every installed World Pack, keyed by id. A SimulationState only ever stores
 * a worldPackId (core/state/models/simulation-state.model.ts) — this registry
 * is where that id resolves to actual content. Registering a new world pack
 * here is the entire integration step once one has been authored.
 */
export const WORLD_PACKS: Record<string, WorldPack> = {
  bridgerton: BRIDGERTON_WORLD_PACK,
};
