# Continuity Guard + Continuity Model Profile Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close issue #25 (§106 Continuity Guard — optional second AI pass that checks a proposed turn against established state before committing) using a minimal slice of §160 Model Profiles (just the "Continuity" model pointer — see the design spec for why "Narrative"/"Fast" are out of scope).

**Architecture:** New `model_profiles` table storing a single configurable provider+model pointer for the Continuity check. New `continuity-guard.ts` service: a pure `isImportantScene()` heuristic (gates the feature to scenes that matter, unit-tested) plus `checkContinuity()` (a second, lean AI call). Wired into `POST /:id/turn/generate` only — never Manual Relay, which has no guaranteed connected provider. On a flagged contradiction, one bounded retry of the narrative generation, mirroring the existing §188 repair-retry shape. Settings gets a small provider+model picker reusing the existing per-provider model-selector UI pattern; Story Mode's existing provider indicator gets one conditional suffix when a retry actually happened.

**Tech Stack:** Cloudflare Worker + Hono (`apps/api`), D1, Angular standalone components + signals (`apps/web`), Vitest (`@cloudflare/vitest-pool-workers`).

## Global Constraints

- Single-tenant app: `OWNER_USER_ID = 'owner'` (see `apps/api/src/routes/ai-providers.ts:8`) — the new table follows the same keying convention, no multi-user logic anywhere.
- Continuity Guard must never turn a working turn into a failed one: no configured profile → skip entirely; the check call erroring → treated as "no contradiction," logged, turn proceeds. This is non-negotiable — verify it explicitly in Task 4.
- Continuity Guard applies to `POST /:id/turn/generate` (Direct-API) only, never `/:id/commit` (Manual Relay) — Manual Relay's entire premise is "no AI API key needed," so it has no guaranteed provider to run a second call with.
- The "important scene" heuristic is computed from the proposed `StatePatch` alone — no relationship-dimension diffing against current state (deliberately out of scope, see design spec §3).
- On a flagged contradiction: exactly one retry of the narrative generation, then accept whatever comes back regardless (bounded, matches the existing §188 `generateWithRepair` one-retry-then-accept shape — never an unbounded loop).
- No new frontend test files — this app has no unit-test suite wired into CI (only the unmodified Angular CLI default `apps/web/src/app/app.spec.ts` exists). Backend gets real Vitest coverage for the one genuinely pure, testable piece (`isImportantScene`); the AI-call pieces (`checkContinuity`, the route-level retry wiring) stay manual-verification-only, consistent with `generateStory`/`generateWithRepair`/A32 fallback having no direct test today either.
- Every task ends with `git commit`; keep commits scoped to one task each.

---

### Task 1: Migration — `model_profiles` table

**Files:**
- Create: `apps/api/migrations/0015_add_model_profiles.sql`

**Interfaces:**
- Produces: a `model_profiles` table — `(user_id TEXT, profile TEXT, provider TEXT, model_id TEXT, PRIMARY KEY (user_id, profile))` — consumed by Task 2's routes.

- [ ] **Step 1: Write the migration**

Create `apps/api/migrations/0015_add_model_profiles.sql`:

```sql
-- §106 Continuity Guard / §160 Model Profiles (minimal slice — only the
-- "continuity" profile is ever read or written; shape is generic so
-- "fast"/"narrative" rows could be added later with no new migration).
CREATE TABLE model_profiles (
  user_id TEXT NOT NULL,
  profile TEXT NOT NULL,
  provider TEXT NOT NULL,
  model_id TEXT,
  PRIMARY KEY (user_id, profile)
);
```

- [ ] **Step 2: Apply it locally and confirm the test suite still applies migrations cleanly**

Run: `cd apps/api && npm test`
Expected: all existing tests pass (this confirms a fresh `applyD1Migrations` run, including the new migration, succeeds — the exact failure mode this project hit before, see `docs/worklog.md`'s CI-regression entry).

- [ ] **Step 3: Commit**

```bash
git add apps/api/migrations/0015_add_model_profiles.sql
git commit -m "Add model_profiles table for the Continuity model pointer (§160 minimal slice)"
```

---

### Task 2: Backend — Continuity model routes

**Files:**
- Modify: `apps/api/src/routes/ai-providers.ts`

**Interfaces:**
- Consumes: `model_profiles` table (Task 1), existing `OWNER_USER_ID`, `isProviderId`, `ProviderId` type already in this file.
- Produces: `GET/PUT /continuity-model` on `aiProvidersRoute` (mounted at `/api/ai/providers` in `apps/api/src/index.ts:33`, so the full paths are `GET/PUT /api/ai/providers/continuity-model`), and an exported `getContinuityModel(env: Env): Promise<{ provider: ProviderId; modelId: string | null } | null>` — consumed by Task 4's route wiring.

- [ ] **Step 1: Add the routes and the exported helper**

In `apps/api/src/routes/ai-providers.ts`, add this interface near the top (after `CredentialRow`):

```ts
interface ModelProfileRow {
  provider: ProviderId;
  model_id: string | null;
}
```

Add these two routes, placed after the existing `aiProvidersRoute.put('/:provider/model', ...)` handler and before `aiProvidersRoute.delete('/:provider', ...)`:

```ts
/** §106 Continuity Guard — the configured provider+model for the second-pass check, or both null if unset (feature off). */
aiProvidersRoute.get('/continuity-model', async (c) => {
  const row = await c.env.DB.prepare('SELECT provider, model_id FROM model_profiles WHERE user_id = ? AND profile = ?')
    .bind(OWNER_USER_ID, 'continuity')
    .first<ModelProfileRow>();

  return c.json({ provider: row?.provider ?? null, modelId: row?.model_id ?? null });
});

aiProvidersRoute.put('/continuity-model', async (c) => {
  const body = await c.req.json<{ provider?: ProviderId | null; modelId?: string | null }>().catch(() => null);
  const provider = body?.provider ?? null;

  if (provider === null) {
    await c.env.DB.prepare('DELETE FROM model_profiles WHERE user_id = ? AND profile = ?')
      .bind(OWNER_USER_ID, 'continuity')
      .run();
    return c.json({ provider: null, modelId: null });
  }

  if (!isProviderId(provider)) {
    return c.json({ error: 'Unknown provider.' }, 400);
  }

  await c.env.DB.prepare(
    `INSERT INTO model_profiles (user_id, profile, provider, model_id) VALUES (?, 'continuity', ?, ?)
     ON CONFLICT(user_id, profile) DO UPDATE SET provider = excluded.provider, model_id = excluded.model_id`,
  )
    .bind(OWNER_USER_ID, provider, body?.modelId ?? null)
    .run();

  return c.json({ provider, modelId: body?.modelId ?? null });
});
```

Add this exported helper at the bottom of the file, alongside the existing `getSelectedModel`/`getDecryptedCredential`:

```ts
/** §106 Continuity Guard — null means no profile configured (feature off). */
export async function getContinuityModel(env: Env): Promise<{ provider: ProviderId; modelId: string | null } | null> {
  const row = await env.DB.prepare('SELECT provider, model_id FROM model_profiles WHERE user_id = ? AND profile = ?')
    .bind(OWNER_USER_ID, 'continuity')
    .first<ModelProfileRow>();
  return row ? { provider: row.provider, modelId: row.model_id } : null;
}
```

- [ ] **Step 2: Type-check and run the suite**

Run: `cd apps/api && npx tsc --noEmit -p . && npx tsc --noEmit -p tsconfig.vitest.json && npm test`
Expected: clean typecheck, all tests pass (no behavior changed yet, just new unused-until-Task-4 routes).

- [ ] **Step 3: Commit**

```bash
git add apps/api/src/routes/ai-providers.ts
git commit -m "Add GET/PUT continuity-model routes and getContinuityModel helper"
```

---

### Task 3: Backend — `continuity-guard.ts` service (heuristic + AI call)

**Files:**
- Create: `apps/api/src/services/continuity-guard.ts`
- Create: `apps/api/test/continuity-guard.test.ts`

**Interfaces:**
- Consumes: `ManualTurnPatch`, `SimulationStateResponse`, `MemoryResponse`, `CharacterResponse`, `LocationResponse`, `SecretEntry`, `ScandalEntry` from `../models`; `PROVIDER_ADAPTERS` from `../providers/registry`; `ProviderId` from `../providers/types`; `stripToJsonObject` from `../providers/response-text`.
- Produces: `isImportantScene(patch: ManualTurnPatch): boolean` and `checkContinuity(apiKey: string, provider: ProviderId, modelId: string | null, currentState: SimulationStateResponse, patch: ManualTurnPatch): Promise<{ contradicts: boolean; reason?: string }>` — both consumed by Task 4's `turns.ts` wiring.

- [ ] **Step 1: Write the failing tests for `isImportantScene`**

Create `apps/api/test/continuity-guard.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { isImportantScene } from '../src/services/continuity-guard';
import type { CharacterResponse, LocationResponse, MemoryResponse, ScandalEntry, SecretEntry } from '../src/models';

const memoryWith = (importance: string): MemoryResponse => ({
  id: 'memory_test',
  entityIds: [],
  worldDate: '1. Januar 1813',
  type: 'event',
  importance,
  fact: 'Test fact',
  interpretation: {},
  status: 'fact',
  reach: 'private',
  fading: 'slow',
  tags: [],
});

const minimalCharacter: CharacterResponse = {
  id: 'char_test',
  name: 'Test Character',
  isCanon: false,
  isPlayer: false,
  locationId: null,
  appearance: {},
  visualState: {},
  personality: {},
  goals: {},
  playerKnowledge: [],
  gmState: {},
  skills: {},
  wardrobe: [],
};

const minimalLocation: LocationResponse = {
  id: 'loc_test',
  name: 'Test Place',
  type: 'other',
  discovered: true,
  baseAsset: 'asset://test',
  mapPosition: { x: 0, y: 0 },
  travel: null,
};

const minimalSecret: SecretEntry = {
  id: 'secret_test',
  description: 'x',
  truth: 'x',
  knownBy: [],
  suspectedBy: [],
  playerKnows: false,
};

const minimalScandal: ScandalEntry = {
  id: 'scandal_test',
  description: 'x',
  severity: 'minor',
  date: '1. Januar 1813',
  involved: [],
};

describe('isImportantScene', () => {
  it('returns false for an empty patch and for only-trivial memories', () => {
    expect(isImportantScene({})).toBe(false);
    expect(isImportantScene({ newMemories: [memoryWith('trivial'), memoryWith('minor')] })).toBe(false);
  });

  it('returns true when a new memory is notable or higher', () => {
    for (const importance of ['notable', 'important', 'major', 'life-changing']) {
      expect(isImportantScene({ newMemories: [memoryWith(importance)] })).toBe(true);
    }
  });

  it('returns true when the patch touches canon events, new characters, new locations, secrets, or scandals', () => {
    expect(isImportantScene({ canonUpdates: [{ id: 'canon_1' }] })).toBe(true);
    expect(isImportantScene({ newCharacters: [minimalCharacter] })).toBe(true);
    expect(isImportantScene({ newLocations: [minimalLocation] })).toBe(true);
    expect(isImportantScene({ newSecrets: [minimalSecret] })).toBe(true);
    expect(isImportantScene({ newScandals: [minimalScandal] })).toBe(true);
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `cd apps/api && npx vitest run test/continuity-guard.test.ts`
Expected: FAIL — `Cannot find module '../src/services/continuity-guard'`.

- [ ] **Step 3: Implement `continuity-guard.ts`**

Create `apps/api/src/services/continuity-guard.ts`:

```ts
import type { CharacterResponse, ManualTurnPatch, SimulationStateResponse } from '../models';
import { PROVIDER_ADAPTERS } from '../providers/registry';
import { stripToJsonObject } from '../providers/response-text';
import type { ProviderId } from '../providers/types';

const IMPORTANT_MEMORY_LEVELS = ['notable', 'important', 'major', 'life-changing'];

/**
 * §106 Continuity Guard is optional and scoped to "important scenes" per
 * spec ("nicht nach jedem Frühstück") — this heuristic gates it using only
 * the proposed patch itself, no current-state lookups. Deliberately does
 * NOT diff relationship-dimension swings against current state (see design
 * spec §3) — the five signals below already cover "narratively significant."
 */
export function isImportantScene(patch: ManualTurnPatch): boolean {
  const importantMemory = (patch.newMemories ?? []).some((m) => IMPORTANT_MEMORY_LEVELS.includes(m.importance));
  return (
    importantMemory ||
    (patch.canonUpdates?.length ?? 0) > 0 ||
    (patch.newCharacters?.length ?? 0) > 0 ||
    (patch.newLocations?.length ?? 0) > 0 ||
    (patch.newSecrets?.length ?? 0) > 0 ||
    (patch.newScandals?.length ?? 0) > 0
  );
}

interface RelevantCharacter {
  id: string;
  name: string;
  playerKnowledge: string[];
  goals: unknown;
}

function relevantCharacter(c: CharacterResponse): RelevantCharacter {
  return { id: c.id, name: c.name, playerKnowledge: c.playerKnowledge, goals: c.goals };
}

/**
 * Deliberately lean — NOT the full context-builder.ts package (that defeats
 * the point of a "cheap" check). Only the entities the proposed patch itself
 * touches: characters referenced by relationshipUpdates or newMemories'
 * entityIds, existing memories already involving those same characters
 * (capped at 8 for token bound), and canon events the patch updates.
 */
function buildContinuityPrompt(currentState: SimulationStateResponse, patch: ManualTurnPatch): string {
  const touchedCharacterIds = new Set<string>();
  for (const r of patch.relationshipUpdates ?? []) {
    touchedCharacterIds.add(r.from);
    touchedCharacterIds.add(r.to);
  }
  for (const m of patch.newMemories ?? []) {
    for (const id of m.entityIds) touchedCharacterIds.add(id);
  }

  const relevantCharacters = [...touchedCharacterIds]
    .map((id) => currentState.characters[id])
    .filter((c): c is CharacterResponse => c !== undefined)
    .map(relevantCharacter);

  const relevantMemories = Object.values(currentState.memories)
    .filter((m) => m.entityIds.some((id) => touchedCharacterIds.has(id)))
    .slice(0, 8)
    .map((m) => ({ fact: m.fact, worldDate: m.worldDate, importance: m.importance }));

  const relevantCanonEvents = (patch.canonUpdates ?? [])
    .map((c) => currentState.canonEvents[c.id])
    .filter((e) => e !== undefined);

  return [
    'You are a continuity checker for a life-simulation game. Given established facts and a proposed',
    'change, determine whether the proposed change contradicts anything already established.',
    'Respond with ONLY a single JSON object: {"contradicts": boolean, "reason": string}',
    '("reason" empty string when contradicts is false). No prose, no markdown code fence.',
    '',
    'ESTABLISHED FACTS (characters, relevant memories, relevant canon events):',
    JSON.stringify({ characters: relevantCharacters, memories: relevantMemories, canonEvents: relevantCanonEvents }),
    '',
    'PROPOSED CHANGE:',
    JSON.stringify(patch),
  ].join('\n');
}

export interface ContinuityResult {
  contradicts: boolean;
  reason?: string;
}

/** Throws on any failure (network, malformed response) — callers treat that as "no contradiction found," never as a reason to fail the turn (§5 resilience rule). */
export async function checkContinuity(
  apiKey: string,
  provider: ProviderId,
  modelId: string | null,
  currentState: SimulationStateResponse,
  patch: ManualTurnPatch,
): Promise<ContinuityResult> {
  const prompt = buildContinuityPrompt(currentState, patch);
  const responseText = await PROVIDER_ADAPTERS[provider].generateStory(apiKey, prompt, modelId ?? undefined);
  const parsed = JSON.parse(stripToJsonObject(responseText)) as { contradicts?: unknown; reason?: unknown };

  if (typeof parsed.contradicts !== 'boolean') {
    throw new Error('Continuity check response missing a boolean "contradicts" field.');
  }

  return { contradicts: parsed.contradicts, reason: typeof parsed.reason === 'string' ? parsed.reason : undefined };
}
```

- [ ] **Step 4: Run it to verify it passes**

Run: `cd apps/api && npx vitest run test/continuity-guard.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Type-check and run the full suite**

Run: `cd apps/api && npx tsc --noEmit -p . && npx tsc --noEmit -p tsconfig.vitest.json && npm test`
Expected: clean typecheck, all tests pass (the pre-existing suite plus the 3 new `isImportantScene` tests).

- [ ] **Step 6: Commit**

```bash
git add apps/api/src/services/continuity-guard.ts apps/api/test/continuity-guard.test.ts
git commit -m "Add continuity-guard.ts: isImportantScene heuristic + checkContinuity AI call (§106)"
```

---

### Task 4: Backend — wire into `POST /:id/turn/generate`

**Files:**
- Modify: `apps/api/src/routes/turns.ts`

**Interfaces:**
- Consumes: `isImportantScene`, `checkContinuity` (Task 3); `getContinuityModel` (Task 2); `getSimulationState` from `apps/api/src/db/simulation-repository.ts` (already exists, signature: `(db: D1Database, simulationId: string) => Promise<SimulationStateResponse | null>`).
- Produces: `POST /:id/turn/generate`'s JSON response gains one new field, `continuityRetried: boolean` — consumed by Task 6's frontend wiring.

- [ ] **Step 1: Add the new imports**

In `apps/api/src/routes/turns.ts`, add to the existing imports:

```ts
import { getDecryptedCredential, getSelectedModel, getContinuityModel } from './ai-providers';
```

(replacing the existing `import { getDecryptedCredential, getSelectedModel } from './ai-providers';` line)

Add two new imports:

```ts
import { checkContinuity, isImportantScene } from '../services/continuity-guard';
import { getSimulationState } from '../db/simulation-repository';
```

- [ ] **Step 2: Add the correction-instruction constant**

Add this near the existing `REPAIR_INSTRUCTION` constant:

```ts
function continuityCorrectionInstruction(reason: string): string {
  return (
    '\n\n=== CONTINUITY CORRECTION ===\n\nYour previous response contradicts the established state: ' +
    reason +
    '\n\nRespond again with a corrected JSON object (same schemaVersion/scene/statePatch shape) that resolves this contradiction.'
  );
}
```

- [ ] **Step 3: Add the `maybeRunContinuityGuard` helper**

Add this function after `generateWithRepair` (which it calls) and before the `turnsRoute.post('/:id/context-package', ...)` handler:

```ts
/**
 * §106 Continuity Guard — optional, cheap second AI call before commit, only
 * for scenes isImportantScene() judges significant (avoids a second call
 * after every trivial turn, per spec: "nicht nach jedem Frühstück"). Skipped
 * entirely when no Continuity model profile is configured (opt-in) or the
 * check itself errors — this must never turn a working turn into a failed
 * one, only add one bounded retry when it finds a real contradiction (same
 * one-retry-then-accept shape as generateWithRepair's §188 repair retry).
 */
async function maybeRunContinuityGuard(
  env: Env,
  simulationId: string,
  provider: ProviderId,
  apiKey: string,
  modelId: string | null,
  contextText: string,
  attempt: GenerateAttempt,
): Promise<{ attempt: GenerateAttempt; continuityRetried: boolean }> {
  if (!isImportantScene(attempt.validation.response.statePatch)) {
    return { attempt, continuityRetried: false };
  }

  const continuityProfile = await getContinuityModel(env);
  if (!continuityProfile) {
    return { attempt, continuityRetried: false };
  }

  const continuityApiKey = await getDecryptedCredential(env, continuityProfile.provider);
  if (!continuityApiKey) {
    return { attempt, continuityRetried: false };
  }

  const startedAt = Date.now();
  try {
    const currentState = await getSimulationState(env.DB, simulationId);
    if (!currentState) {
      return { attempt, continuityRetried: false };
    }

    const guardResult = await checkContinuity(
      continuityApiKey,
      continuityProfile.provider,
      continuityProfile.modelId,
      currentState,
      attempt.validation.response.statePatch,
    );
    await logAiCall(env.DB, simulationId, continuityProfile.provider, true, Date.now() - startedAt, null);

    if (!guardResult.contradicts) {
      return { attempt, continuityRetried: false };
    }

    const correctedText = contextText + continuityCorrectionInstruction(guardResult.reason ?? 'unspecified contradiction');
    const retryAttempt = await generateWithRepair(env.DB, simulationId, provider, apiKey, correctedText, modelId);
    return retryAttempt.ok ? { attempt: retryAttempt, continuityRetried: true } : { attempt, continuityRetried: false };
  } catch {
    await logAiCall(env.DB, simulationId, continuityProfile.provider, false, Date.now() - startedAt, 'continuity_check_failed');
    return { attempt, continuityRetried: false };
  }
}
```

- [ ] **Step 4: Wire it into the route handler**

In `turnsRoute.post('/:id/turn/generate', ...)`, find:

```ts
    const modelId = await getSelectedModel(c.env, provider);
    const attempt = await generateWithRepair(c.env.DB, simulationId, provider, apiKey, context.contextText, modelId);
    if (!attempt.ok) {
      lastError = attempt.error;
      continue;
    }

    await createAutoSnapshot(c.env.DB, simulationId);
    const result = await applyTurn(
      c.env.DB,
      simulationId,
      playerAction,
      context.baseStateVersion,
      provider,
      attempt.validation.response,
    );

    if (!result.ok) {
      return c.json({ error: result.error }, result.status as 404 | 409);
    }
    return c.json({ state: result.state, scene: attempt.validation.response.scene, provider });
```

Replace with:

```ts
    const modelId = await getSelectedModel(c.env, provider);
    const attempt = await generateWithRepair(c.env.DB, simulationId, provider, apiKey, context.contextText, modelId);
    if (!attempt.ok) {
      lastError = attempt.error;
      continue;
    }

    const { attempt: finalAttempt, continuityRetried } = await maybeRunContinuityGuard(
      c.env,
      simulationId,
      provider,
      apiKey,
      modelId,
      context.contextText,
      attempt,
    );

    await createAutoSnapshot(c.env.DB, simulationId);
    const result = await applyTurn(
      c.env.DB,
      simulationId,
      playerAction,
      context.baseStateVersion,
      provider,
      finalAttempt.validation.response,
    );

    if (!result.ok) {
      return c.json({ error: result.error }, result.status as 404 | 409);
    }
    return c.json({ state: result.state, scene: finalAttempt.validation.response.scene, provider, continuityRetried });
```

- [ ] **Step 5: Type-check and run the full suite**

Run: `cd apps/api && npx tsc --noEmit -p . && npx tsc --noEmit -p tsconfig.vitest.json && npm test`
Expected: clean typecheck, all tests pass. No existing test exercises `/:id/turn/generate` directly (confirmed during planning — this route has no route-level test today, same as before this change), so this step only confirms nothing else broke; there is no automated verification of the retry wiring itself.

- [ ] **Step 6: Manual verification (no Continuity profile configured — the default, must be a no-op)**

With `cd apps/api && npm run dev` running and at least one provider connected via the frontend, play a turn through the normal Direct-API path (no Continuity model set in Settings yet — Task 5 hasn't landed). Confirm the turn completes exactly as before this task (response includes `continuityRetried: false`, checkable via browser devtools network tab or `curl`). This proves the opt-in default doesn't change existing behavior.

- [ ] **Step 7: Commit**

```bash
git add apps/api/src/routes/turns.ts
git commit -m "Wire Continuity Guard into POST /:id/turn/generate (§106)"
```

---

### Task 5: Frontend — Settings UI for the Continuity model picker

**Files:**
- Modify: `apps/web/src/app/core/ai/ai-providers-api.service.ts`
- Modify: `apps/web/src/app/features/settings/settings-screen/settings-screen.ts`
- Modify: `apps/web/src/app/features/settings/settings-screen/settings-screen.html`

**Interfaces:**
- Produces: `AiProvidersApiService.getContinuityModel(): Observable<{ provider: string | null; modelId: string | null }>` and `.setContinuityModel(provider: string | null, modelId: string | null): Observable<...>` — calling Task 2's routes.

- [ ] **Step 1: Add the service methods**

In `apps/web/src/app/core/ai/ai-providers-api.service.ts`, add this interface after `ModelsResult`:

```ts
export interface ContinuityModel {
  provider: string | null;
  modelId: string | null;
}
```

Add these two methods inside the `AiProvidersApiService` class, after `setModel`:

```ts
  /** §106 Continuity Guard — the configured provider+model for the second-pass check. */
  getContinuityModel(): Observable<ContinuityModel> {
    return this.http.get<ContinuityModel>(`${API_BASE_URL}/api/ai/providers/continuity-model`);
  }

  setContinuityModel(provider: string | null, modelId: string | null): Observable<ContinuityModel> {
    return this.http.put<ContinuityModel>(`${API_BASE_URL}/api/ai/providers/continuity-model`, { provider, modelId });
  }
```

- [ ] **Step 2: Add the settings-screen signals and methods**

In `apps/web/src/app/features/settings/settings-screen/settings-screen.ts`, add these two signals near the existing `models`/`selectedModels`/`modelsLoading` signals:

```ts
  /** §106 Continuity Guard — null provider means the feature is off (default). */
  protected readonly continuityProvider = signal<string | null>(null);
  protected readonly continuityModelId = signal<string | null>(null);
```

In the constructor, add this fetch alongside the existing `this.api.list().subscribe(...)` call:

```ts
    this.api.getContinuityModel().subscribe({
      next: ({ provider, modelId }) => {
        this.continuityProvider.set(provider);
        this.continuityModelId.set(modelId);
        if (provider) this.loadModels(provider);
      },
    });
```

Add these two methods after the existing `selectModel`:

```ts
  protected setContinuityProvider(provider: string): void {
    const value = provider || null;
    this.continuityProvider.set(value);
    this.continuityModelId.set(null);
    if (value) this.loadModels(value);
    this.api.setContinuityModel(value, null).subscribe();
  }

  protected setContinuityModelId(modelId: string): void {
    const value = modelId || null;
    this.continuityModelId.set(value);
    this.api.setContinuityModel(this.continuityProvider(), value).subscribe();
  }
```

- [ ] **Step 3: Add the template section**

In `apps/web/src/app/features/settings/settings-screen/settings-screen.html`, find:

```html
            <h2>Fallback-Reihenfolge</h2>
            <ol class="fallback-order">
              @for (name of fallbackOrder; track name) {
                <li>{{ name }}</li>
              }
            </ol>

            <h2>Nutzung</h2>
```

Replace with:

```html
            <h2>Fallback-Reihenfolge</h2>
            <ol class="fallback-order">
              @for (name of fallbackOrder; track name) {
                <li>{{ name }}</li>
              }
            </ol>

            <h2>Kontinuitäts-Check (§106)</h2>
            <p class="settings__hint">
              Optionaler, kostengünstiger zweiter KI-Check vor wichtigen Szenen: widerspricht die
              vorgeschlagene Antwort dem bisherigen Stand der Simulation? Standardmäßig aus.
            </p>
            <label class="provider-card__model-picker">
              <span>Anbieter</span>
              <select [value]="continuityProvider() ?? ''" (change)="setContinuityProvider($any($event.target).value)">
                <option value="">Aus</option>
                @for (provider of providers(); track provider.provider) {
                  @if (provider.connected) {
                    <option [value]="provider.provider">{{ displayName[provider.provider] }}</option>
                  }
                }
              </select>
            </label>
            @if (continuityProvider(); as cp) {
              @if (modelsLoading()[cp]) {
                <p class="provider-card__models-hint">Modelle werden geladen …</p>
              } @else if (models()[cp]?.length) {
                <label class="provider-card__model-picker">
                  <span>Modell</span>
                  <select [value]="continuityModelId() ?? ''" (change)="setContinuityModelId($any($event.target).value)">
                    <option value="">Automatisch</option>
                    @for (model of models()[cp]; track model.id) {
                      <option [value]="model.id">{{ model.displayName }}</option>
                    }
                  </select>
                </label>
              }
            }

            <h2>Nutzung</h2>
```

(This reuses the existing `.provider-card__model-picker`/`.provider-card__models-hint`/`.settings__hint` CSS classes already defined in `settings-screen.scss` for the per-provider model picker — no new SCSS needed.)

- [ ] **Step 4: Verify in the browser**

Run `cd apps/web && npm start`, open Settings → KI & Modelle. Confirm the new "Kontinuitäts-Check" section appears between "Fallback-Reihenfolge" and "Nutzung", defaults to "Aus", and — with at least one provider connected — selecting it populates a model dropdown (reusing the already-fetched model list, no extra loading flicker if that provider's models were already loaded elsewhere on the page). Reload the page and confirm the selection persists (round-trips through the backend).

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/app/core/ai/ai-providers-api.service.ts apps/web/src/app/features/settings/settings-screen/settings-screen.ts apps/web/src/app/features/settings/settings-screen/settings-screen.html
git commit -m "Add Continuity model picker to Settings (§106)"
```

---

### Task 6: Frontend — surface a Continuity retry in Story Mode

**Files:**
- Modify: `apps/web/src/app/core/ai/direct-turn-api.service.ts`
- Modify: `apps/web/src/app/features/story/story-screen/story-screen.ts`
- Modify: `apps/web/src/app/features/story/story-screen/story-screen.html`

**Interfaces:**
- Consumes: `continuityRetried: boolean` field on `POST /:id/turn/generate`'s response (Task 4).

- [ ] **Step 1: Add the field to `GenerateTurnResult`**

In `apps/web/src/app/core/ai/direct-turn-api.service.ts`, find:

```ts
export interface GenerateTurnResult {
  state: SimulationState;
  scene: Scene;
  /** Whichever connected provider actually produced this turn — not necessarily the first choice (A32 automatic fallback). */
  provider: string;
}
```

Replace with:

```ts
export interface GenerateTurnResult {
  state: SimulationState;
  scene: Scene;
  /** Whichever connected provider actually produced this turn — not necessarily the first choice (A32 automatic fallback). */
  provider: string;
  /** §106 Continuity Guard — true only when a flagged contradiction triggered one corrective retry. */
  continuityRetried: boolean;
}
```

- [ ] **Step 2: Track it in the Story screen**

In `apps/web/src/app/features/story/story-screen/story-screen.ts`, find:

```ts
  protected readonly lastUsedProvider = signal<string | null>(null);
```

Replace with:

```ts
  protected readonly lastUsedProvider = signal<string | null>(null);
  /** §106 Continuity Guard — true only for the turn just committed, not sticky across turns. */
  protected readonly continuityRetried = signal(false);
```

Find:

```ts
    this.directTurn.generate(action, this.selectedProvider() ?? undefined).subscribe({
      next: ({ state, scene, provider }) => {
        this.store.refresh(state);
        this.scene.set(scene);
        this.playerInput.set('');
        this.lastUsedProvider.set(provider);
        this.generating.set(false);
      },
```

Replace with:

```ts
    this.directTurn.generate(action, this.selectedProvider() ?? undefined).subscribe({
      next: ({ state, scene, provider, continuityRetried }) => {
        this.store.refresh(state);
        this.scene.set(scene);
        this.playerInput.set('');
        this.lastUsedProvider.set(provider);
        this.continuityRetried.set(continuityRetried);
        this.generating.set(false);
      },
```

- [ ] **Step 3: Show it in the template**

In `apps/web/src/app/features/story/story-screen/story-screen.html`, find:

```html
    @if (lastUsedProvider(); as provider) {
      <p class="story-header__provider-indicator">erzählt von {{ provider }}</p>
    }
```

Replace with:

```html
    @if (lastUsedProvider(); as provider) {
      <p class="story-header__provider-indicator">
        erzählt von {{ provider }}{{ continuityRetried() ? ' · Kontinuität geprüft, Korrektur angefordert' : '' }}
      </p>
    }
```

(No new CSS — this is still the existing `.story-header__provider-indicator` element and, per Task 3 of the prior Quick Wins batch, it's already inside the `@if (!focusMode.active())` block, so it correctly stays hidden during Focus Mode too.)

- [ ] **Step 4: Verify in the browser**

Run `cd apps/web && npx ng build` (production build) to confirm it compiles. With the dev server running and a provider connected (no Continuity model configured yet is fine — this only proves the field threads through without breaking anything when `continuityRetried` is always `false`), play a turn and confirm the "erzählt von X" line still renders exactly as before, with no trailing suffix. Full observation of the suffix actually appearing needs a real flagged contradiction, which isn't reliably reproducible on demand — treat this as a code-reviewed, not live-observed, path (same explicitly-acknowledged verification gap the design spec calls out for this piece).

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/app/core/ai/direct-turn-api.service.ts apps/web/src/app/features/story/story-screen/story-screen.ts apps/web/src/app/features/story/story-screen/story-screen.html
git commit -m "Surface a Continuity Guard retry in Story Mode's provider indicator (§106)"
```

---

## After all six tasks

- [ ] Update `docs/worklog.md`: move Continuity Guard + the Continuity model profile out of the roadmap's "next" slot into "Done this session," note the deliberate scope cuts (no Manual Relay coverage, no relationship-dimension diffing, no Narrative/Fast profiles) so a future session doesn't mistake them for oversights.
- [ ] `gh issue comment 25` noting it's closed by this batch (or `gh issue close 25` if the batch fully satisfies it — check the issue body once more against what shipped before closing).
- [ ] Push and confirm `API Checks` CI is green (it will run — this batch touches `apps/api`).
