import type { SimulationStateResponse } from '../models';
import { getSimulationState } from './simulation-repository';

export interface SavepointSummary {
  id: string;
  label: string;
  stateVersion: number;
  createdAt: string;
}

interface SavepointRow {
  id: string;
  label: string;
  state_version: number;
  snapshot_json: string;
  created_at: string;
}

export async function createSavepoint(db: D1Database, simulationId: string, label: string): Promise<SavepointSummary | null> {
  const state = await getSimulationState(db, simulationId);
  if (!state) return null;

  const id = crypto.randomUUID();
  await db
    .prepare('INSERT INTO savepoints (id, simulation_id, label, state_version, snapshot_json) VALUES (?, ?, ?, ?, ?)')
    .bind(id, simulationId, label, state.stateVersion, JSON.stringify(state))
    .run();

  const row = await db
    .prepare('SELECT id, label, state_version, created_at FROM savepoints WHERE id = ?')
    .bind(id)
    .first<Omit<SavepointRow, 'snapshot_json'>>();

  if (!row) return null;
  return { id: row.id, label: row.label, stateVersion: row.state_version, createdAt: row.created_at };
}

export async function listSavepoints(db: D1Database, simulationId: string): Promise<SavepointSummary[]> {
  const { results } = await db
    .prepare('SELECT id, label, state_version, created_at FROM savepoints WHERE simulation_id = ? ORDER BY created_at DESC')
    .bind(simulationId)
    .all<Omit<SavepointRow, 'snapshot_json'>>();

  return results.map((row) => ({ id: row.id, label: row.label, stateVersion: row.state_version, createdAt: row.created_at }));
}

const CHILD_TABLES = [
  'characters',
  'relationships',
  'locations',
  'memories',
  'letters',
  'canon_events',
  'finance_transactions',
  'world_events',
  'social_calendar',
  'chapters',
] as const;

/** Wholesale replace — a restore is a rollback, not a merge (§153-155 Undo/Branching). */
export async function restoreSavepoint(
  db: D1Database,
  simulationId: string,
  savepointId: string,
): Promise<SimulationStateResponse | null> {
  const row = await db
    .prepare('SELECT snapshot_json, state_version FROM savepoints WHERE id = ? AND simulation_id = ?')
    .bind(savepointId, simulationId)
    .first<{ snapshot_json: string; state_version: number }>();

  if (!row) return null;

  const snapshot = JSON.parse(row.snapshot_json) as SimulationStateResponse;
  const statements: D1PreparedStatement[] = [];

  for (const table of CHILD_TABLES) {
    statements.push(db.prepare(`DELETE FROM ${table} WHERE simulation_id = ?`).bind(simulationId));
  }

  for (const character of Object.values(snapshot.characters)) {
    statements.push(
      db
        .prepare(
          `INSERT INTO characters (id, simulation_id, name, is_canon, is_player, location_id, appearance_json, visual_state_json, personality_json, goals_json, player_knowledge_json, gm_state_json)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        )
        .bind(
          character.id,
          simulationId,
          character.name,
          character.isCanon ? 1 : 0,
          character.isPlayer ? 1 : 0,
          character.locationId,
          JSON.stringify(character.appearance),
          JSON.stringify(character.visualState),
          JSON.stringify(character.personality),
          JSON.stringify(character.goals),
          JSON.stringify(character.playerKnowledge),
          JSON.stringify(character.gmState),
        ),
    );
  }

  for (const relationship of snapshot.relationships) {
    statements.push(
      db
        .prepare(
          `INSERT INTO relationships (simulation_id, from_id, to_id, type, dimensions_json, momentum, attention, last_contact, public_stance, private_stance, misconceptions_json, personal_boundaries_json)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        )
        .bind(
          simulationId,
          relationship.from,
          relationship.to,
          relationship.type,
          JSON.stringify(relationship.dimensions),
          relationship.momentum,
          relationship.attention,
          relationship.lastContact,
          relationship.publicStance,
          relationship.privateStance,
          JSON.stringify(relationship.misconceptions),
          JSON.stringify(relationship.personalBoundaries),
        ),
    );
  }

  for (const location of Object.values(snapshot.locations)) {
    statements.push(
      db
        .prepare(
          `INSERT INTO locations (id, simulation_id, name, type, discovered, base_asset, map_x, map_y, travel_json)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        )
        .bind(
          location.id,
          simulationId,
          location.name,
          location.type,
          location.discovered ? 1 : 0,
          location.baseAsset,
          location.mapPosition.x,
          location.mapPosition.y,
          location.travel ? JSON.stringify(location.travel) : null,
        ),
    );
  }

  for (const memory of Object.values(snapshot.memories)) {
    statements.push(
      db
        .prepare(
          `INSERT INTO memories (id, simulation_id, entity_ids_json, world_date, type, importance, fact, interpretation_json, status, reach, fading, tags_json)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        )
        .bind(
          memory.id,
          simulationId,
          JSON.stringify(memory.entityIds),
          memory.worldDate,
          memory.type,
          memory.importance,
          memory.fact,
          JSON.stringify(memory.interpretation),
          memory.status,
          memory.reach,
          memory.fading,
          JSON.stringify(memory.tags),
        ),
    );
  }

  for (const letter of Object.values(snapshot.letters)) {
    statements.push(
      db
        .prepare(
          `INSERT INTO letters (id, simulation_id, sender_id, recipient_id, date_written, date_sent, date_arrived, content, status, known_by_json)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        )
        .bind(
          letter.id,
          simulationId,
          letter.senderId,
          letter.recipientId,
          letter.dateWritten,
          letter.dateSent,
          letter.dateArrived,
          letter.content,
          letter.status,
          JSON.stringify(letter.knownBy),
        ),
    );
  }

  for (const event of Object.values(snapshot.canonEvents) as Array<Record<string, unknown>>) {
    statements.push(
      db
        .prepare(
          `INSERT INTO canon_events (id, simulation_id, name, original_course, requirements_json, window_json, status, player_influence, current_likely_variant, consequences_json)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        )
        .bind(
          event['id'],
          simulationId,
          event['name'],
          event['originalCourse'],
          JSON.stringify(event['requirements'] ?? []),
          JSON.stringify(event['window'] ?? {}),
          event['status'],
          event['playerInfluence'],
          event['currentLikelyVariant'],
          JSON.stringify(event['consequences'] ?? []),
        ),
    );
  }

  for (const transaction of snapshot.financeLedger as Array<{ id: string; date: string; description: string; amount: number }>) {
    statements.push(
      db
        .prepare('INSERT INTO finance_transactions (id, simulation_id, date, description, amount) VALUES (?, ?, ?, ?, ?)')
        .bind(transaction.id, simulationId, transaction.date, transaction.description, transaction.amount),
    );
  }

  for (const event of snapshot.worldEvents as Array<{ id: string; category: string; title: string; description: string; date: string }>) {
    statements.push(
      db
        .prepare('INSERT INTO world_events (id, simulation_id, category, title, description, date) VALUES (?, ?, ?, ?, ?, ?)')
        .bind(event.id, simulationId, event.category, event.title, event.description, event.date),
    );
  }

  for (const entry of snapshot.socialCalendar as Array<{ id: string; title: string; date: string; host: string; location: string; access: string }>) {
    statements.push(
      db
        .prepare('INSERT INTO social_calendar (id, simulation_id, title, date, host, location, access) VALUES (?, ?, ?, ?, ?, ?, ?)')
        .bind(entry.id, simulationId, entry.title, entry.date, entry.host, entry.location, entry.access),
    );
  }

  for (const chapter of snapshot.chapters as Array<{ id: string; number: number; title: string; summary: string; startDate: string }>) {
    statements.push(
      db
        .prepare('INSERT INTO chapters (id, simulation_id, number, title, summary, start_date) VALUES (?, ?, ?, ?, ?, ?)')
        .bind(chapter.id, simulationId, chapter.number, chapter.title, chapter.summary, chapter.startDate),
    );
  }

  statements.push(
    db
      .prepare(
        `UPDATE simulations SET
           state_version = ?, current_world_date = ?, current_season = ?, player_id = ?,
           social_access_level = ?, world_status_json = ?, farm_json = ?, open_threads_json = ?,
           updated_at = datetime('now')
         WHERE id = ?`,
      )
      .bind(
        snapshot.stateVersion,
        snapshot.currentWorldDate,
        snapshot.currentSeason,
        snapshot.playerId,
        snapshot.socialAccessLevel,
        JSON.stringify(snapshot.worldStatus),
        JSON.stringify(snapshot.farm),
        JSON.stringify(snapshot.openThreads),
        simulationId,
      ),
  );

  await db.batch(statements);

  return getSimulationState(db, simulationId);
}
