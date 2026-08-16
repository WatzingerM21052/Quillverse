# Arbeitsprotokoll (Claude working log)

Persistent, self-maintained status doc for whoever (which session of Claude) picks this project up next.
Not a spec — the specs live in `docs/spec/`. This is "what happened, what's happening, what's next."
Keep this current: update it whenever a session does non-trivial work, before declaring anything done.

Repo: Quillverse — German-language regency/Bridgerton-style text life-sim.
Angular frontend (`apps/web`), Cloudflare Worker + D1 backend (`apps/api`), deployed via GitHub Actions
to GitHub Pages (frontend) and `wrangler deploy` (Worker). Solo project, built almost entirely by AI
coding sessions across many separate conversations — this file exists because none of those sessions
share memory otherwise.

---

## Status snapshot (2026-08-16, end of session)

Last commit: `da0c7d4` "Structured Stammbaum + generated map background + German-first UI", pushed to
`main`. GitHub Pages deploy succeeded. **API Checks CI failed on that push** — root-caused and fixed
in this session (see below); fix not yet committed as of this writing, see "In progress".

## Done this session

1. **Relationships/Stammbaum rework** — replaced the radial "web" relationship view with an actual
   family tree (generation rows, couple pairing, sibling connectors, explicit character-id-keyed layout
   so Thomas attaches to the deceased father's line not the mother's), plus a separate structured
   "Beziehungen" list for non-family relationships with an honest empty state. Also gave the seed data
   real relationship types (`Mutter`/`Schwester`/`Onkel` instead of generic `family`) and added the
   previously-missing Thomas Hale relationship row, in both `seed-state.ts` (frontend mock) and the
   generated migration (backend). Patched the *live* `sim_default` D1 rows to match (user-approved,
   since it's a change to the production database) — verified after.
2. **Map background generation** — new endpoint + prompt builder that generates a terrain-only,
   label-free antique map background image via the existing 4-provider image pipeline (Pollinations →
   Cloudflare Workers AI → ...), threaded a new `landscape` aspect-ratio option through
   `image-generation.ts` end to end. Pins/location names stay an app-rendered layer on top so alignment
   holds by construction rather than by prompting the image model to place labels correctly. New DB
   column `map_background_asset` added via migration `0014_add_map_background.sql` (additive, nullable
   — safe to apply to live D1 without downtime).
3. **German-first UI pass** — translated remaining English UI chrome (nav, screen titles, Settings) to
   German; added a `LanguageService` + a "Sprache" (DE/EN) toggle wired into Settings and the main nav.
4. **Bugfix: Undo Last Turn was dropping generated art.** Root cause: `savepoints.ts` wholesale-restored
   `locations`/`characters` from the pre-turn autosave on undo, silently discarding any location image
   or portrait generated *between* turns (this is how the map background bug got reported — it vanished
   after Undo). Fixed by reapplying current art-asset fields after rollback.
5. **Deployed**: migration `0014` + Worker (backend), then frontend to GitHub Pages. Verified the new
   "Landkarte generieren" button live via Claude-in-Chrome — iterated on the prompt/provider a few times
   (Pollinations rejected style-bible params it doesn't support; Cloudflare Workers AI rejected
   width/height in the schema) until it produced a proper top-down antique map with roads/woodland/village
   cluster aligned with the pins.

## In progress / needs a decision

**CI regression from this session's commit — root-caused, fix staged, not yet committed.**

`API Checks` failed on push `da0c7d4` with `D1_ERROR: table characters has no column named skills_json`
during `applyD1Migrations` on a fresh test DB. Cause: `scripts/generate-seed.mjs` — the generator for
`migrations/0002_seed_default_simulation.sql` — has accumulated columns/tables from later feature
migrations over the project's history (`skills_json`/`wardrobe_json` from `0004`, `inventory` from
`0004`, `whistledown_issues` from `0006`, `reputation`/`obligations` from `0007`). Every prior session
that extended the generator correctly *left migration 0002 alone* and added the new data via a fresh
migration instead (0005/0006/0007 all say so in their own header comments — e.g. 0005: "Kept separate
from 0002 since that migration already ran against remote before skills/wardrobe/inventory existed").
This session ran the generator to update relationship data and it silently regenerated the *entire*
current data model into 0002, including fields/tables that don't exist yet at migration-0002 time. That
passed locally at the time (the local `.wrangler` test DB had stale state from all migrations already
applied) and passed against live D1 (already fully migrated) — it only breaks a **fresh** apply, which
is exactly what CI does on every run, and what `npm test` does locally when `.wrangler` state is clean.

I mis-diagnosed this the first time (assumed "pre-existing local `.wrangler` corruption, unrelated to my
changes") — that was wrong; a fresh CI clone has no local state to be corrupted, so the failure had to be
real. Caught on re-review.

Fix applied (not yet committed): edited `generate-seed.mjs` to only emit what migration 0002 originally
covered (simulations, characters *without* skills/wardrobe, relationships, locations, memories, letters,
chapters, finance_transactions, world_events, social_calendar), added a header comment explaining why,
regenerated `0002_seed_default_simulation.sql` from the fixed script. Diff against 0002 is now exactly
the 3 relationship-type lines that were the actual intent. `npm test` in `apps/api` now passes 32/32
locally (was failing before the fix, with the identical error CI reported — good corroborating evidence).

Checked: only one D1 database is configured in `wrangler.jsonc` (no staging/preview environment with its
own `database_name`), so editing 0002 in place is safe — there's no second already-migrated database that
would silently diverge. Production already has the relationship fix via the hand-run SQL patch
(`patch-sim-default-relationships.sql`, applied and verified earlier this session).

**Next action**: commit these two files (`apps/api/migrations/0002_seed_default_simulation.sql`,
`apps/api/scripts/generate-seed.mjs`), push, confirm `API Checks` goes green on GitHub Actions — do not
consider the session's work "done" until that's confirmed (the whole point of the fix is that CI was red).

## Planned / open (from GitHub issues + spec audit, 2026-08-16)

§ convention: unqualified `§N` = `ui-master-prompt-v1.md`; `A`-prefixed = `addendum-v1.1-architecture.md`;
`B`-prefixed = `addendum-v1.2-byok.md`. Note `simulation-master-prompt-v3.md` has its own independent
`§106`/`§108-110` (Sensorische Details / Gedankenlese-Fähigkeit / Save-System) — unrelated to the
UI-doc sections the issues below actually cite.

- **#27 — Module System / selective context loading + memory summarization (§108-110).** `§107` Prompt
  Compiler wants `BASE + SCENE + RELEVANT MODULES + STATE + MEMORY`; `§108` lists 9 discrete prompt
  modules (CORE_SIMULATION, RELATIONSHIPS, ROMANCE, ECONOMY, FARMING, CANON, SOCIETY, TRAVEL, LETTERS)
  loaded selectively per turn; `§109` an 8-tier token-priority trim order; `§110` consolidating ~10 minor
  memories into prose while keeping important ones individual. None of this exists —
  `context-builder.ts` sends everything unconditionally every turn. Needs its own design pass, not a
  quick fix.
- **#26 — Long-tail spec gaps (grouped, small items).** Missing: `§20` Action Mode chips, `§22-23`
  scene/time transition cards, `§26` Focus Mode, `§54` Dance Card, `§160` Model Profiles, `§189` Story
  Quality Controls, `B17` Provider Detail Page, `B20` session-only key, `B33` configurable fallback
  order, `B46` token-usage dashboard, `B50` pre-submit Manual Narrator dropdown, `A38` Full Archive
  backup (adds `/assets/` to Compact Save). Partial: `§29` Character Sheet non-GM view omits known
  whereabouts; `§75` Memory Inspector missing "Referenced by"/"Created" columns. Unused data:
  `Scene.expression`/`imageCue`, `CharacterVisualState.availableExpressions`, most `Character.appearance`
  fields beyond the 6 shown on Player Profile. Triage individually when picked up.
- **#25 — Continuity Guard second-pass check (§106).** Optional, cheap second AI call before commit —
  "does this response contradict current state?" — for important scenes only, not every turn.
  `validate-turn-response.ts` only checks structural/schema correctness. Likely reuses the repair-retry
  pattern already built for §188 (issue #9, closed).
- **#20 — Mobile optimization pass.** `§130 MOBILE` wants a stacked Story Mode layout (scene image →
  portrait → dialogue → input) with bottom-bar nav; `§131 TABLET`/`§132 DESKTOP` cover the other
  breakpoints. `.shell__rail--mobile` exists but is unverified in practice; Character Creator's long
  form and Settings' multi-column layout flagged as likely worst offenders.
- **#19 — Location art + visual polish (rest of Phase 7).** `A15 Ortsbibliothek` wants day/season/weather
  location variants primarily via lighting/overlay/particle/color-grading layers over a base image, a
  wholly new image only when necessary. Also in scope: `A16` Cinematic Artwork System, `§40-43`
  Map/Travel, `§111-117` Image Asset System, `§116` Major Event Gallery, `§117` Player House Visual
  Progression. The portrait pipeline (`image-generation.ts`) pattern transfers directly; static
  decorative assets (`§6` Ornamentik — seals, borders, dividers) are art-direction work, not code.

**Other gaps noticed, not yet tracked as an issue:**
- `§124` Timeline Identity — each save should carry title, current date, player portrait, current
  location, short summary, last scene image. README's own "last remaining Phase 5 gap."
- `§167` Location Reference Lock — the location-entity analogue of the already-built `§166` Character
  Reference Lock (img2img identity pinning). Natural to bundle into #19.
- Verification debt (code exists, unproven live): Character Reference Lock's img2img call has never
  completed successfully — Cloudflare's `stable-diffusion-v1-5-img2img` kept returning `3040: Capacity
  temporarily exceeded` throughout testing; OpenAI/Anthropic provider adapters are structurally complete
  but untested end-to-end (no key available for either).
- No TODO/FIXME comments anywhere in `apps/web` or `apps/api` — gap-tracking happens entirely through
  GitHub issues via periodic docs-vs-implementation audits, not inline code comments. Keep using that
  pattern rather than starting to sprinkle TODOs.

## Conventions worth remembering (so future sessions don't repeat this mistake)

- `migrations/0002_seed_default_simulation.sql` is **frozen in shape** — it already ran against
  production. New seed fields/tables always go in a *new* migration (see 0005/0006/0007 pattern), never
  by re-running `generate-seed.mjs` unless the generator itself has been checked to still only emit
  0002's original scope. If you touch `generate-seed.mjs`, re-diff the regenerated 0002 against the
  version already on `main` before committing — it should normally be a tiny diff.
- Migrations are applied in filename order (`0001`, `0002`, ...) against a **fresh** DB in CI and in any
  new dev/local `.wrangler` state — don't assume "works against live D1" or "works with my locally-warm
  `.wrangler` state" means a migration is fresh-apply-safe. `npm test` in `apps/api` applies migrations
  fresh every run precisely to catch this class of bug — treat a red `API Checks` run as a real signal,
  not noise, even if the Pages deploy succeeded.
- The project deploys frontend (GitHub Pages) and backend (Worker + D1 migrations) as separate steps/
  workflows; a green Pages deploy does not imply the API Checks workflow passed.
- Production D1 database is `sim_default`'s single simulation row set — this project doesn't yet have a
  staging environment. Direct live-DB patches (outside of migrations) have been used at least once this
  session for a data fix and should stay rare, explicit, and user-confirmed each time.
