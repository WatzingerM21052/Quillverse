import type { ProviderId } from '../providers/types';

/** Usage/audit log (addendum-v1.2-byok.md B45-B46, §156 Model Cost/Limit UI) — never stores keys, only call metadata. */
export async function logAiCall(
  db: D1Database,
  simulationId: string,
  provider: ProviderId,
  success: boolean,
  durationMs: number,
  errorType: string | null,
): Promise<void> {
  await db
    .prepare(
      `INSERT INTO ai_calls (id, simulation_id, provider, success, duration_ms, error_type)
       VALUES (?, ?, ?, ?, ?, ?)`,
    )
    .bind(crypto.randomUUID(), simulationId, provider, success ? 1 : 0, durationMs, errorType)
    .run();
}

interface CallCountRow {
  provider: string;
  count: number;
}

/** Every attempt counts against a provider's daily rate limit, successful or not — §156. */
export async function getTodaysCallCounts(db: D1Database): Promise<Record<string, number>> {
  const { results } = await db
    .prepare(`SELECT provider, COUNT(*) AS count FROM ai_calls WHERE date(timestamp) = date('now') GROUP BY provider`)
    .all<CallCountRow>();

  return Object.fromEntries(results.map((row) => [row.provider, row.count]));
}
