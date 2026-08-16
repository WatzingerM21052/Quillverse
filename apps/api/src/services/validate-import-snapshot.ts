import type { SimulationStateResponse } from '../models';

export type ImportValidationOutcome = { ok: true; snapshot: SimulationStateResponse } | { ok: false; error: string };

export interface BackupManifest {
  formatVersion: number;
  simulationId: string;
  simulationName: string;
  stateVersion: number;
  worldDate: string;
  createdAt: string;
  includesAssets: boolean;
}

const CURRENT_FORMAT_VERSION = 1;

/** §A42 Import Backup: read manifest -> check version -> validate JSON -> (preview happens client-side before this is ever called). */
export function validateBackupManifest(manifest: unknown): { ok: true } | { ok: false; error: string } {
  if (typeof manifest !== 'object' || manifest === null) {
    return { ok: false, error: 'manifest.json is missing or not an object.' };
  }
  const m = manifest as Record<string, unknown>;
  if (m['formatVersion'] !== CURRENT_FORMAT_VERSION) {
    return { ok: false, error: `Unsupported backup format version "${m['formatVersion']}" (expected ${CURRENT_FORMAT_VERSION}).` };
  }
  return { ok: true };
}

/** Structural check before anything touches D1 — same discipline as the other validators. Not a full schema check, just enough to reject garbage. */
export function validateImportSnapshot(raw: unknown): ImportValidationOutcome {
  if (typeof raw !== 'object' || raw === null) {
    return { ok: false, error: 'simulation.json is not an object.' };
  }
  const s = raw as Record<string, unknown>;

  const required: Array<[string, string]> = [
    ['simulationId', 'string'],
    ['worldPackId', 'string'],
    ['stateVersion', 'number'],
    ['currentWorldDate', 'string'],
    ['playerId', 'string'],
  ];
  for (const [field, type] of required) {
    if (typeof s[field] !== type) {
      return { ok: false, error: `simulation.json is missing or has an invalid "${field}".` };
    }
  }

  if (typeof s['characters'] !== 'object' || s['characters'] === null) {
    return { ok: false, error: 'simulation.json is missing "characters".' };
  }
  const characters = s['characters'] as Record<string, unknown>;
  if (!(s['playerId'] as string in characters)) {
    return { ok: false, error: 'simulation.json\'s "playerId" does not match any entry in "characters".' };
  }

  return { ok: true, snapshot: raw as SimulationStateResponse };
}
