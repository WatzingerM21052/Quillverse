import { env } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';
import { createAutoSnapshot, undoLastTurn } from '../src/db/savepoints';
import { getSimulationState } from '../src/db/simulation-repository';

// Migrations seed 'sim_default' (Matthias Hale) — same fixture prod starts from.
const SIM_ID = 'sim_default';

describe('createAutoSnapshot / undoLastTurn round trip', () => {
  it('restores the pre-turn state, is single-use, and drops the turn log entry it undoes', async () => {
    const before = await getSimulationState(env.DB, SIM_ID);
    expect(before).not.toBeNull();
    const originalStateVersion = before!.stateVersion;

    // Snapshot "before the turn", same as turns.ts does right before applyTurn.
    await createAutoSnapshot(env.DB, SIM_ID);

    // Simulate a turn having been applied: bump state_version and log a turn row.
    await env.DB.prepare('UPDATE simulations SET state_version = state_version + 1 WHERE id = ?').bind(SIM_ID).run();
    await env.DB.prepare(
      `INSERT INTO turns (id, simulation_id, turn_number, state_version_before, state_version_after, world_time_before, world_time_after, player_input)
       VALUES (?, ?, 1, ?, ?, ?, ?, ?)`,
    )
      .bind(
        crypto.randomUUID(),
        SIM_ID,
        originalStateVersion,
        originalStateVersion + 1,
        before!.currentWorldDate,
        before!.currentWorldDate,
        'test action',
      )
      .run();

    const afterTurn = await getSimulationState(env.DB, SIM_ID);
    expect(afterTurn!.stateVersion).toBe(originalStateVersion + 1);

    const restored = await undoLastTurn(env.DB, SIM_ID);
    expect(restored).not.toBeNull();
    expect(restored!.stateVersion).toBe(originalStateVersion);

    const { results: turnRows } = await env.DB.prepare('SELECT id FROM turns WHERE simulation_id = ?').bind(SIM_ID).all();
    expect(turnRows.length).toBe(0);

    // Single-use: nothing left to undo a second time.
    const secondUndo = await undoLastTurn(env.DB, SIM_ID);
    expect(secondUndo).toBeNull();
  });

  it('autosaves never show up in the player-facing savepoints list', async () => {
    await createAutoSnapshot(env.DB, SIM_ID);
    const { listSavepoints } = await import('../src/db/savepoints');
    const list = await listSavepoints(env.DB, SIM_ID);
    expect(list.every((sp) => sp.label !== '__autosave__')).toBe(true);
  });
});
