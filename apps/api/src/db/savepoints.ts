import type { SimulationStateResponse, SimulationSummary } from '../models';
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

/** Reserved label marking the §153 Undo Last Turn buffer — never shown in the player-facing Save Points list. */
const AUTOSAVE_LABEL = '__autosave__';

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
    .prepare(
      'SELECT id, label, state_version, created_at FROM savepoints WHERE simulation_id = ? AND label != ? ORDER BY created_at DESC',
    )
    .bind(simulationId, AUTOSAVE_LABEL)
    .all<Omit<SavepointRow, 'snapshot_json'>>();

  return results.map((row) => ({ id: row.id, label: row.label, stateVersion: row.state_version, createdAt: row.created_at }));
}

/**
 * §153 Undo Last Turn — call right before applying a turn (Manual Relay
 * commit or a direct-API generate) so there is always exactly one
 * "pre-turn" snapshot to fall back to. Depth 1: a new turn's autosave
 * replaces the previous one, this is an undo buffer, not a history.
 */
export async function createAutoSnapshot(db: D1Database, simulationId: string): Promise<void> {
  await db.prepare('DELETE FROM savepoints WHERE simulation_id = ? AND label = ?').bind(simulationId, AUTOSAVE_LABEL).run();
  await createSavepoint(db, simulationId, AUTOSAVE_LABEL);
}

/** Restores the pre-turn autosave (if any) and removes both it and the turn log entry it undoes. */
export async function undoLastTurn(db: D1Database, simulationId: string): Promise<SimulationStateResponse | null> {
  const autosave = await db
    .prepare('SELECT id FROM savepoints WHERE simulation_id = ? AND label = ?')
    .bind(simulationId, AUTOSAVE_LABEL)
    .first<{ id: string }>();
  if (!autosave) return null;

  const state = await restoreSavepoint(db, simulationId, autosave.id);
  if (!state) return null;

  await db.batch([
    db.prepare('DELETE FROM savepoints WHERE id = ?').bind(autosave.id),
    db.prepare(
      `DELETE FROM turns WHERE id = (
         SELECT id FROM turns WHERE simulation_id = ? ORDER BY turn_number DESC LIMIT 1
       )`,
    ).bind(simulationId),
  ]);

  return state;
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
  'inventory',
  'whistledown_issues',
  'reputation',
  'influence',
  'favors',
  'rumors',
  'secrets',
  'scandals',
  'obligations',
  'causality_log',
] as const;

/** Every child-table insert for one snapshot, targeting `simulationId` — shared by restore (overwrite) and fork (new id). */
function buildChildInsertStatements(db: D1Database, simulationId: string, snapshot: SimulationStateResponse): D1PreparedStatement[] {
  const statements: D1PreparedStatement[] = [];

  for (const character of Object.values(snapshot.characters)) {
    statements.push(
      db
        .prepare(
          `INSERT INTO characters (id, simulation_id, name, is_canon, is_player, location_id, appearance_json, visual_state_json, personality_json, goals_json, player_knowledge_json, gm_state_json, skills_json, wardrobe_json)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
          JSON.stringify(character.skills),
          JSON.stringify(character.wardrobe),
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

  for (const item of snapshot.inventory) {
    statements.push(
      db
        .prepare('INSERT INTO inventory (id, simulation_id, owner_id, name, description) VALUES (?, ?, ?, ?, ?)')
        .bind(item.id, simulationId, item.ownerId, item.name, item.description),
    );
  }

  for (const issue of snapshot.whistledownIssues as Array<{ id: string; issueNumber: number; date: string; headline: string; body: string[] }>) {
    statements.push(
      db
        .prepare('INSERT INTO whistledown_issues (id, simulation_id, issue_number, date, headline, body_json) VALUES (?, ?, ?, ?, ?, ?)')
        .bind(issue.id, simulationId, issue.issueNumber, issue.date, issue.headline, JSON.stringify(issue.body)),
    );
  }

  for (const entry of snapshot.reputation) {
    statements.push(
      db
        .prepare('INSERT INTO reputation (simulation_id, character_id, scope, standing) VALUES (?, ?, ?, ?)')
        .bind(simulationId, entry.characterId, entry.scope, entry.standing),
    );
  }

  for (const entry of snapshot.influence) {
    statements.push(
      db
        .prepare('INSERT INTO influence (id, simulation_id, character_id, source, description) VALUES (?, ?, ?, ?, ?)')
        .bind(entry.id, simulationId, entry.characterId, entry.source, entry.description),
    );
  }

  for (const favor of snapshot.favors) {
    statements.push(
      db
        .prepare('INSERT INTO favors (id, simulation_id, person_id, direction, description, publicly_known, fulfilled) VALUES (?, ?, ?, ?, ?, ?, ?)')
        .bind(favor.id, simulationId, favor.personId, favor.direction, favor.description, favor.publiclyKnown ? 1 : 0, favor.fulfilled ? 1 : 0),
    );
  }

  for (const rumor of snapshot.rumors) {
    statements.push(
      db
        .prepare('INSERT INTO rumors (id, simulation_id, content, truth_status, reach, known_by_json, origin_date) VALUES (?, ?, ?, ?, ?, ?, ?)')
        .bind(rumor.id, simulationId, rumor.content, rumor.truthStatus, rumor.reach, JSON.stringify(rumor.knownBy), rumor.originDate),
    );
  }

  for (const secret of snapshot.secrets) {
    statements.push(
      db
        .prepare(
          'INSERT INTO secrets (id, simulation_id, description, truth, known_by_json, suspected_by_json, player_knows) VALUES (?, ?, ?, ?, ?, ?, ?)',
        )
        .bind(
          secret.id,
          simulationId,
          secret.description,
          secret.truth,
          JSON.stringify(secret.knownBy),
          JSON.stringify(secret.suspectedBy),
          secret.playerKnows ? 1 : 0,
        ),
    );
  }

  for (const scandal of snapshot.scandals) {
    statements.push(
      db
        .prepare('INSERT INTO scandals (id, simulation_id, description, severity, date, involved_json) VALUES (?, ?, ?, ?, ?, ?)')
        .bind(scandal.id, simulationId, scandal.description, scandal.severity, scandal.date, JSON.stringify(scandal.involved)),
    );
  }

  for (const obligation of snapshot.obligations) {
    statements.push(
      db
        .prepare('INSERT INTO obligations (id, simulation_id, description, owed_to, deadline, status) VALUES (?, ?, ?, ?, ?, ?)')
        .bind(obligation.id, simulationId, obligation.description, obligation.owedTo, obligation.deadline, obligation.status),
    );
  }

  for (const entry of snapshot.causalityLog) {
    statements.push(
      db
        .prepare(
          `INSERT INTO causality_log (id, simulation_id, event, cause, direct_consequences_json, secondary_consequences_json, long_term_consequences_json, date)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        )
        .bind(
          entry.id,
          simulationId,
          entry.event,
          entry.cause,
          JSON.stringify(entry.directConsequences),
          JSON.stringify(entry.secondaryConsequences),
          JSON.stringify(entry.longTermConsequences),
          entry.date,
        ),
    );
  }

  for (const chapter of snapshot.chapters as Array<{ id: string; number: number; title: string; summary: string; startDate: string }>) {
    statements.push(
      db
        .prepare('INSERT INTO chapters (id, simulation_id, number, title, summary, start_date) VALUES (?, ?, ?, ?, ?, ?)')
        .bind(chapter.id, simulationId, chapter.number, chapter.title, chapter.summary, chapter.startDate),
    );
  }

  return statements;
}

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

  statements.push(...buildChildInsertStatements(db, simulationId, snapshot));

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

/**
 * Fork (§154-155 Branching Timelines): unlike restore, the source simulation
 * is left untouched — this creates a brand new simulation row and copies the
 * snapshot into it under a fresh id, so both timelines keep existing.
 */
export async function forkSavepoint(
  db: D1Database,
  sourceSimulationId: string,
  savepointId: string,
  label: string,
): Promise<SimulationSummary | null> {
  const row = await db
    .prepare('SELECT snapshot_json FROM savepoints WHERE id = ? AND simulation_id = ?')
    .bind(savepointId, sourceSimulationId)
    .first<{ snapshot_json: string }>();

  if (!row) return null;

  const snapshot = JSON.parse(row.snapshot_json) as SimulationStateResponse;
  const newSimulationId = crypto.randomUUID();

  const statements: D1PreparedStatement[] = [
    db
      .prepare(
        `INSERT INTO simulations (id, label, world_pack_id, state_version, current_world_date, current_season, player_id, social_access_level, world_status_json, farm_json, finance_ledger_json, open_threads_json, parent_simulation_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '[]', ?, ?)`,
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
        sourceSimulationId,
      ),
    ...buildChildInsertStatements(db, newSimulationId, snapshot),
  ];

  await db.batch(statements);

  return {
    id: newSimulationId,
    label,
    worldPackId: snapshot.worldPackId,
    currentWorldDate: snapshot.currentWorldDate,
    stateVersion: snapshot.stateVersion,
    playerName: snapshot.characters[snapshot.playerId]?.name ?? null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    parentSimulationId: sourceSimulationId,
  };
}
