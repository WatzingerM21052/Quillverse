import { Hono } from 'hono';
import { getSimulationState } from '../db/simulation-repository';
import { importSimulationSnapshot } from '../db/import-simulation';
import { buildExportMarkdown } from '../services/export-markdown';
import { validateBackupManifest, validateImportSnapshot, type BackupManifest } from '../services/validate-import-snapshot';

export const backupRoute = new Hono<{ Bindings: Env }>();

/**
 * §A34-A41 Compact Save — the frontend zips this into the actual .zip file
 * (client-side, via a JS zip library) and triggers the download; the
 * backend just assembles the content. No R2 assets included (§A38 Full
 * Archive with portraits/etc. is a stretch not built this pass).
 */
backupRoute.get('/:id/export', async (c) => {
  const simulationId = c.req.param('id');
  const state = await getSimulationState(c.env.DB, simulationId);
  if (!state) {
    return c.json({ error: 'Simulation not found.' }, 404);
  }

  const manifest: BackupManifest = {
    formatVersion: 1,
    simulationId: state.simulationId,
    simulationName: state.label,
    stateVersion: state.stateVersion,
    worldDate: state.currentWorldDate,
    createdAt: new Date().toISOString(),
    includesAssets: false,
  };

  return c.json({
    manifest,
    simulation: state,
    markdown: buildExportMarkdown(state),
  });
});

/**
 * §A42 Import Backup, §A43 "Import creates new timeline/save" — never
 * overwrites an existing simulation, always lands as a brand-new one the
 * player can then switch to or discard.
 */
backupRoute.post('/import', async (c) => {
  const body = await c.req.json<{ manifest?: unknown; simulation?: unknown; label?: string }>().catch(() => null);
  if (!body) {
    return c.json({ error: 'Request body must be JSON.' }, 400);
  }

  const manifestCheck = validateBackupManifest(body.manifest);
  if (!manifestCheck.ok) {
    return c.json({ error: manifestCheck.error }, 400);
  }

  const snapshotCheck = validateImportSnapshot(body.simulation);
  if (!snapshotCheck.ok) {
    return c.json({ error: snapshotCheck.error }, 400);
  }

  const label = body.label?.trim() || (body.manifest as BackupManifest).simulationName || 'Imported Timeline';

  const summary = await importSimulationSnapshot(c.env.DB, snapshotCheck.snapshot, label);
  if (!summary) {
    return c.json({ error: 'Import failed.' }, 500);
  }
  return c.json(summary);
});
