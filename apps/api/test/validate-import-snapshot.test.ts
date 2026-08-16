import { describe, expect, it } from 'vitest';
import { validateBackupManifest, validateImportSnapshot } from '../src/services/validate-import-snapshot';

describe('validateBackupManifest', () => {
  it('accepts formatVersion 1', () => {
    expect(validateBackupManifest({ formatVersion: 1 }).ok).toBe(true);
  });

  it('rejects a missing/mismatched formatVersion', () => {
    expect(validateBackupManifest({ formatVersion: 2 }).ok).toBe(false);
    expect(validateBackupManifest({}).ok).toBe(false);
    expect(validateBackupManifest(null).ok).toBe(false);
  });
});

const VALID_SNAPSHOT = {
  simulationId: 'sim_default',
  worldPackId: 'bridgerton',
  stateVersion: 3,
  currentWorldDate: '12. April 1813',
  playerId: 'char_player_matthias',
  characters: { char_player_matthias: { id: 'char_player_matthias', name: 'Matthias Hale' } },
};

describe('validateImportSnapshot', () => {
  it('accepts a well-formed snapshot', () => {
    const result = validateImportSnapshot(VALID_SNAPSHOT);
    expect(result.ok).toBe(true);
  });

  it('rejects a snapshot missing required fields', () => {
    const { stateVersion, ...rest } = VALID_SNAPSHOT;
    const result = validateImportSnapshot(rest);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/stateVersion/);
  });

  it('rejects a playerId that does not resolve to a character', () => {
    const body = { ...VALID_SNAPSHOT, playerId: 'char_does_not_exist' };
    const result = validateImportSnapshot(body);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/playerId/);
  });

  it('rejects non-object input', () => {
    expect(validateImportSnapshot('not an object').ok).toBe(false);
    expect(validateImportSnapshot(null).ok).toBe(false);
  });
});
