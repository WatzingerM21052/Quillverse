import { zipSync, unzipSync, strToU8, strFromU8 } from 'fflate';
import { BackupManifest, ExportData } from './backup-api.service';

/** §A39 ZIP Format — manifest.json + simulation.json (§A41 "JSON bleibt Maschinenwahrheit") + markdown/ (§A36). */
export function buildBackupZip(data: ExportData): Uint8Array {
  const files: Record<string, Uint8Array> = {
    'manifest.json': strToU8(JSON.stringify(data.manifest, null, 2)),
    'simulation.json': strToU8(JSON.stringify(data.simulation, null, 2)),
  };
  for (const [path, content] of Object.entries(data.markdown)) {
    files[path] = strToU8(content);
  }
  return zipSync(files, { level: 6 });
}

/** §A39 — sanitized so the label can't smuggle path separators or other filesystem-unsafe characters into the download name. */
export function backupFilename(label: string, worldDate: string): string {
  const safeLabel = label.replace(/[^a-zA-Z0-9 _-]/g, '').trim().replace(/\s+/g, '-') || 'save';
  const safeDate = worldDate.replace(/[^a-zA-Z0-9]/g, '-');
  return `quillverse-${safeLabel}-${safeDate}.zip`;
}

export interface ParsedBackup {
  manifest: BackupManifest;
  simulation: unknown;
}

/** §A42 "Read manifest -> Check version -> Validate JSON" — the client-side half; the server validates again on import. */
export function parseBackupZip(bytes: Uint8Array): ParsedBackup {
  const files = unzipSync(bytes);

  const manifestBytes = files['manifest.json'];
  const simulationBytes = files['simulation.json'];
  if (!manifestBytes || !simulationBytes) {
    throw new Error('Diese ZIP-Datei enthält keine gültige Quillverse-Sicherung (manifest.json oder simulation.json fehlt).');
  }

  let manifest: BackupManifest;
  let simulation: unknown;
  try {
    manifest = JSON.parse(strFromU8(manifestBytes));
    simulation = JSON.parse(strFromU8(simulationBytes));
  } catch {
    throw new Error('manifest.json oder simulation.json ist kein gültiges JSON.');
  }

  return { manifest, simulation };
}
