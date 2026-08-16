import type { SimulationStateResponse, SimulationSummary } from '../models';
import { buildChildInsertStatements } from './savepoints';
import { getSimulationState } from './simulation-repository';

/**
 * §A42 Import Backup, §A43 "Import creates new timeline/save" — never
 * overwrites an existing simulation. Reuses the exact same child-table
 * insert logic as forkSavepoint (buildChildInsertStatements); the only
 * difference is the snapshot comes from an uploaded file instead of a
 * savepoints row, and parent_simulation_id is NULL (an imported backup
 * isn't a fork of anything already in this database).
 */
export async function importSimulationSnapshot(
  db: D1Database,
  snapshot: SimulationStateResponse,
  label: string,
): Promise<SimulationSummary | null> {
  const newSimulationId = crypto.randomUUID();

  const statements = [
    db
      .prepare(
        `INSERT INTO simulations (id, label, world_pack_id, state_version, current_world_date, current_season, player_id, social_access_level, world_status_json, farm_json, finance_ledger_json, open_threads_json, parent_simulation_id, tone_preferences_json)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '[]', ?, NULL, '{}')`,
      )
      .bind(
        newSimulationId,
        label,
        snapshot.worldPackId,
        snapshot.stateVersion,
        snapshot.currentWorldDate,
        snapshot.currentSeason,
        snapshot.playerId,
        snapshot.socialAccessLevel,
        JSON.stringify(snapshot.worldStatus),
        JSON.stringify(snapshot.farm),
        JSON.stringify(snapshot.openThreads),
      ),
    ...buildChildInsertStatements(db, newSimulationId, snapshot),
  ];

  await db.batch(statements);

  const state = await getSimulationState(db, newSimulationId);
  if (!state) return null;

  return {
    id: newSimulationId,
    label,
    worldPackId: snapshot.worldPackId,
    currentWorldDate: snapshot.currentWorldDate,
    stateVersion: snapshot.stateVersion,
    playerName: snapshot.characters[snapshot.playerId]?.name ?? null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    parentSimulationId: null,
  };
}
