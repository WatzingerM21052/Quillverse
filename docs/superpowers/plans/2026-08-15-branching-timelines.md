# Branching Timelines (ui-master-prompt-v1.md §123-124, §154-155)

Started: 2026-08-15 (prior session, uncommitted). Picked back up: 2026-08-15.

## What this feature is

From any Savepoint, "Create Alternate Timeline" spins off a brand-new
simulation row that keeps the exact same entity ids as the snapshot, so both
versions of the story keep existing independently (§154). "Save Selection"
(§123) is the book-shelf list of every such timeline; each entry needs a
Timeline Identity (§124): title, current date, player portrait, current
location, small summary, last image.

## Done

- **Schema** (`migrations/0008_add_simulation_label.sql`,
  `migrations/0009_composite_primary_keys.sql`): every entity table moved from
  a bare `id TEXT PRIMARY KEY` to `PRIMARY KEY (id, simulation_id)`, because a
  fork needs to copy a snapshot's rows into a new `simulation_id` while
  keeping the same entity ids — that collided under a globally-unique id.
  `simulations.label` added for the book-shelf title. Verified column order in
  every recreated table matches the live schema exactly (checked against
  0001/0004/0006/0007, the only migrations that ever created or altered
  those tables) — a `SELECT *` copy is order-dependent and a silent-scramble
  risk if it weren't. **Already applied to the remote D1 database.**
- **Backend**: `forkSavepoint()` + `listSimulations()`
  (`apps/api/src/db/savepoints.ts`, `apps/api/src/db/simulation-repository.ts`),
  routes `POST /api/simulations/:id/savepoints/:savepointId/fork` and
  `GET /api/simulations` (`apps/api/src/routes/savepoints.ts`,
  `routes/simulations.ts`). `canon_events` upsert fixed to
  `ON CONFLICT(id, simulation_id)` to match the new PK — this was the only
  upsert in `apply-turn.ts` targeting an affected table (relationships/
  reputation already had composite keys and were untouched).
- **Frontend plumbing**: `ActiveSimulationService`
  (`apps/web/src/app/core/state/active-simulation.service.ts`) — holds the
  active timeline id in a signal, persisted to `localStorage`. Wired into
  `SimulationStateStore` (re-fetches via `effect()` when the active id
  changes), `SavepointsApiService` (`.fork()`, `.listTimelines()`),
  `ManualRelayService`, `GmApiService` — every API call now targets the
  active timeline instead of the hardcoded `'sim_default'`.
- Type-checked clean (`tsc --noEmit`) on both `apps/api` and `apps/web`, and
  `npm test` in `apps/web` still passes (2/2 — confirms `effect()` writing
  `loading`/`loadError` signals doesn't throw on Angular 20.3).

## Todo (this session)

- [ ] Save Selection UI in Settings → Backup & Export: list timelines
      (`listTimelines()`), a "Create Alternate Timeline" action per savepoint
      row (`fork()`), and switching the active timeline
      (`activeSimulation.setActive()`).
- [ ] README roadmap line for this feature.

## Deliberately deferred (not this session)

- **§124 Timeline Identity fields**: `listSimulations()` currently returns
  only id/label/worldPackId/date/stateVersion/playerName/timestamps — no
  portrait, current location, short summary, or "last image" (there's no
  image generation in the project yet at all, §7 Visual Polish is still
  "not started"). Ship the list with what the endpoint has today; extending
  `SimulationSummary` is its own small backend task once there's an actual
  portrait/image source to point it at.
- **§153 Undo Last Turn**: separate feature (state-version rollback +
  optional branch-on-undo), not started, not touched by the current diff.
- **§155 Timeline Tree**: visualizing parent → children ancestry needs the
  fork to record which savepoint/simulation it branched from (not currently
  stored) before a tree view is even possible. Not started.

## Non-obvious things worth remembering

- `simulations.finance_ledger_json` is a dead column (superseded by the
  `finance_transactions` table; `getSimulationState` reads finance from that
  table, never from this column). `forkSavepoint` writes `'[]'` into it,
  which is correct/consistent with how every other simulation row already
  has stale, never-read data there — not a bug, don't "fix" it into copying
  `snapshot.financeLedger`.
- Migration/deploy ordering matters here specifically because `label` is a
  required field on `SimulationStateResponse`: if the Worker deploys before
  the migration applies, every `GET /api/simulations/:id` throws. Order is
  always migrations → Worker deploy → frontend push, never reversed.
