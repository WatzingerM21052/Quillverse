# Character Creator (Issue #12, §131/§170-176)

Started: 2026-08-16.

## What this feature is

Before this, the player was permanently hardcoded to the seeded Matthias
Hale — no way to start a new character at all. §131 ANFANGSINITIALISIERUNG
describes this as an AI-conducted interview: the player answers what they
want, the AI fills any gaps with plausible defaults, shows a summary, asks
for corrections. Built AI-assisted per that spec (not a bare deterministic
form) — confirmed with the user before building, since it changes both
scope and quota cost (1-2 real API calls per creation, not zero).

## Design

- **Starting-position constraints stay fixed regardless of player input**
  (§14-16): ordinary poor-but-respectable tenant-farmer family, modest
  finances, rural London-adjacent geography. These are embedded directly in
  `character-creation-prompt.ts` so the AI won't honor a request like "make
  me a duke" — same rule the base master prompt already enforces for normal
  play, just restated for this separate, smaller prompt.
- **A dedicated, small prompt, not the full master prompt.** Draft
  generation doesn't need the 49K-char GM ruleset (context-builder.ts's
  `MASTER_PROMPT_TEXT`) — just the starting-position rules, the player's
  raw answers, and the output contract. Keeps this cheap and fast.
- **New output contract** (`CharacterCreationDraft`), not `ManualTurnResponse`
  — a character has no `scene`/`statePatch`, it has player+family+farm+an
  opening summary. Own validator (`validate-character-creation-draft.ts`),
  same structural-check-before-D1 discipline as `validate-turn-response.ts`.
- **Same reliability patterns as turn generation, reused not reinvented**:
  A32 fallback through every connected provider in priority order, §188
  one-retry-with-format-correction on a validation failure, every attempt
  logged to `ai_calls` (draft calls have no simulation yet, logged under a
  fixed pseudo-id `'character-creation-draft'` so they still count toward
  the daily usage the Settings screen shows).
- **World-pack content (locations, starting date) stays fixed Bridgerton
  defaults** — village market, London, a nearby estate, same ids/positions
  every time (safe: composite PK is `(id, simulation_id)`). Character
  Creator scope is player+family+farm+tone, not new world content — that's
  Phase 8 (deferred) territory.
- **`createSimulationFromDraft` builds a simulation from scratch**
  (`parent_simulation_id NULL`), unlike `forkSavepoint` which always copies
  an existing snapshot. New migration `0011_add_tone_preferences.sql` —
  `tone_preferences_json` on `simulations`, captured at creation so it can
  be threaded into future turns' context (not wired into context-builder.ts
  yet — captured but not yet *used* by generation; a natural follow-up).
- **Draft review is "regenerate," not field-by-field editing.** §131 says
  "zeige eine Zusammenfassung, frage nach Korrekturen" — interpreted
  pragmatically as: adjust your answers and generate again, rather than a
  large per-field edit UI. Kept the scope real for a first pass.

## Verified live end-to-end, 2026-08-16

Full pipeline tested for real, not just built:

1. **Draft**: gave partial answers (name, age, gender, backstory, family,
   farm) for "Eliza Marsh." Gemini (first try, no fallback needed) returned
   a complete, well-formed, high-quality draft — full 13-field appearance
   for player and family member, skills consistent with the backstory
   (Landwirtschaft: gut, Etikette: gering), plausible farm numbers (12
   acres, £16 rent), coherent opening summary. Respected §14-16 (poor
   tenant farmer, no nobility) without being asked to.
2. **Confirm**: persisted correctly — appears in `GET /api/simulations`
   with `parentSimulationId: null` (proving it's a from-scratch creation,
   not mistakenly routed through fork logic), player id resolves, family
   member has a real `type: "family"` relationship row, all four standard
   locations present, farm data matches the draft.
3. **Actually playable**: generated one real turn against the new
   character ("feed the chickens, talk to Clara about the rent") — the AI
   correctly referenced Clara, the chickens, and the rent worry, all
   sourced from data that only existed because the creator put it there
   moments earlier. This is the real proof the feature works, not just
   that creation succeeds.
4. Frontend form verified in a real browser — renders correctly, no
   console errors, styled consistently with the rest of the app.

Cleaned up afterward: deleted the test simulation entirely (all 19 child
tables + the simulations row) via direct SQL, same as every other test
this session. Deliberately did **not** delete the `ai_calls` log entries
this test produced — those are real requests that really happened and
really counted against the daily quota; deleting them would make the
Settings usage display lie about how much quota was actually used today.

## Deliberately deferred

- `tone_preferences_json` is captured but not yet threaded into
  `context-builder.ts` — the column exists, generation doesn't read it yet.
- Field-by-field draft editing (currently: regenerate only).
- Multi-world-pack support — every new character is Bridgerton, same as
  the seed. Genuinely new world content is Phase 8, separately deferred.
