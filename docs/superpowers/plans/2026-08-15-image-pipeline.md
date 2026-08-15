# Image Pipeline — Character Portraits (Phase 7 start, ui-master-prompt-v1.md §163-166)

Started: 2026-08-15.

## What this feature is

§163 Image Provider Unabhängig: the image generator is a separate concern from
the story provider, can fail/fall back independently. §164 Art Style
Consistency: every generated image is steered by the world pack's
`visualStyleBible`. §166 Character Reference Lock: once a portrait is
accepted, later variants should stay recognizably the same character
(deferred here — see below).

## Design

- **No new BYOK credential.** Image generation reuses the *existing* Gemini
  story credential (`getDecryptedCredential(env, 'gemini')`) if the player
  has one connected — same key, same Settings → AI & Models → Gemini →
  Connect flow already built and verified. Do **not** add `'pollinations'`
  to `ProviderId` — it takes no key, so it has no place in the BYOK card
  list; it's a fallback *inside* the image service, not a provider a player
  connects.
- **Provider order: Pollinations first in build order, Gemini preferred at
  runtime.** Pollinations (`image.pollinations.ai`, unauthenticated GET) is
  what actually got built and tested this session — no key exists to test
  Gemini against. At runtime the service tries Gemini first (better quality,
  reference-consistent) and falls through to Pollinations on any failure or
  absent credential — same "works with zero API keys" principle as Manual
  Relay Mode.
- **Gemini model discovery, not a hardcoded model id.** Two different Gemini
  API shapes exist for images (native `generateContent` image output vs.
  Imagen's `:predict`), and which model id is current changes over time.
  The adapter picks a model from the live `/v1beta/models` response
  (`supportedGenerationMethods` + name heuristic) rather than a constant.
  **Structurally complete, unverified against a real key** — same status as
  the existing story-provider adapters had when written (README precedent).
  First real Gemini key connected should re-verify this path end to end.
- **Prompt assembly stays client-side.** The frontend already holds
  `worldPack().visualStyleBible` and the character's `AppearanceProfile` —
  it builds the descriptive prompt and POSTs `{ prompt }`. The backend image
  endpoint is generic ("generate an image for this prompt, store it, attach
  to this character") and doesn't need to know simulation content rules.
- **Storage**: R2 (`env.ASSETS`, already provisioned, previously unused) —
  `portraits/<simulationId>/<characterId>/<uuid>.<ext>`. New read route
  `GET /api/assets/:key` — there was no asset-serving route at all before
  this.
- **`characters.visual_state_json.basePortrait`** gets overwritten with the
  relative asset path. Checked first: nothing renders it today (seed values
  are unused `asset://...` placeholders, the actual UI is two empty
  `<div class="…__portrait">` boxes) — safe to repurpose, no new field
  needed.

## Todo

- [ ] `GET /api/assets/:key` — R2 read route.
- [ ] `services/image-generation.ts` — Pollinations (build+verify first),
      Gemini behind the same interface (structural, unverified).
- [ ] `POST /api/simulations/:id/characters/:characterId/portrait` — scoped
      by `(id, simulation_id)`, merges `basePortrait`, returns full state.
- [ ] Frontend: prompt builder, "Portrait generieren" button + `<img>` in
      `characters-screen` (grid card + sheet).

## Deliberately deferred

- **§166 Character Reference Lock** ("Lock Appearance" button, feeding an
  accepted portrait back in as a reference image for future variants) —
  needs the base generation path proven first.
- Portraits for the Map/Society/Letters screens, weather, expressions,
  cinematic scene art — rest of Phase 7, not this pass.
- No cleanup/expiry for generated R2 objects yet — fine at prototype volume,
  revisit if it matters later.
