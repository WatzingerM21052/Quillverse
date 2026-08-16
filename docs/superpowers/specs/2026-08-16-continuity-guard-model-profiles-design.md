# Continuity Guard + Model Profiles (Roadmap Batch 1) — Design

Status: approved, not yet implemented.
Scope: issue #25 (§106 Continuity Guard) + the minimal slice of issue-adjacent §160 Model Profiles that
Continuity Guard actually needs (a single "Continuity" model pointer). Not in scope: "Narrative" and
"Fast" profiles (no current consumer — YAGNI, revisit when something needs them), full generic
named-profile CRUD, Manual Relay coverage (see §4 below for why).

## 1. Storage

New migration `apps/api/migrations/0015_add_model_profiles.sql`:

```sql
CREATE TABLE model_profiles (
  user_id TEXT NOT NULL,
  profile TEXT NOT NULL,
  provider TEXT NOT NULL,
  model_id TEXT,
  PRIMARY KEY (user_id, profile)
);
```

Keyed the same way `ai_provider_credentials` already is (`OWNER_USER_ID = 'owner'`, this is a
single-tenant app). Shape is generic (`profile` is a free string) so `'fast'`/`'narrative'` rows can be
added later with no new migration — but nothing in this batch's code assumes those exist; only
`'continuity'` is ever read or written.

## 2. Backend: Continuity model profile routes

New handlers in `apps/api/src/routes/ai-providers.ts` (same file as the existing per-provider model
routes, since this is conceptually the same "which model for which purpose" surface):

- `GET /api/ai/continuity-model` → `{ provider: ProviderId | null, modelId: string | null }` (both null
  if unset — feature is off).
- `PUT /api/ai/continuity-model` → body `{ provider: ProviderId | null, modelId: string | null }`.
  `provider: null` clears the row (turns the feature off). Upserts via
  `INSERT ... ON CONFLICT(user_id, profile) DO UPDATE`, same pattern as `selected_model`.
- Exported helper `getContinuityModel(env): Promise<{ provider: ProviderId; modelId: string | null } | null>`
  for `turns.ts` to call, mirroring the existing `getSelectedModel`/`getDecryptedCredential` helpers in
  the same file.

## 3. "Important scene" heuristic

New pure function in `apps/api/src/services/continuity-guard.ts`:

```ts
export function isImportantScene(patch: ManualTurnPatch): boolean {
  const importantMemory = (patch.newMemories ?? []).some((m) =>
    ['notable', 'important', 'major', 'life-changing'].includes(m.importance),
  );
  return (
    importantMemory ||
    (patch.canonUpdates?.length ?? 0) > 0 ||
    (patch.newCharacters?.length ?? 0) > 0 ||
    (patch.newLocations?.length ?? 0) > 0 ||
    (patch.newSecrets?.length ?? 0) > 0 ||
    (patch.newScandals?.length ?? 0) > 0
  );
}
```

Computed directly from the proposed patch — no current-state lookups, no relationship-dimension
diffing (deliberately out of scope, see design discussion: the other five signals already cover
"narratively significant" without needing to diff against current state).

## 4. Continuity check + retry, wired into Direct-API generation only

Same file, `checkContinuity(apiKey, provider, modelId, currentState, proposedPatch): Promise<{ contradicts: boolean; reason?: string }>` —
calls `PROVIDER_ADAPTERS[provider].generateStory(...)` (reusing the existing adapter interface — the
guard call is still "generate text," just a different, much shorter prompt than a narrative turn) with
a small, deliberately lean prompt: NOT the full context package `context-builder.ts` assembles for
narration (that defeats the point of a "cheap" check) — just the entities the *proposed patch itself*
touches (the characters/locations/canon events named in `newCharacters`/`newLocations`/`canonUpdates`/
`relationshipUpdates`, looked up in `currentState`) plus the patch itself, serialized, asking for a
strict JSON response: `{"contradicts": boolean, "reason": string}` (reason empty string when
`contradicts` is false). Parse defensively the same way `validate-turn-response.ts` already does for
the main narration response (strip code fences via the existing `stripToJsonObject` helper, then
`JSON.parse`) — a malformed guard response is treated as a `checkContinuity` failure (§5's resilience
rule), not a parse error that needs its own repair loop.

Wired into `apps/api/src/routes/turns.ts`'s `POST /:id/turn/generate` **only** — not into `/:id/commit`
(Manual Relay). Manual Relay's entire premise is "no AI API key needed," so it has no guaranteed
connected provider to run a second call with; Direct-API generation always has one by construction.

Flow inside `turns.ts`, after `generateWithRepair` already returns a structurally-valid attempt:

```
if isImportantScene(attempt.validation.response.statePatch) and a Continuity profile is configured:
  result = checkContinuity(...)
  if result.contradicts:
    retry generateWithRepair ONCE more, with the context text extended by a correction instruction
    describing result.reason (same shape as the existing REPAIR_INSTRUCTION constant, new sibling
    constant) — accept whatever comes back after this one retry, do not re-check it (bounded, matches
    §188's one-retry-then-accept philosophy, not an unbounded loop)
proceed to createAutoSnapshot + applyTurn as today, unchanged
```

## 5. Resilience — never blocks a turn

- No Continuity profile configured (the default) → the whole block above is skipped; zero behavior
  change from today.
- `checkContinuity` throwing (provider error, malformed guard response) → caught, logged to the existing
  `ai_calls` table via `logAiCall` (same table/helper §188's retries already use) with a distinguishing
  `errorType` (e.g. `'continuity_check_failed'`), treated as "no contradiction found" — the turn proceeds
  normally. A soft, optional check must never turn a working turn into a failed one.

## 6. Frontend: Settings UI

New section in `apps/web/src/app/features/settings/settings-screen/`, placed near the existing
per-provider model dropdowns (reuses the same `models: Record<providerId, ModelInfo[]>` data already
fetched by `listModels()` for each connected provider — no new fetch needed, just a new provider
`<select>` limited to connected providers, and a model `<select>` populated from `models[provider]` once
one is picked). Default state: no provider selected → "Aus" (off), matching §106's "optional" framing.
New `AiProvidersApiService` methods `getContinuityModel()` / `setContinuityModel(provider, modelId)`
calling the routes from §2.

## 7. Frontend: surfacing a retry

`DirectTurnApiService.generate()`'s response already returns `provider` (who narrated). Extend the
backend's `/:id/turn/generate` success response with one new optional field, `continuityRetried: boolean`
(true only when the retry branch in §4 actually fired). `story-screen.ts` stores it alongside
`lastUsedProvider`; the existing `erzählt von {{ provider }}` line in `story-screen.html` gets a
conditional suffix: `{{ continuityRetried() ? ' · Kontinuität geprüft, Korrektur angefordert' : '' }}`.
No new UI element — reuses the existing indicator's slot and styling.

## Testing

- Backend: `isImportantScene` is a pure function — direct unit tests (all 5 trigger conditions +
  the "nothing triggers" case), same pattern as `orderProviders`/`response-text.ts`. `checkContinuity`
  itself is hard to unit-test meaningfully without a live provider (same situation as `generateStory`
  today, which has no direct test either) — covered by the manual live-verification pass instead.
- Backend: a focused test for the route-level retry wiring is worth adding if it can be done by mocking
  `PROVIDER_ADAPTERS` at the module level (check whether the existing test setup supports this before
  committing to it in the plan — if not, this stays manual-verification-only, consistent with how
  `turn/generate`'s existing A32 fallback logic has no route-level test today either).
- Frontend: no test suite exists for this app (established project-wide limitation) — manual
  verification: configure a Continuity model in Settings, play a turn that introduces a new character or
  secret (triggers the heuristic), confirm a guard call appears in `ai_calls` (checkable via a direct D1
  query, same as this session's earlier live-DB checks), and confirm the Story header shows the retry
  suffix if a contradiction was ever actually flagged (this last part may not be reproducible on demand
  — a live model rarely produces a genuine contradiction on request — so this specific sub-check may stay
  code-reviewed rather than live-observed, and that's an acceptable, explicitly-noted verification gap
  for an optional, best-effort feature).
