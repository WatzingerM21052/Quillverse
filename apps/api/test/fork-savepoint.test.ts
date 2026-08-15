import { env } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';
import { createSavepoint, forkSavepoint } from '../src/db/savepoints';

const SOURCE_SIM_ID = 'sim_default';

describe('forkSavepoint', () => {
  it('creates an independent simulation with the correct parent and preserved entity ids', async () => {
    const savepoint = await createSavepoint(env.DB, SOURCE_SIM_ID, 'Test Savepoint');
    expect(savepoint).not.toBeNull();

    const fork = await forkSavepoint(env.DB, SOURCE_SIM_ID, savepoint!.id, 'Test Fork');
    expect(fork).not.toBeNull();
    expect(fork!.id).not.toBe(SOURCE_SIM_ID);
    expect(fork!.parentSimulationId).toBe(SOURCE_SIM_ID);
    expect(fork!.playerName).toBe('Matthias Hale');

    // Composite PK proof: the same entity id exists under both simulation_ids.
    const forkedPlayer = await env.DB.prepare('SELECT name FROM characters WHERE id = ? AND simulation_id = ?')
      .bind('char_player_matthias', fork!.id)
      .first<{ name: string }>();
    expect(forkedPlayer?.name).toBe('Matthias Hale');

    const sourcePlayer = await env.DB.prepare('SELECT name FROM characters WHERE id = ? AND simulation_id = ?')
      .bind('char_player_matthias', SOURCE_SIM_ID)
      .first<{ name: string }>();
    expect(sourcePlayer?.name).toBe('Matthias Hale');

    // The source simulation is untouched by the fork.
    const sourceRow = await env.DB.prepare('SELECT parent_simulation_id FROM simulations WHERE id = ?')
      .bind(SOURCE_SIM_ID)
      .first<{ parent_simulation_id: string | null }>();
    expect(sourceRow?.parent_simulation_id).toBeNull();
  });

  it('returns null for a savepoint id that does not belong to the source simulation', async () => {
    const fork = await forkSavepoint(env.DB, SOURCE_SIM_ID, 'not-a-real-savepoint-id', 'Should Not Exist');
    expect(fork).toBeNull();
  });
});
