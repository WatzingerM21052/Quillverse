import { describe, expect, it } from 'vitest';
import { isImportantScene } from '../src/services/continuity-guard';
import type { CharacterResponse, LocationResponse, MemoryResponse, ScandalEntry, SecretEntry } from '../src/models';

const memoryWith = (importance: string): MemoryResponse => ({
  id: 'memory_test',
  entityIds: [],
  worldDate: '1. Januar 1813',
  type: 'event',
  importance,
  fact: 'Test fact',
  interpretation: {},
  status: 'fact',
  reach: 'private',
  fading: 'slow',
  tags: [],
});

const minimalCharacter: CharacterResponse = {
  id: 'char_test',
  name: 'Test Character',
  isCanon: false,
  isPlayer: false,
  locationId: null,
  appearance: {},
  visualState: {},
  personality: {},
  goals: {},
  playerKnowledge: [],
  gmState: {},
  skills: {},
  wardrobe: [],
};

const minimalLocation: LocationResponse = {
  id: 'loc_test',
  name: 'Test Place',
  type: 'other',
  discovered: true,
  baseAsset: 'asset://test',
  mapPosition: { x: 0, y: 0 },
  travel: null,
};

const minimalSecret: SecretEntry = {
  id: 'secret_test',
  description: 'x',
  truth: 'x',
  knownBy: [],
  suspectedBy: [],
  playerKnows: false,
};

const minimalScandal: ScandalEntry = {
  id: 'scandal_test',
  description: 'x',
  severity: 'minor',
  date: '1. Januar 1813',
  involved: [],
};

describe('isImportantScene', () => {
  it('returns false for an empty patch and for only-trivial memories', () => {
    expect(isImportantScene({})).toBe(false);
    expect(isImportantScene({ newMemories: [memoryWith('trivial'), memoryWith('minor')] })).toBe(false);
  });

  it('returns true when a new memory is notable or higher', () => {
    for (const importance of ['notable', 'important', 'major', 'life-changing']) {
      expect(isImportantScene({ newMemories: [memoryWith(importance)] })).toBe(true);
    }
  });

  it('returns true when the patch touches canon events, new characters, new locations, secrets, or scandals', () => {
    expect(isImportantScene({ canonUpdates: [{ id: 'canon_1' }] })).toBe(true);
    expect(isImportantScene({ newCharacters: [minimalCharacter] })).toBe(true);
    expect(isImportantScene({ newLocations: [minimalLocation] })).toBe(true);
    expect(isImportantScene({ newSecrets: [minimalSecret] })).toBe(true);
    expect(isImportantScene({ newScandals: [minimalScandal] })).toBe(true);
  });
});
