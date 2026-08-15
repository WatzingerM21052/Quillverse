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

- [x] `GET /api/assets/:key` — R2 read route.
- [x] `services/image-generation.ts` — Pollinations (build+verify first),
      Gemini behind the same interface.
- [x] `POST /api/simulations/:id/characters/:characterId/portrait` — scoped
      by `(id, simulation_id)`, merges `basePortrait`, returns full state.
- [x] Frontend: prompt builder, "Portrait generieren" button + `<img>` in
      `characters-screen` (grid card + sheet).

## Verified live, 2026-08-15 (real Gemini key connected)

- **Gemini adapter code is correct** — auth, model discovery
  (`gemini-2.5-flash-image` found via the live models list, not hardcoded),
  request/response shape all worked: the call reached Gemini and got back a
  well-formed, structured error.
- **But the free tier has a hard 0 quota for this model on this account**:
  `RESOURCE_EXHAUSTED`, `limit: 0` for
  `generate_content_free_tier_requests` / `..._input_token_count` on
  `gemini-2.5-flash-preview-image`. Image generation via Gemini needs a
  billing-enabled Google Cloud project — it is not actually free the way
  Gemini's *text* free tier is. Don't re-promise "free Gemini images" to the
  user without that caveat.
- **Pollinations works but is unreliable in two ways**: (1) transient
  failures — one request 502'd, the identical retry succeeded; (2) prompt
  adherence is weak — a prompt explicitly describing a male farmer character
  ("Matthias", rugged, work clothes) produced a portrait of a young woman in
  an evening gown. Fine as a zero-cost fallback that keeps the feature from
  hard-failing, not good enough as the primary path for character
  consistency (§166 will need this fixed or a better fallback — Imagen via
  the same Gemini billing, or a different keyless service — before it's
  worth relying on).
- Cleaned up after testing: reset `char_player_matthias.basePortrait` back
  to its placeholder and deleted the generated R2 object. One earlier test
  object from before debug logging was added may still be orphaned in R2 —
  wrangler's CLI has no bucket-listing command to find it by; harmless
  (a few KB, non-sensitive image), not worth building a listing endpoint
  just to chase it down.

## Imagen fallback attempt, 2026-08-16 (Issue #10) — didn't work, here's why

Added `tryImagen()` ahead of the native Gemini image path, based on the
account's own rate-limit dashboard showing real `0/25` daily quota for all
three Imagen 4 variants (unlike the native "Nano Banana" models' `0/0/0`).
Implemented against the doc-verified (context7, not memory) `:predict` REST
shape — `x-goog-api-key` header, `instances`/`parameters` body,
`predictions[].bytesBase64Encoded` response.

**Result: none of the three Imagen 4 variants work on this account either.**
`imagen-4.0-generate-001`, `imagen-4.0-ultra-generate-001`, and
`imagen-4.0-fast-generate-001` all returned the identical error, live-tested
one at a time (not guessed): `404 "This model ... is no longer available to
new users... use the Interactions API"`. Model discovery correctly found
and tried all three from the account's live `/v1beta/models` list — this
isn't a wrong-model-name bug like the earlier text/image discovery fixes,
it's the account itself being gated off every legacy (`:predict` and
`:generateContent`) image path. The rate-limit dashboard's `0/25` shows
*entitlement*, not *actual current access* — a newly-created Google account
apparently doesn't get either regardless of what the dashboard displays.

Kept the code (`tryImagen()` tries every discovered candidate, not just
one, before falling through to `tryGeminiNative()` then Pollinations) —
structurally correct and may start working on this account automatically
as it ages, or immediately for a different/older/billing-enabled Google
account. Not spending further quota chasing this further this session;
Pollinations remains the only path that actually produces an image here.

Cleaned up: reset all four characters' `basePortrait` back to placeholder
and deleted the four test R2 objects this produced — including the one
"orphaned" object flagged in the note above, whose id turned up during this
pass (`char_grace_hale`'s portrait, presumably from browser UI testing
between the original build and now).

## Deliberately deferred

- **§166 Character Reference Lock** ("Lock Appearance" button, feeding an
  accepted portrait back in as a reference image for future variants) —
  needs the base generation path proven first.
- Portraits for the Map/Society/Letters screens, weather, expressions,
  cinematic scene art — rest of Phase 7, not this pass.
- No cleanup/expiry for generated R2 objects yet — fine at prototype volume,
  revisit if it matters later.
