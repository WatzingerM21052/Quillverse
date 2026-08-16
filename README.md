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
`cd apps/api && npm run deploy` (`.github/workflows/api-ci.yml` runs `wrangler types` + `tsc`
+ `vitest` on every push, but does not deploy — that stays a manual step). The frontend fetches
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
routes/backup.ts               GET /:id/export and POST /import — ZIP Compact Save (§A34-A45),
                                content assembled server-side, zipped client-side
routes/characters.ts           POST .../portrait (§163-166, tries Imagen/Gemini/Pollinations/
                                Cloudflare in order) and POST/DELETE .../portrait/lock (§166
                                Character Reference Lock — img2img reference for future variants)
services/image-generation.ts   the actual four-provider fallback chain + Cloudflare img2img call
```

`env.AI` (Cloudflare Workers AI) is bound in `wrangler.jsonc` for the portrait fallback/img2img
paths above. `apps/api/vitest.config.ts` deliberately points at `wrangler.test.jsonc` (same
D1/R2 bindings, no `ai`) instead of the main config — Miniflare can't emulate the AI binding
locally, so including it in the test pool would require a `CLOUDFLARE_API_TOKEN` in CI for
something no test actually exercises.

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
  characters/       Character grid + detail sheet (§27-33), GM-only reveal when GM Mode is on,
                     portrait generation + "Aussehen sperren" Character Reference Lock (§166)
  relationships/    Relationship web (§34-36), raw dimensions + inner thoughts in GM Mode
  world/            Living-world almanac (§37-39)
  map/              Fog-of-knowledge map + travel info (§40-43)
  estate/           Farm overview, ledger, calendar (§44-49)
  society/          Social access ladder, invitations, Lady Whistledown (§50-58)
  letters/          Correspondence desk (§59-63)
  journal/          Chapters + important memories (§64-65)
  timeline/         Chronological events + Canon Divergence view (§66-68)
  settings/         AI & Models (real Connect/Disconnect calls), GM/Debug toggle,
                     Backup & Export (Save Points — create/list/restore; ZIP Compact Save
                     export/download + import-as-new-timeline, §A34-A45), Save Selection /
                     Timeline Tree
  gm/               GM Dashboard (/gm, only linked from nav when GM Mode is on) — continuity
                     health, state version, canon drift, every NPC's actual location + goals
  character-creator/  /new-character (linked from Settings → Backup & Export) — AI-conducted
                     interview (§131), creates a brand-new timeline from scratch
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
| **2 — Story MVP** | **done** — Manual Relay still works with zero API keys, and direct-API turns are now wired too: when a BYOK provider is connected, the Story screen calls it directly (`POST /api/simulations/:id/turn/generate`, reusing the same context-builder/validate/apply-turn pipeline), no copy-paste needed. Verified live against a real connected Gemini key — coherent, in-character, world-consistent narration |
| 3 — World / 4 — Social | **done** — Map/Estate/World/Society (incl. Lady Whistledown)/Letters/Journal/Timeline/Relationships, plus the previously-missing Player Profile (§69-72: skills, wardrobe, inventory); all live-update after each committed turn |
| **5 — Advanced Memory** | **done** — GM Mode toggle + GM Dashboard, GM-only reveals in Characters/Relationships, Save Points (create/list/restore), ZIP Compact Save export/import (§A34-A45 — manifest + full state JSON + human-readable markdown, built client-side with fflate; import always creates a brand-new timeline, never overwrites the active save), **Branching Timelines** (§123-124, §154) with a **Timeline Tree** (§155, nested/indented list in Save Selection showing which timeline each fork branched from), and **Undo Last Turn** (§153) — an autosave taken right before every applied turn, restorable once, filtered out of the player-facing Save Points list. Only remaining gap: Timeline Identity (§124) portrait/location/summary/last-image fields |
| **6 — Multi-Provider** | **done** — BYOK credential service, real provider adapters, and `generateStory` is now wired end-to-end for Gemini (verified live) and structurally complete for OpenAI/Anthropic (unverified — no key available for either) |
| 7 — Visual Polish (weather, expressions, cinematic artwork, audio, real portraits) | **in progress**: portrait generation (§163-166) now tries four providers in order — Imagen 4, native Gemini image, Pollinations (keyless flux, unlimited/free), Cloudflare Workers AI (`flux-1-schnell`, same account this Worker already runs on, free daily neuron allowance). Live-verified: Imagen 4 and native Gemini image are account-gated on this Google account ("no longer available to new users" despite entitled quota showing in the dashboard) — **Pollinations and Cloudflare Workers AI are the two paths that actually work**, both genuinely free with no trial/credit-card gimmick (researched and live-tested against several other "free" APIs — Pollinations' own authenticated tier turned out to require paid Pollen despite marketing claims, same lesson as the Google account). §166 Character Reference Lock is built — "Aussehen sperren" on Characters/Player Profile locks the current portrait as an img2img reference (`stable-diffusion-v1-5-img2img`) for future generations, with an automatic fallback to a plain (unreferenced) generation if the reference call fails, so a locked character is never a dead end. **Not yet verified**: whether the img2img call actually preserves identity well — Cloudflare's shared capacity for that specific model was exhausted throughout live testing (`3040: Capacity temporarily exceeded`), so no successful reference-conditioned generation has been observed yet; worth retesting later. Location art, weather, expressions, cinematic scene art, audio, and the recap/bookmarks/quotes/story-card group (§190-197) not started. A dedicated mobile/responsive pass is also tracked but not started (issue #20) |
| 8 — Multi-World (author additional world packs) | not started — deferred by request, will revisit the Bridgerton starting names/setup together first |
| **Character Creator** (§131, §170-176 — not part of the phase numbering above, but closes a real gap: the player was permanently hardcoded to the seeded Matthias Hale) | **done** — AI-conducted interview at `/new-character` (Settings → Backup & Export → Save Selection): the player answers what they want, blank fields get filled with plausible defaults, the AI proposes a full character+family+farm+opening-summary draft, the player reviews and confirms (or regenerates). Creates a brand-new timeline from scratch (not a fork). Verified live end-to-end including a real turn played on the newly created character, referencing details only that character has. `tone_preferences_json` is captured at creation but not yet threaded into turn generation — a real follow-up, not yet done |

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
