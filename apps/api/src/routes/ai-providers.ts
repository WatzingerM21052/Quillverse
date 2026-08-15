import { Hono } from 'hono';
import { PROVIDER_ADAPTERS } from '../providers/registry';
import { PROVIDER_IDS, type ProviderId } from '../providers/types';
import { decryptCredential, encryptCredential, keyHint } from '../crypto/credential-encryption';
import { getTodaysCallCounts } from '../db/ai-calls';

// Single-owner install (addendum-v1.2-byok.md B23) — no account system yet.
const OWNER_USER_ID = 'owner';

interface CredentialRow {
  provider: ProviderId;
  key_hint: string | null;
  status: string;
  last_verified_at: string | null;
}

function isProviderId(value: string): value is ProviderId {
  return (PROVIDER_IDS as string[]).includes(value);
}

export const aiProvidersRoute = new Hono<{ Bindings: Env }>();

// B15 — never an endpoint that returns the actual key, only status + hint.
aiProvidersRoute.get('/', async (c) => {
  const { results } = await c.env.DB.prepare(
    'SELECT provider, key_hint, status, last_verified_at FROM ai_provider_credentials WHERE user_id = ?',
  )
    .bind(OWNER_USER_ID)
    .all<CredentialRow>();

  const byProvider = new Map(results.map((row) => [row.provider, row]));
  const requestsToday = await getTodaysCallCounts(c.env.DB);

  return c.json(
    PROVIDER_IDS.map((provider) => {
      const row = byProvider.get(provider);
      return {
        provider,
        connected: row?.status === 'connected',
        status: row?.status ?? 'not-configured',
        keyHint: row?.key_hint ?? null,
        lastVerifiedAt: row?.last_verified_at ?? null,
        requestsToday: requestsToday[provider] ?? 0,
      };
    }),
  );
});

// Test & Save flow (B7): validate against the real provider before ever persisting anything.
aiProvidersRoute.post('/:provider', async (c) => {
  const provider = c.req.param('provider');
  if (!isProviderId(provider)) {
    return c.json({ error: 'Unknown provider.' }, 400);
  }

  const body = await c.req.json<{ apiKey?: string }>().catch(() => null);
  const apiKey = body?.apiKey?.trim();
  if (!apiKey) {
    return c.json({ error: 'API key is required.' }, 400);
  }

  const adapter = PROVIDER_ADAPTERS[provider];
  const validation = await adapter.validateCredential(apiKey);
  if (!validation.ok) {
    return c.json({ error: validation.message ?? 'The API key could not be authenticated.' }, 400);
  }

  const encrypted = await encryptCredential(c.env, apiKey);
  const hint = keyHint(apiKey);
  const id = crypto.randomUUID();

  await c.env.DB.prepare(
    `INSERT INTO ai_provider_credentials (id, user_id, provider, encrypted_api_key, encryption_iv, encryption_version, key_hint, last_verified_at, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), 'connected')
     ON CONFLICT(user_id, provider) DO UPDATE SET
       encrypted_api_key = excluded.encrypted_api_key,
       encryption_iv = excluded.encryption_iv,
       encryption_version = excluded.encryption_version,
       key_hint = excluded.key_hint,
       last_verified_at = excluded.last_verified_at,
       status = 'connected',
       updated_at = datetime('now')`,
  )
    .bind(id, OWNER_USER_ID, provider, encrypted.ciphertext, encrypted.iv, encrypted.encryptionVersion, hint)
    .run();

  return c.json({ provider, connected: true, keyHint: hint });
});

aiProvidersRoute.delete('/:provider', async (c) => {
  const provider = c.req.param('provider');
  if (!isProviderId(provider)) {
    return c.json({ error: 'Unknown provider.' }, 400);
  }

  await c.env.DB.prepare('DELETE FROM ai_provider_credentials WHERE user_id = ? AND provider = ?')
    .bind(OWNER_USER_ID, provider)
    .run();

  return c.json({ provider, connected: false });
});

/** Internal helper for future AI Orchestrator use — never exposed via HTTP (B15). */
export async function getDecryptedCredential(env: Env, provider: ProviderId): Promise<string | null> {
  const row = await env.DB.prepare(
    'SELECT encrypted_api_key, encryption_iv FROM ai_provider_credentials WHERE user_id = ? AND provider = ?',
  )
    .bind(OWNER_USER_ID, provider)
    .first<{ encrypted_api_key: string; encryption_iv: string }>();

  if (!row) return null;
  return decryptCredential(env, row.encrypted_api_key, row.encryption_iv);
}
