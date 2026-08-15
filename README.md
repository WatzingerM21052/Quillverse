# Quillverse

A persistent, AI-narrated Living World Simulation engine — an immersive visual-novel-style
app, not a chatbot. First world pack: Bridgerton (Season 1). Built to support other world
packs (Harry Potter, Woodwalker, H2O – Mako Mermaids, ...) later on the same engine.

## Spec

The full product/simulation specification this project implements lives in [`docs/spec/`](docs/spec/):

- [`simulation-master-prompt-v3.md`](docs/spec/simulation-master-prompt-v3.md) — GM/simulation rules (canon gravity, NPC autonomy, relationships, memory, economy, save-state shape)
- [`ui-master-prompt-v1.md`](docs/spec/ui-master-prompt-v1.md) — product/UI spec (immersive Story Mode, screens, provider-independent architecture, phased rollout)
- [`addendum-v1.1-architecture.md`](docs/spec/addendum-v1.1-architecture.md) — deployment architecture (GitHub Pages + Cloudflare Worker + D1 + R2, provider modes, backup system)
- [`addendum-v1.2-byok.md`](docs/spec/addendum-v1.2-byok.md) — Bring-Your-Own-Key system (encrypted credentials, provider adapters, fallback)

## Structure

```text
apps/
  web/          Angular PWA frontend (Story Mode UI, core state models, AI provider abstraction)
  api/          Cloudflare Worker backend (D1 + R2 + BYOK credential service)
docs/
  spec/         the specification documents above
  superpowers/plans/   detailed per-phase implementation plans, written as each phase starts
```

Frontend live at **https://watzingerm21052.github.io/Quillverse/** — redeploys automatically
via GitHub Actions on every push to `main`.

Backend live at **https://quillverse-api.svhofkirchen-api.workers.dev** — deploy manually with
`cd apps/api && npm run deploy` (no CI wiring yet). The frontend fetches
`GET /api/simulations/sim_default` on startup (`simulation-state.store.ts`) and falls back to
its local seed only if that request fails.

**Manual Relay Mode is live** (addendum-v1.1 A23-A26, addendum-v1.2 B68) — the player types an
action, the Story screen builds a full context package (complete master-prompt rules + current
state, `apps/api/src/services/context-builder.ts`), the player copies it into any external AI
chat (ChatGPT/Claude/Gemini quick-links provided), pastes the reply back, and
`POST /api/simulations/:id/commit` validates + atomically applies it to D1 (relationship/canon
merges, new memories/letters/finance/characters/locations, stale-stateVersion rejection).
Verified end-to-end in a real browser session. This needs **no AI API key at all** — it's the
whole story loop working today, before any Direct API provider is connected.

> Note: the Angular service worker can serve a stale cached build for a little while after a
> deploy. If the live site behaves unexpectedly, unregister the service worker / hard-reload
> before assuming something broke.

Inside `apps/api/src/`:

```text
db/simulation-repository.ts   assembles a full SimulationState JSON from D1 rows
db/apply-turn.ts              atomically applies a turn's StatePatch via db.batch(), merging
                               (not overwriting) relationships/canon events against existing rows
routes/simulations.ts         GET /api/simulations/:id
routes/turns.ts                POST /api/simulations/:id/context-package and .../commit — Manual Relay
services/context-builder.ts   assembles the full context package (master prompt + state + action)
services/validate-turn-response.ts   rejects malformed pasted responses before they touch D1
assets/master-prompt.ts       simulation-master-prompt-v3.md embedded whole (scripts/embed-master-prompt.mjs)
routes/ai-providers.ts        GET/POST/DELETE /api/ai/providers — BYOK Test & Save flow (B4-B19),
                               called for real by Settings; verified it genuinely rejects a fake key
crypto/credential-encryption.ts   AES-GCM encrypt/decrypt using the CREDENTIAL_MASTER_KEY secret
providers/                    one adapter per AI provider (Gemini/OpenAI/Anthropic), each
                               implementing validateCredential/listModels against the real API —
                               structurally complete, untested against a real key (none available),
                               and not yet wired to generateStory
db/savepoints.ts               create/list/restore named full-state snapshots (§94-96, §153);
                               fork() branches a savepoint into a brand-new simulation row with
                               its own id, leaving the source timeline untouched (§154 Branching
                               Timelines) — every entity table has a composite (id, simulation_id)
                               primary key so the same entity ids can exist in both timelines
routes/simulations.ts          GET /api/simulations lists every timeline for Save Selection (§123)
```

D1 (`quillverse-db`) and R2 (`quillverse-storage`) are dedicated Cloudflare resources for this
project only — created after checking the account's existing resources to avoid any collision
with other projects on the same account.

Migrations: `cd apps/api && npx wrangler d1 migrations apply quillverse-db --remote`. The seed
migration (`migrations/0002_seed_default_simulation.sql`) is generated by
`scripts/generate-seed.mjs` from the exact same data as the frontend's seed, so both start from
an identical Matthias Hale + family setup per `simulation-master-prompt-v3.md` §131/§132 —
regenerate it if the frontend seed changes.

`CREDENTIAL_MASTER_KEY` is a Worker Secret (random, generated once, never committed — see
`.dev.vars` locally, gitignored). Losing it makes stored provider credentials undecryptable;
users would just reconnect their providers.

Inside `apps/web/src/app/`:

```text
core/
  state/models/     world-agnostic state schema (Character, Relationship, Memory, CanonEvent,
                     Location, Letter, Scene, Turn, SimulationState, Farm, Finance, WorldStatus,
                     SocialCalendar, Chapter) — entity IDs throughout, patches not full
                     rewrites (ui-master-prompt-v1.md §88, addendum-v1.1 A28)
  state/seed/       mock SimulationState (Matthias Hale + family) so every screen has real
                     data to render before the AI Orchestrator exists
  state/simulation-state.store.ts   the single place every screen reads state from (§76-78)
  ai/               provider-independent AiProvider interface + request/response contract
                     (addendum-v1.2-byok.md B38-B40); ManualRelayService + AiProvidersApiService
                     call the real backend (context-package/commit, BYOK connect/disconnect)
  world-pack/       the engine/content seam (see below) + WORLD_PACKS registry
shared/
  ui/modal/         the one modal component used everywhere an overlay is needed
core/gm/          GmModeService (local toggle) + runContinuityCheck() — a real audit, not a badge
features/
  shell/            AppShell (nav rail/bottom bar) + PlaceholderScreen (unused for now,
                     kept for future nav areas)
  story/            Story Mode — the primary view (§9), Manual Relay modal lives here
  profile/          Player Profile — appearance, skills, wardrobe, inventory (§69-72)
  characters/       Character grid + detail sheet (§27-33), GM-only reveal when GM Mode is on
  relationships/    Relationship web (§34-36), raw dimensions + inner thoughts in GM Mode
  world/            Living-world almanac (§37-39)
  map/              Fog-of-knowledge map + travel info (§40-43)
  estate/           Farm overview, ledger, calendar (§44-49)
  society/          Social access ladder, invitations, Lady Whistledown (§50-58)
  letters/          Correspondence desk (§59-63)
  journal/          Chapters + important memories (§64-65)
  timeline/         Chronological events + Canon Divergence view (§66-68)
  settings/         AI & Models (real Connect/Disconnect calls), GM/Debug toggle,
                     Backup & Export (Save Points — create/list/restore)
  gm/               GM Dashboard (/gm, only linked from nav when GM Mode is on) — continuity
                     health, state version, canon drift, every NPC's actual location + goals
```

## The world-pack seam

Everything under `core/` is world-agnostic: relationship dimensions, memory + fading,
information/knowledge status, the social access ladder, canon-divergence tracking, event
sourcing, provider adapters. Everything setting-specific — canon events, character roster,
locations, social-ladder labels, visual style bible, tone rules, starting conditions — lives
in a `WorldPack` (`core/world-pack/world-pack.model.ts`).

`core/world-pack/world-packs/bridgerton/` holds the first (currently minimal) world pack.
Authoring its full canon-event graph and character roster, and building additional world
packs for other settings, is deliberately deferred — see the roadmap below.

## Roadmap / phase status

| Phase | Status |
|---|---|
| 0 — Manual validation of the simulation design | skipped by request |
| **1 — Core Foundation** (state schema, world-pack seam, AI provider interface, nav shell + all 10 screens) | **done**, now backed by a real D1 database |
| **2 — Story MVP** | **done via Manual Relay** — the full turn loop (context package → external AI → paste back → validate → commit → every screen updates) works with zero API keys. Direct-API `generateStory` calls still not wired (no key available yet) |
| 3 — World / 4 — Social | **done** — Map/Estate/World/Society (incl. Lady Whistledown)/Letters/Journal/Timeline/Relationships, plus the previously-missing Player Profile (§69-72: skills, wardrobe, inventory); all live-update after each committed turn |
| **5 — Advanced Memory** | **done** — GM Mode toggle + GM Dashboard (real continuity audit, canon drift, NPC actual locations/goals), GM-only reveals in Characters/Relationships, Save Points (create/list/restore) plus **Branching Timelines** (§123-124, §154): fork any Save Point into a new, independent timeline, switch which timeline the whole app reads from in Settings → Backup & Export. Gaps: Timeline Identity (§124) is name/date/version/player-name only — no portrait/location/summary/last-image, since there's no image pipeline yet; Undo Last Turn (§153) and the Timeline Tree visualization (§155) are not started |
| **6 — Multi-Provider** | backend complete (D1, R2, BYOK credential service, real provider adapters) **and now actually called** by Settings (Connect/Disconnect/status are real, not mocked) — only `generateStory` itself stays unwired, no key available |
| 7 — Visual Polish (weather, expressions, cinematic artwork, audio, real portraits) | **started**: character portrait generation (§163-166) — "Portrait generieren" in the Characters screen, backend picks Gemini (reuses the existing story credential, no separate key) or falls back to the keyless Pollinations API, stores to R2. Verified live: Gemini's *free* tier has 0 quota for its image model (needs a billing-enabled Google Cloud project — not actually free the way Gemini text is); Pollinations works but is unreliable (occasional transient failures, weak prompt adherence on gender/context). §166 Character Reference Lock and everything else in this phase (weather, expressions, cinematic scene art, audio) not started |
| 8 — Multi-World (author additional world packs) | not started — deferred by request, will revisit the Bridgerton starting names/setup together first |

## Development

```bash
cd apps/web
npm start      # dev server
npm test       # unit tests (Karma/Jasmine)
npm run build  # production build
```

```bash
cd apps/api
npm run dev             # local Worker dev server (wrangler dev)
npm run deploy          # deploy to Cloudflare
npm run db:migrate:remote   # apply new migrations to quillverse-db
```
