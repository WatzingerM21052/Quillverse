import { WorldPack } from '../../world-pack.model';

/**
 * canonEvents and characterRoster are intentionally empty here — transcribing the
 * full Season 1 canon-event graph and character roster from
 * docs/spec/simulation-master-prompt-v3.md (§5, §138 shape) is content authoring,
 * not scaffolding, and happens incrementally as later phases need specific NPCs.
 */
export const BRIDGERTON_WORLD_PACK: WorldPack = {
  id: 'bridgerton',
  displayName: 'Bridgerton — A Living World',
  narrationLanguage: 'de',
  canonBaseline: {
    title: 'Bridgerton Season 1',
    description:
      'Netflix Bridgerton universe at the start of the Season 1 London Season. Canon Gravity: HIGH — the world drifts toward known Season 1 events unless the player credibly changes their causes.',
    startingPoint: 'Beginning of Season 1, around the start of the London Season.',
  },
  canonEvents: [],
  characterRoster: [],
  locations: [],
  socialLadder: [
    'unknown',
    'local social network',
    'merchants/tradespeople',
    'local gentry',
    'indirect society contacts',
    'occasional ton contacts',
    'personal invitations',
    'established society guest',
    'close social circle',
    'significant influence',
    'access to the highest circles',
  ],
  visualStyleBible:
    'Elegant romantic Regency illustration, soft cinematic realism, warm natural lighting, refined painterly finish, historically inspired clothing, no modern elements, consistent character identity.',
  toneGuidelines:
    'Immersive, atmospheric, adult, emotionally credible, occasionally humorous, socially attentive. Not kitschy, not fanfiction-overdramatic, not constantly poetic, not artificially mysterious.',
  defaultPlayerStart: {
    description: 'Poor but respectable tenant-farmer family in the rural outskirts of London.',
    finances: 'Tight but currently stable; a bad year can cause real problems.',
    skills: {
      farming: 'very good',
      riding: 'good',
      reading: 'medium',
      writing: 'medium',
      etiquette: 'low',
      dancing: 'none',
      businessSense: 'medium',
    },
  },
};
