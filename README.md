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
docs/
  spec/         the specification documents above
  superpowers/plans/   detailed per-phase implementation plans, written as each phase starts
```

Live at **https://watzingerm21052.github.io/Quillverse/** — redeploys automatically via
GitHub Actions on every push to `main`.

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
                     (addendum-v1.2-byok.md B38-B40) — not yet wired to a real backend
  world-pack/       the engine/content seam (see below) + WORLD_PACKS registry
shared/
  ui/modal/         the one modal component used everywhere an overlay is needed
features/
  shell/            AppShell (nav rail/bottom bar) + PlaceholderScreen (unused for now,
                     kept for future nav areas)
  story/            Story Mode — the primary view (§9)
  characters/       Character grid + detail sheet (§27-33)
  relationships/    Relationship web (§34-36)
  world/            Living-world almanac (§37-39)
  map/              Fog-of-knowledge map + travel info (§40-43)
  estate/           Farm overview, ledger, calendar (§44-49)
  society/          Social access ladder + invitations (§50-58)
  letters/          Correspondence desk (§59-63)
  journal/          Chapters + important memories (§64-65)
  timeline/         Chronological events + Canon Divergence view (§66-68)
  settings/         AI & Models shell — provider cards, Connect flow UI, no live calls
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
| **1 — Core Foundation** (state schema, world-pack seam, AI provider interface, nav shell + all 10 screens with mock data) | **mostly done** — no real AI wiring yet, by request |
| 2 — Story MVP (wire AI Orchestrator to a real backend, autosave, state-mutating actions) | not started |
| 3 — World / 4 — Social | UI built ahead of schedule (Map/Estate/World/Society/Letters/Journal/Timeline/Relationships all render from seed data); still needs live state changes |
| 5 — Advanced Memory (retrieval, snapshots, GM dashboard) | not started |
| 6 — Multi-Provider (OpenAI/Anthropic/Gemini adapters, fallback, Cloudflare Worker backend) | not started — Settings UI shell exists, no network calls |
| 7 — Visual Polish (weather, expressions, cinematic artwork, audio, real portraits) | not started — everything is placeholder geometry today |
| 8 — Multi-World (author additional world packs) | not started |

## Development

```bash
cd apps/web
npm start      # dev server
npm test       # unit tests (Karma/Jasmine)
npm run build  # production build
```
