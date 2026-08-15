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

Inside `apps/web/src/app/`:

```text
core/
  state/models/     world-agnostic state schema (Character, Relationship, Memory, CanonEvent,
                     Location, Letter, Scene, Turn, SimulationState) — entity IDs throughout,
                     patches not full rewrites (ui-master-prompt-v1.md §88, addendum-v1.1 A28)
  ai/               provider-independent AiProvider interface + request/response contract
                     (addendum-v1.2-byok.md B38-B40)
  world-pack/       the engine/content seam (see below)
features/
  story/            Story Mode screen — the primary view (§9)
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
| **1 — Core Foundation** (state schema, world-pack seam, AI provider abstraction, Story screen skeleton) | **in progress** |
| 2 — Story MVP (wire AI Orchestrator, autosave, character sheets) | not started |
| 3 — World (Map, Estate, Calendar, Letters, Timeline) | not started |
| 4 — Social (Relationships, Society, Whistledown, Ball UI) | not started |
| 5 — Advanced Memory (retrieval, snapshots, canon-divergence view, GM dashboard) | not started |
| 6 — Multi-Provider (OpenAI/Anthropic/Gemini adapters, fallback) | not started |
| 7 — Visual Polish (weather, expressions, cinematic artwork, audio) | not started |
| 8 — Multi-World (author additional world packs) | not started |

## Development

```bash
cd apps/web
npm start      # dev server
npm test       # unit tests (Karma/Jasmine)
npm run build  # production build
```
