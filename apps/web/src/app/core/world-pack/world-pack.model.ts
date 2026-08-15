import { CanonEvent } from '../state/models/canon-event.model';
import { Character } from '../state/models/character.model';
import { Location } from '../state/models/location.model';

/**
 * The engine/content seam: everything in `core/state`, `core/ai` and the
 * simulation runtime is world-agnostic. Everything setting-specific (Bridgerton,
 * or later Harry Potter, Woodwalker, H2O — Mako Mermaids, ...) lives in a
 * WorldPack. A World Pack is data, never code the engine has to branch on.
 */
export interface WorldPack {
  id: string;
  displayName: string;
  narrationLanguage: string;
  canonBaseline: {
    title: string;
    description: string;
    startingPoint: string;
  };
  canonEvents: CanonEvent[];
  characterRoster: Character[];
  locations: Location[];
  /** Ordered low-to-high access tiers, e.g. the Ton ladder (§53) or Hogwarts houses. */
  socialLadder: string[];
  visualStyleBible: string;
  toneGuidelines: string;
  defaultPlayerStart: {
    description: string;
    finances: string;
    skills: Record<string, string>;
  };
}
