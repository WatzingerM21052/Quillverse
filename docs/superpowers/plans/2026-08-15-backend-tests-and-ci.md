# Backend Test Suite + CI Gate (Issues #4, #5)

Started: 2026-08-15.

## Problem

Zero test files anywhere in `apps/api` despite non-trivial logic (relationship
merge in `apply-turn.ts`, the only defense against malformed AI responses in
`validate-turn-response.ts`, the new fork/undo logic from earlier this
session). Frontend had one spec file, 2 tests. CI (`deploy.yml`) ran `ng
build` straight through with no `tsc --noEmit` or test gate first; the API
had no CI at all — deploy was `npm run deploy` from whoever's laptop.

## Backend test setup

`@cloudflare/vitest-pool-workers` (0.21.3) + `vitest` (4.1.10) — the
current, doc-verified (context7, not memory) way to test a D1-backed Worker.
Key pieces:

- `vitest.config.ts`: `readD1Migrations()` reads `migrations/` at config
  time; `cloudflareTest()` wires the pool to `wrangler.jsonc`; migrations
  get passed through as a `TEST_MIGRATIONS` binding.
- `test/apply-migrations.ts` (setup file): `applyD1Migrations(env.DB,
  env.TEST_MIGRATIONS)` — runs once per file, idempotent. Since migrations
  0002/0005/0006/0007 seed `sim_default`, **the test database starts with
  the same Matthias Hale fixture dev/prod use** — no custom test seeding
  needed, tests operate on real seed data.
- `test/env.d.ts`: augments the global `Cloudflare.Env` namespace with
  `TEST_MIGRATIONS: import('cloudflare:test').D1Migration[]` — this is the
  test-only binding's type, not a real Worker binding, so it can't come
  from the generated `worker-configuration.d.ts`.
- `tsconfig.vitest.json`: extends the main tsconfig, adds
  `@cloudflare/vitest-pool-workers/types` and includes `test/**` — kept
  separate from the main `tsconfig.json` so the deployed Worker's own
  type-check stays scoped to `src/`.

## What's covered

- `stripToJsonObject` — fence stripping, prose stripping, nested braces, the
  no-braces-at-all fallback.
- `validateManualTurnResponse` — every rejection path (bad JSON, array,
  null, missing schemaVersion/scene/narration/statePatch), plus the
  "empty statePatch is valid" case.
- `createAutoSnapshot` / `undoLastTurn` — full round trip against real D1:
  snapshot, simulate a turn (bump state_version, insert a turns row),
  undo, verify state reverted and the turn row is gone, verify a second
  undo correctly finds nothing.
- Autosaves never appear in `listSavepoints`'s output.
- `forkSavepoint` — parent_simulation_id set correctly, entity ids
  preserved under the new simulation_id (the actual thing migration 0009's
  composite PKs exist for), source simulation left untouched, invalid
  savepoint id returns null cleanly.

19 tests, all passing, ~5s including migrations.

**Not covered here**: `applyTurn`'s relationship-dimension merge logic
specifically (partial update + existing values) — real gap, didn't fit in
this pass, worth a follow-up.

## CI

- `deploy.yml` (frontend): added `tsc --noEmit -p tsconfig.app.json` and
  `ng test --watch=false --browsers=ChromeHeadless` before the build step.
  Added a `pull_request` trigger so this runs on PRs too, not just pushes
  to main — the `deploy` job is gated to `github.event_name !=
  'pull_request'` so PRs never trigger an actual Pages deploy.
- New `api-ci.yml`: `tsc --noEmit` on both tsconfigs + `npm test`, on push
  to main and on PRs touching `apps/api/**`. Deploy itself stays manual
  (`npm run deploy`) — wiring a Cloudflare API token into GitHub secrets
  for automated Worker deploy is a separate decision, out of scope here.
