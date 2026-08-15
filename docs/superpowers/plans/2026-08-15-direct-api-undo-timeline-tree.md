# Closing Phase 2/6, §153 Undo, §155 Timeline Tree

Started: 2026-08-15.

## Scope

Three gaps the user asked to close in one pass, done as three separate
commits so a stall on one doesn't strand the others:

1. **Phase 2/6 gap**: `generateStory` never wired to a real provider — this
   is the *same* gap in both phases, not two gaps.
2. **§153 Undo Last Turn**.
3. **§155 Timeline Tree**.

Build order: direct-API turns first (biggest, and the only one that's
actually player-facing today), then Undo (needs turns to be cheap to
produce to be worth using), then Timeline Tree (needs a migration, gives
the least, purely cosmetic).

## Part 1 — Direct-API story generation (Phase 2/6)

**Reuse, don't rebuild.** The Manual Relay pipeline already does everything
except the actual model call: `context-builder.ts` assembles the full
prompt+state+action text, `validate-turn-response.ts` rejects malformed
JSON, `apply-turn.ts` applies atomically with stale-`stateVersion`
rejection. A direct-API turn is: build context (existing) → call provider
(new) → validate (existing) → apply (existing). One new endpoint, one new
adapter method.

- `AiProviderAdapter` gets `generateStory(apiKey, contextText): Promise<string>`.
  All three adapters must implement it (interface change) — Gemini gets
  wired against a real key and **verified live this session**; OpenAI and
  Anthropic are structurally complete, unverified (no key available), same
  status the existing adapters shipped with originally.
- Gemini: `gemini-2.5-flash` via `generateContent`, `responseMimeType:
  "application/json"` forces clean JSON (real Gemini API feature — not
  relying on prompt instructions alone to keep the model from wrapping the
  answer in prose or a markdown fence).
- OpenAI: Chat Completions, `gpt-4o-mini`, `response_format: {type:
  "json_object"}` — same reasoning, real API feature.
- Anthropic: Messages API. No native forced-JSON mode on this API version —
  relies on the prompt's existing "respond with ONE JSON object" instruction.
- **Shared markdown-fence stripping** before handing text to
  `validateManualTurnResponse` (defense in depth, mainly for Anthropic,
  harmless no-op for the other two which already return clean JSON).
- `baseStateVersion` is captured by `buildContextPackage` at the moment
  generation starts — this must stay a fresh read for every turn, since
  generation takes seconds and `apply-turn.ts`'s 409 check exists exactly
  to catch a stale version.
- New route: `POST /api/simulations/:id/turn/generate { playerAction,
  provider }`.

## Part 2 — §153 Undo Last Turn

- Auto-snapshot right before a turn is applied (both the existing Manual
  Relay `/commit` and the new direct-generate route), reusing
  `createSavepoint`. Marked with a reserved label prefix
  (`__autosave__:<turnNumber>`) so it's a normal savepoints-table row, not a
  new table.
- **Must not appear in the player-facing Save Points list** — filter at the
  `listSavepoints` query (`WHERE label NOT LIKE '\_\_autosave\_\_:%'`), not
  in the template.
- Only the latest auto-snapshot is kept per simulation (delete the previous
  one before inserting the new one) — this is an undo buffer of depth 1, not
  a history.
- `POST /api/simulations/:id/undo-last-turn`: find the latest auto-snapshot,
  400 if none, else `restoreSavepoint` it, delete that savepoint row
  (single-use) and the most recent `turns` log row (so the turn count
  matches reality after undo).

## Part 3 — §155 Timeline Tree

- Migration: `simulations.parent_simulation_id` — plain `ALTER TABLE ADD
  COLUMN`, no table recreate needed (`simulations` was deliberately *not*
  touched by migration 0009 — it still has a bare `id TEXT PRIMARY KEY`).
- `forkSavepoint` sets it to the source simulation's id.
- `listSimulations` returns it; frontend groups Save Selection into a
  simple nested list (parent → indented children) — the spec's own example
  is text-tree shaped, not a canvas graph, so that's all this needs.

## Verification plan

Same discipline as the image pipeline: type-check, then verify what's
verifiable without a key or without touching prod, then deploy, then verify
live against the real connected Gemini key, in that order. Migrations →
Worker deploy → frontend push, never reversed.

## Done, verified live, 2026-08-15

All three parts shipped and verified against production with the real
connected Gemini key, each as its own commit:

- **Direct-API turns**: a hardcoded `gemini-2.5-flash` 404'd live as "no
  longer available to new users" despite still being listed by
  `/v1beta/models` — the list includes models a given API key/project isn't
  actually allowed to call. Fixed by discovering a model at call time and
  preferring the `-latest` alias (`gemini-flash-latest`) Google publishes
  specifically so callers don't have to track version numbers; version-number
  sorting is not a safe heuristic for "current" here. Confirmed working:
  real, coherent, world-consistent narration back from Gemini for two
  different player actions.
- **Undo Last Turn**: generated a real turn, undid it, confirmed
  `stateVersion` reverted and a second undo call correctly reports nothing
  to undo (single-use, depth 1).
- **Timeline Tree**: forked a test savepoint, confirmed `parentSimulationId`
  round-trips through both the fork response and `listSimulations`, and the
  Settings → Backup & Export nested list renders it indented under its
  parent correctly in a real browser.
- All test artifacts (2 test turns, 1 test savepoint, 1 test fork) cleaned
  up afterward — `sim_default` reset to its pristine seed state
  (`stateVersion: 1`) via a script mirroring migrations 0002/0005/0006/0007's
  seed data exactly.

## Gemini quota, from the account's actual rate-limit dashboard (28-day window)

The user shared the real numbers, which sharpen what "free" means here:

- Text models have real but small daily caps — the model this session
  landed on (`gemini-3.7-flash`) shows **5 RPM / 20 RPD**. `-flash-lite`
  variants show 500 RPD instead — a real lever if daily volume matters more
  than per-turn quality.
- Every native multimodal image model (all "Nano Banana" variants) shows a
  hard **0/0/0** — not rate-limited, simply not granted to this
  account/project at all.
- **Imagen 4 (Fast/Generate/Ultra) shows 0/25** — real daily quota, unlike
  the Nano Banana family. This is the lead for the "proper fallback" the
  user wants to look at next for the image pipeline: same Gemini API key,
  different endpoint shape (`:predict`, not `:generateContent`).
