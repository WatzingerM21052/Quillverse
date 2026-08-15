import type { ManualTurnResponse } from '../models';
import { getSimulationState } from './simulation-repository';

const DIMENSION_KEYS = [
  'acquaintance', 'liking', 'trust', 'respect', 'familiarity', 'sharedHumor',
  'emotionalCloseness', 'intellectualConnection', 'physicalAttraction', 'aestheticAttraction',
  'romanticCuriosity', 'romanticInterest', 'romanticFeelings', 'romanticTension', 'sexualTension',
  'desireForCloseness', 'loyalty', 'protectiveness', 'socialAcceptance', 'willingnessToMarry',
  'distrust', 'insecurity', 'hurt', 'anger', 'jealousy', 'rivalry', 'fear', 'dependency',
];

function zeroDimensions(): Record<string, number> {
  return Object.fromEntries(DIMENSION_KEYS.map((key) => [key, 0]));
}

export type ApplyTurnResult =
  | { ok: true; state: Awaited<ReturnType<typeof getSimulationState>> }
  | { ok: false; status: number; error: string };

interface SimulationCoreRow {
  state_version: number;
  current_world_date: string;
  world_status_json: string;
  open_threads_json: string;
}

interface RelationshipCoreRow {
  from_id: string;
  to_id: string;
  type: string;
  dimensions_json: string;
  momentum: string;
  attention: string;
  last_contact: string | null;
  public_stance: string;
  private_stance: string;
  misconceptions_json: string;
  personal_boundaries_json: string;
}

interface CanonEventCoreRow {
  id: string;
  name: string;
  original_course: string;
  requirements_json: string;
  window_json: string;
  status: string;
  player_influence: string;
  current_likely_variant: string;
  consequences_json: string;
}

/**
 * Validates the stateVersion the response was generated against, then applies
 * the whole patch as one atomic D1 batch (§88/A28 — patches, never full
 * rewrites; A30-A32 — stale responses must never silently commit).
 */
export async function applyTurn(
  db: D1Database,
  simulationId: string,
  playerAction: string,
  baseStateVersion: number,
  provider: string,
  response: ManualTurnResponse,
): Promise<ApplyTurnResult> {
  const simulation = await db
    .prepare('SELECT state_version, current_world_date, world_status_json, open_threads_json FROM simulations WHERE id = ?')
    .bind(simulationId)
    .first<SimulationCoreRow>();

  if (!simulation) {
    return { ok: false, status: 404, error: 'Simulation not found.' };
  }

  if (simulation.state_version !== baseStateVersion) {
    return {
      ok: false,
      status: 409,
      error: `This response is based on world state ${baseStateVersion}, but the current state is ${simulation.state_version}. Regenerate the context package and try again.`,
    };
  }

  const patch = response.statePatch;
  const statements: D1PreparedStatement[] = [];

  if (patch.relationshipUpdates?.length) {
    const existingRows = await db
      .prepare('SELECT * FROM relationships WHERE simulation_id = ?')
      .bind(simulationId)
      .all<RelationshipCoreRow>();
    const existingByKey = new Map(existingRows.results.map((row) => [`${row.from_id}|${row.to_id}`, row]));

    for (const update of patch.relationshipUpdates) {
      const key = `${update.from}|${update.to}`;
      const existing = existingByKey.get(key);
      const mergedDimensions = {
        ...(existing ? JSON.parse(existing.dimensions_json) : zeroDimensions()),
        ...(update.dimensions ?? {}),
      };

      statements.push(
        db
          .prepare(
            `INSERT INTO relationships (simulation_id, from_id, to_id, type, dimensions_json, momentum, attention, last_contact, public_stance, private_stance, misconceptions_json, personal_boundaries_json)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON CONFLICT(simulation_id, from_id, to_id) DO UPDATE SET
               type = excluded.type,
               dimensions_json = excluded.dimensions_json,
               momentum = excluded.momentum,
               attention = excluded.attention,
               last_contact = excluded.last_contact,
               public_stance = excluded.public_stance,
               private_stance = excluded.private_stance,
               misconceptions_json = excluded.misconceptions_json,
               personal_boundaries_json = excluded.personal_boundaries_json`,
          )
          .bind(
            simulationId,
            update.from,
            update.to,
            update.type ?? existing?.type ?? 'acquaintance',
            JSON.stringify(mergedDimensions),
            update.momentum ?? existing?.momentum ?? 'stable',
            update.attention ?? existing?.attention ?? 'low',
            update.lastContact ?? existing?.last_contact ?? null,
            update.publicStance ?? existing?.public_stance ?? '',
            update.privateStance ?? existing?.private_stance ?? '',
            JSON.stringify(update.misconceptions ?? (existing ? JSON.parse(existing.misconceptions_json) : [])),
            JSON.stringify(update.personalBoundaries ?? (existing ? JSON.parse(existing.personal_boundaries_json) : [])),
          ),
      );
    }
  }

  for (const memory of patch.newMemories ?? []) {
    statements.push(
      db
        .prepare(
          `INSERT INTO memories (id, simulation_id, entity_ids_json, world_date, type, importance, fact, interpretation_json, status, reach, fading, tags_json)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        )
        .bind(
          memory.id,
          simulationId,
          JSON.stringify(memory.entityIds ?? []),
          memory.worldDate,
          memory.type,
          memory.importance,
          memory.fact,
          JSON.stringify(memory.interpretation ?? {}),
          memory.status,
          memory.reach,
          memory.fading,
          JSON.stringify(memory.tags ?? []),
        ),
    );
  }

  if (patch.canonUpdates?.length) {
    const existingRows = await db
      .prepare('SELECT * FROM canon_events WHERE simulation_id = ?')
      .bind(simulationId)
      .all<CanonEventCoreRow>();
    const existingById = new Map(existingRows.results.map((row) => [row.id, row]));

    for (const update of patch.canonUpdates) {
      const existing = existingById.get(update.id);
      statements.push(
        db
          .prepare(
            `INSERT INTO canon_events (id, simulation_id, name, original_course, requirements_json, window_json, status, player_influence, current_likely_variant, consequences_json)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON CONFLICT(id) DO UPDATE SET
               name = excluded.name,
               original_course = excluded.original_course,
               requirements_json = excluded.requirements_json,
               window_json = excluded.window_json,
               status = excluded.status,
               player_influence = excluded.player_influence,
               current_likely_variant = excluded.current_likely_variant,
               consequences_json = excluded.consequences_json`,
          )
          .bind(
            update.id,
            simulationId,
            update.name ?? existing?.name ?? update.id,
            update.originalCourse ?? existing?.original_course ?? '',
            JSON.stringify(update.requirements ?? (existing ? JSON.parse(existing.requirements_json) : [])),
            JSON.stringify(update.window ?? (existing ? JSON.parse(existing.window_json) : {})),
            update.status ?? existing?.status ?? 'stable',
            update.playerInfluence ?? existing?.player_influence ?? 'none',
            update.currentLikelyVariant ?? existing?.current_likely_variant ?? '',
            JSON.stringify(update.consequences ?? (existing ? JSON.parse(existing.consequences_json) : [])),
          ),
      );
    }
  }

  for (const transaction of patch.financeUpdates ?? []) {
    statements.push(
      db
        .prepare('INSERT INTO finance_transactions (id, simulation_id, date, description, amount) VALUES (?, ?, ?, ?, ?)')
        .bind(transaction.id, simulationId, transaction.date, transaction.description, transaction.amount),
    );
  }

  for (const letter of patch.newLetters ?? []) {
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
          letter.dateSent ?? null,
          letter.dateArrived ?? null,
          letter.content,
          letter.status,
          JSON.stringify(letter.knownBy ?? []),
        ),
    );
  }

  for (const character of patch.newCharacters ?? []) {
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
          0,
          character.locationId ?? null,
          JSON.stringify(character.appearance ?? {}),
          JSON.stringify(character.visualState ?? {}),
          JSON.stringify(character.personality ?? {}),
          JSON.stringify(character.goals ?? {}),
          JSON.stringify(character.playerKnowledge ?? []),
          JSON.stringify(character.gmState ?? {}),
          JSON.stringify(character.skills ?? {}),
          JSON.stringify(character.wardrobe ?? []),
        ),
    );
  }

  for (const item of patch.newInventoryItems ?? []) {
    statements.push(
      db
        .prepare('INSERT INTO inventory (id, simulation_id, owner_id, name, description) VALUES (?, ?, ?, ?, ?)')
        .bind(item.id, simulationId, item.ownerId, item.name, item.description),
    );
  }

  for (const location of patch.newLocations ?? []) {
    statements.push(
      db
        .prepare(
          `INSERT INTO locations (id, simulation_id, name, type, discovered, base_asset, map_x, map_y, travel_json)
           VALUES (?, ?, ?, ?, 1, ?, ?, ?, ?)`,
        )
        .bind(
          location.id,
          simulationId,
          location.name,
          location.type,
          location.baseAsset ?? '',
          location.mapPosition?.x ?? 50,
          location.mapPosition?.y ?? 50,
          location.travel ? JSON.stringify(location.travel) : null,
        ),
    );
  }

  const worldStatus = { ...JSON.parse(simulation.world_status_json), ...(patch.worldUpdates ?? {}) };
  delete worldStatus.currentWorldDate;
  delete worldStatus.currentSeason;

  const openThreads = new Set<string>(JSON.parse(simulation.open_threads_json));
  for (const thread of patch.openThreadsAdd ?? []) openThreads.add(thread);
  for (const thread of patch.openThreadsRemove ?? []) openThreads.delete(thread);

  statements.push(
    db
      .prepare(
        `UPDATE simulations SET
           state_version = state_version + 1,
           current_world_date = ?,
           current_season = COALESCE(?, current_season),
           world_status_json = ?,
           open_threads_json = ?,
           updated_at = datetime('now')
         WHERE id = ?`,
      )
      .bind(
        response.scene.worldDate,
        patch.worldUpdates?.currentSeason ?? null,
        JSON.stringify(worldStatus),
        JSON.stringify([...openThreads]),
        simulationId,
      ),
  );

  statements.push(
    db
      .prepare(
        `INSERT INTO turns (id, simulation_id, turn_number, state_version_before, state_version_after, world_time_before, world_time_after, player_input, provider, model, scene_output_json, state_patch_json)
         VALUES (?, ?, (SELECT COALESCE(MAX(turn_number), 0) + 1 FROM turns WHERE simulation_id = ?), ?, ?, ?, ?, ?, ?, NULL, ?, ?)`,
      )
      .bind(
        crypto.randomUUID(),
        simulationId,
        simulationId,
        baseStateVersion,
        baseStateVersion + 1,
        simulation.current_world_date,
        response.scene.worldDate,
        playerAction,
        provider,
        JSON.stringify(response.scene),
        JSON.stringify(patch),
      ),
  );

  await db.batch(statements);

  const state = await getSimulationState(db, simulationId);
  return { ok: true, state };
}
