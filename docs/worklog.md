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

## Status snapshot (2026-08-20/21, current session)

Last pushed commit before this visual-design task: `9c12c8c` (worklog handoff after the Continuity
Guard batch). Both `API Checks` and `Deploy to GitHub Pages` completed successfully for that push.
The Continuity Guard implementation through `54f7cd4` is therefore committed, pushed, tested, and
deployed; only its process-level final whole-batch review remains outstanding (see "Immediate next
steps").

**Current task: Quillverse visual asset library.** The user asked for a project-local `pictures/`
library containing universal templates (maps, characters, locations, story scenes, textures,
ornaments, placeholders) plus a concrete Bridgerton test pack. The Quillverse master brand must remain
world-neutral; Bridgerton/Regency styling belongs only to that world pack. Brainstorming chose
**A — Living Manuscript** as the primary brand direction (abstract quill + open book/narrative portal +
optional subtle Q, ink blue/ivory/muted gold). Comparison examples for **B — Celestial Archive** and
**C — Storybook Crest** are also required. Logo, favicon, and banner are review-gated: create drafts in
`pictures/review-required/`, show them to the user, and do not integrate or replace any app asset until
explicit approval. Approved design spec:
`docs/superpowers/specs/2026-08-20-visual-asset-library-design.md`. The user approved the written spec
and delegated detailed visual decisions. Gate-1 implementation plan:
`docs/superpowers/plans/2026-08-20-visual-asset-library-gate-1.md`. Inline execution was selected. The
complete `pictures/` folder scaffold and its README, asset catalog, prompt ledger, visual style bible,
and future universal/Bridgerton placeholders now exist. All six primary A — Living Manuscript review
assets have been generated and inspected: three logo marks, two wordless wide banners, and one
three-option app-icon/favicon study board. All three active logo candidates have true transparent
corners (alpha 0). The initial Gate-1 implementation range is `f80595a..00403bd`, following the design
and plan commits `bd7e917` and `87ac0da`.

**User review received 2026-08-21.** A1 is the emphatic master-logo favorite; A2 remains a positive
backup and A3 is not preferred. The top-center portal/book/quill treatment from the icon study is the
favored small-icon direction. A banner 1 should be replaced rather than polished because its blocky
perspective reads Minecraft-like and disconnected; A banner 2 is the stronger basis but needs a much
clearer, calmer first read. The original B-logo V1 form is preferred over clean V3 because of its book
shape and indirect omega impression, but V1 is technically opaque and may only guide a fresh
transparent regeneration. B banner is strongly liked, C logo is usable but not exceptional, and C
banner is a standout. Full feedback and design synthesis:
`pictures/docs/review-feedback-2026-08-21.md`.

Every generated file remains preserved. Non-final alternatives, valuable form references, and opaque
checkerboard failures were moved from the active review folders into purpose-specific subfolders under
`pictures/Experimentelles/`; active corrected variants now have clean versionless filenames. No
production app asset or source file was changed. The next visual checkpoint is one focused refinement
round: A1-derived simplified icon, organic replacement for A banner 1, calmer A banner 2, and a
transparent regeneration of the B-V1 form. Do not integrate anything into the app yet.

**Refinement round completed and reviewed 2026-08-21.** The user requested three
variants per target to make visual feedback easier. All twelve outputs remain preserved in
the refinement library: three A1-derived icons, three organic banner-1 replacements, three calmer
banner-2 variants, and three B-V1/omega regenerations. Every file was inspected locally. All six fresh
square icon/logo outputs had genuine transparent corners (alpha 0). Both transparent groups first
produced three opaque-checkerboard R1 failures each; all six failures were preserved under matching
numbered `pictures/Experimentelles/refinement-2026-08-21/*/technical-failures/` folders, then replaced
with fresh reference-free R2 generations. Exact prompts, correction history, dimensions, and visual-
purpose notes are in `pictures/docs/refinement-round-2026-08-21.md`; every file is indexed in
`pictures/docs/asset-catalog.md`. Existing favorites remain untouched.

Second-round choices are now recorded: I2/Q portal is the preferred icon (I1 good, I3 acceptable backup);
B1.1/page doorway is the likely organic-banner favorite but all three were rated “MEGA”; B2.1/two-world
path is the likely calmer-banner favorite but all three were rated “hammermäßig”. O1 is only the most
usable new B/Omega study and still does not beat the original V1 form; O2/O3 are non-preferred. The
folders were reorganized without deleting anything: numbered groups `01`–`04` plus explicit status
subfolders (`preferred`, `strong-alternatives`, `alternatives`, `needs-refinement`, `not-preferred`,
`technical-failures`). Active A candidates and O1 stay under `review-required`; O2/O3 and all six
technical failures are under `Experimentelles`. No code, Angular/API source, production app asset, or
deployment configuration was changed. Before production use, I2 still needs a dedicated edge/fringe and
favicon-size cleanup pass followed by explicit approval.

**Gate 2A visual batch started 2026-08-21.** The user delegated visual decisions
and asked for exceptionally strong designs. This batch remains image-only and
creates exactly twelve review assets: three I2 applications (clean master,
micro-favicon, app tile), three universal map bases, three consistent universal
character-composition references, and three universal location-composition
references. Exact prompts and destination paths are frozen before generation in
`pictures/docs/universal-template-round-2026-08-21.md`. The anonymous character
headshot becomes the identity anchor for its half-body and four-expression
follow-ups. Universal assets stay world-neutral and contain no text, labels,
pins, UI, franchise motifs, or Regency-specific identity. No application code or
production asset may be changed. The Bridgerton concrete test pack follows only
after this universal batch is generated, audited, and visually reviewed.

**Gate 2A generated; Gate 2B Regency pack started 2026-08-21.** All twelve Gate
2A review assets now exist locally and were individually inspected: three I2
applications, three label-free overhead maps, a three-image identity-locked
universal character series, and three UI-aware universal locations. The next
pack is derived directly from `sim_default` and the visual design spec, not from
a generic Regency moodboard: Matthias, Anne, Grace, and Thomas Hale; Hale farm,
village market, Regency London, and Aubrey Hall; one map matching the seeded
southwest/northeast/southeast sectors; and one Matthias-at-dawn story scene.
Its complete ten-image matrix and exact frozen prompts are in
`pictures/docs/regency-test-pack-round-2026-08-21.md`. No source code or
production app asset is in scope.

**Gate 2A + Gate 2B generation completed 2026-08-21.** Twenty-two new review
images are now stored under the dated Gate 2 folders: 12 universal/brand
derivative assets and 10 seed-specific Regency assets. Every image was opened
from its final local path and visually checked. The four Hale portraits share
crop, light, medium, and plausible family traits without face cloning. The four
locations form a coherent social ladder from the cash-strapped Hale farm to
Aubrey Hall. The label-free Hale-region map matches the seed's southwest farm/
village, northeast London, and southeast estate sectors. The final story scene
successfully preserves both Matthias and the Hale farm. Central navigation docs
and the asset catalog now index all outputs; exact prompts and audits live in
the two Gate 2 ledgers. No hard-constraint failure occurred, nothing was deleted,
and no file under `apps/` was touched. The frozen-prompt checkpoint is commit
`9d016e3`; all 22 images, audits, catalog entries, and navigation docs are commit
`6e4c0a1`. Both are pushed to `origin/main`, and the worktree was clean and 0/0
with the remote after push. Remaining work is user visual feedback only; app
integration still requires a separate explicit approval.

**Gate 2 user review + Gate 2C age correction started 2026-08-21.** Icon 1 and
Icon 3 are both rated very good and may become a light-/dark-surface pair; Icon
2 is not preferred. Universal Map 1 is the preferred default, Map 2 remains a
positive alternative, and Map 3 should retain its more dynamic composition but
lose the desert-like bleak sepia palette. Universal characters are positive;
all location/land imagery is rated great/top. Anne and Thomas are top. The user
explicitly locked visual ages to Matthias 18 and Grace 16. Grace already fits;
Matthias's portrait and dawn scene need versioned age-18 replacements because
he currently reads too old and wrinkled. Exact prompts and non-overwriting
destinations are frozen in `pictures/docs/age-correction-round-2026-08-21.md`.
This remains image-only: no `apps/` or seed-data change is authorized.

**Gate 2C age correction generated 2026-08-21.** A new versioned Matthias
portrait now reads clearly as 18 while preserving his eyes, hair, clothing,
circular crop, lighting, and painterly identity. A matching corrected dawn scene
preserves the Hale farm, letter moment, mood, and UI-safe composition with the
same age-18 face. Grace remains the accepted age-16 portrait. Both new files were
opened from their final paths and passed visual/dimension checks. The two
superseded older-looking Matthias files were moved, not deleted, to
`pictures/Experimentelles/world-packs/bridgerton/age-correction-2026-08-21/`.
The age-correction ledger and catalog are current. No `apps/` or seed-data file
was changed. The complete feedback/age-correction set is commit `87fb373` and is
pushed to `origin/main`. Remaining visual decisions are user approval of the new
age-18 pair, later finalization of the Icon-1/Icon-3 light/dark pair, and a
lusher Map-3 palette variant.

**Final visual mini-pass completed and audited 2026-08-21.** The user approved
the recommended Icon-1/Icon-3 light/dark refinement and greener Map-3 revision,
and added one strict portrait instruction: remove only the circular presentation
and background while locking every person detail. The active review set now has
a genuine-alpha I2 master, matched full-bleed light/dark tiles, and three lusher
Map-3 variants (balanced sage, strongest temperate green, and cool rain-washed).
The icon family and maps passed local dimension/format and visual checks; minor
close-zoom fringe on the transparent mark still needs review. Matthias has one
real-alpha age-18 cutout draft, but colored edge contamination and corner alpha
`0,0,3,223` make it `needs-refinement`, not production-ready. Anne, Grace, and
Thomas each failed four controlled alpha strategies: every result is 24-bit RGB
with a painted checkerboard. All twelve failures are retained only under the
matching `pictures/Experimentelles/` technical-failures folder and no false
cutout was promoted. Exact prompts, corrections, measurements, and audit:
`pictures/docs/final-light-dark-map-cutout-round-2026-08-21.md`. The catalog,
review feedback, and folder navigation are current. Universal character assets
without the circular Hale presentation remain unchanged. No app code, seed
data, production asset, or integration was changed.
The complete image/audit/catalog set is commit `06f83d1`; publication status is
recorded by the immediately following worklog handoff commit.

**Final Hale-family package generated and audited 2026-08-21.** The user has
visually accepted the complete I2 icon family, all three lush Map-3 variants
with `lush-sage` as favorite, Matthias's age-18 portrait/dawn scene/visible
cutout result, and the unchanged Anne/Grace age-16/Thomas portraits. One dated
family folder now groups byte-identical copies of those four portraits,
Matthias's scene and cutout, three new identity-locked individual scenes, and
one ensemble scene generated last. Anne stands at the farmhouse doorway with
mended linen; Grace remains clearly 16 at the farm gate; Thomas arrives with a
restrained merchant cart; the ensemble contains exactly Thomas, Anne, Grace 16,
and Matthias 18 with no duplicate or extra person. Every scene is 1536x1024,
was opened from its final path, and passed local identity/age/period/people-count
checks. The six copied assets are hash-identical to their accepted sources.
Built-in cutout generation still cannot deliver real alpha for Anne, Grace, or
Thomas: three R1 calls plus a simplified Anne R2 control all returned 24-bit RGB
with painted transparency. Those four outputs live only under the matching
`pictures/Experimentelles/` technical-failures folder; none was promoted. The
documented CLI fallback requires a locally configured `OPENAI_API_KEY` and
explicit user permission, so it was not used. Exact prompts, output matrix,
measurements, and audit:
`pictures/docs/hale-final-family-round-2026-08-21.md`. No application code,
seed data, production asset, or integration changed.
The user then reviewed Anne's doorway scene, Grace's gate scene, Thomas's
arrival, and the complete four-person family scene and confirmed that they look
good. All four new scenes are now `positive`; the family-scene review checkpoint
is closed. Only the three real-alpha Anne/Grace/Thomas cutouts remain missing
from this visual package.
The completed family package was staged separately but was consumed by the
concurrently running Character Creator planning commit `9eedfa0`, which also
contains `docs/superpowers/plans/2026-08-21-prompt-verbessern-character-creator.md`.
Do not amend or rewrite that shared commit; this note is the separate visual
handoff. `origin/main` still ends at `5c29aa5` until the user authorizes
publishing the two unrelated Character Creator commits together with this work.

**Second sub-session today (after the issue #26 Quick Wins batch): implemented Roadmap Batch 1
(Continuity Guard + Continuity model profile, issue #25).** All 6 plan tasks complete and individually
reviewed; 3 of them needed a fix round (all fixed and re-reviewed clean — see "Done this session" below
for detail). **The final whole-batch review (the last step of `subagent-driven-development` before
`finishing-a-development-branch`) was NOT run** — the session hit a usage/rate limit mid-review once
already this batch (recovered by retrying with a cheaper model) and the user asked to wrap up for the
day right after the last task landed. This is the single most important thing for the next session to
do first — see "Immediate next steps."

## Immediate next steps (do these first, in order)

1. **Visual asset completion:** Icon family, Lush Sage preference, all four portraits, all five
   individual/family scenes, and the visible Matthias cutout are now confirmed. Anne/Grace/Thomas
   real-alpha cutouts remain the only missing family assets. Offer the documented
   CLI/API fallback only if the user explicitly authorizes it and confirms `OPENAI_API_KEY` is set;
   otherwise use a separately authorized deterministic extraction tool later. Do not integrate any
   candidate into the app without separate approval.
2. **Continuity process cleanup (still outstanding):** run the final whole-batch review for the
   Continuity Guard plan. The SDD workspace is still at
   `.superpowers/sdd/2026-08-16-continuity-guard-model-profiles/` with a full ledger
   (`progress.md`) — read it first, it has the exact commit ranges and a summary of every fix round.
   Per `superpowers:subagent-driven-development`: run
   `scripts/review-package docs/superpowers/plans/2026-08-16-continuity-guard-model-profiles.md 8f3f387 54f7cd4`
   (or the actual merge-base if that's shifted), dispatch the final reviewer on the most capable
   available model using `superpowers:requesting-code-review`'s `code-reviewer.md` template, point it at
   the ledger's deferred-minor lines (2 of them — see the ledger) so it can triage what needs fixing
   before merge. If it finds issues: ONE fix dispatch with the complete findings list, ONE scoped
   re-review, adjudicate any residuals per the breaker rules.
3. **If the Continuity final review is clean:** delete the workspace (`rm -rf
   .superpowers/sdd/2026-08-16-continuity-guard-model-profiles`) and use
   `superpowers:finishing-a-development-branch` (this project has no branch/worktree — see the
   "Conventions" section below — so this mostly means "confirm tests pass, confirm pushed, done").
4. **Then**: `gh issue comment 25` (or close it — check the issue body once more against what shipped,
   same as the Quick Wins batch's issue-closing step) and update this file's "Planned / open" +
   "Execution roadmap" sections to move Batch 1 out of "next" — same pattern as this file already shows
   for the Quick Wins batch.
5. **After that**, the roadmap's Batch 2 (Story Mode interaction UX: §20 Action Mode chips, §22-23
   scene/time transition cards) is next in the existing execution order — *unless* the user wants one of
   the newly-noted Design Rework items below prioritized instead; ask rather than assume, the same way
   scope was checked at the start of both batches this session.

## New backlog items noted by the user at end of session (2026-08-16, not yet scoped)

The user asked for these to be recorded for a future brainstorming pass — none of these have a design
spec yet, don't start implementing from this one-line description alone, brainstorm them properly first
(same process as every other batch this session):

- **"Design Rework" continuation — relationship visualization.** User's own words: *"Stammbaum /
  Beziehungsbaum / Freundebaum / Bekanntschaftsbaum"*. Reads as: extend the family-tree visualization
  already built for the Relationships screen (issue #21-24-era "Structured Stammbaum" work, commit
  `da0c7d4`) with the same tree-based treatment for the other relationship categories — friends,
  acquaintances — rather than the current flat "Beziehungen" list for non-family relationships. Likely
  touches `apps/web/src/app/features/relationships/relationships-screen/` and
  `relationship-language.ts`. Needs a real brainstorming pass: what visually distinguishes a
  "Freundebaum" from a "Bekanntschaftsbaum" from the existing flat list? Is "tree" literal (a graph
  layout) or just the word the user used loosely for "a nicer visual treatment"? Ask before assuming.
- **"Map Bild"** — further work on the Map screen's generated background image (built this session,
  commit `da0c7d4`, `§40-43`/A15-adjacent). Unclear from the one-liner whether this means: fixing a
  specific problem with the current image, generating variants (day/season/weather — this overlaps
  issue #19's `A15 Ortsbibliothek` scope), or something else. Ask before assuming.
- **"Settings alles implementieren"** ("implement all of Settings") — the still-placeholder Settings
  tabs. Confirmed still-placeholder as of this session: "Appearance"/"Story"/"Privacy" all route to the
  same generic placeholder (noted in issue #26's original audit, not yet closed by either batch this
  session). This significantly overlaps the roadmap's existing Batch 3 ("Settings/BYOK depth": B17
  Provider Detail Page, B20 session-only key, B33 fallback order, B46 token dashboard) — when
  brainstorming this, decide together whether "alles" means finishing Batch 3 as already scoped, or a
  broader pass that also gives Appearance/Story/Privacy real content (and if so, what that content even
  is — the specs don't fully define these three tabs either, that's likely its own design question).

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
6. **Issue #26 Quick Wins batch** — 4 small items closed via a brainstorming → spec → plan →
   subagent-driven-development pass (spec: `docs/superpowers/specs/2026-08-16-issue-26-quick-wins-design.md`,
   plan: `docs/superpowers/plans/2026-08-16-issue-26-quick-wins.md`, all committed directly to `main`
   per this project's established convention, no branch/worktree):
   - NPC appearance fields on the Characters screen (mirrors the 6 fields Player Profile already had:
     voice/posture/typicalExpression/hands/grooming/generalPresence).
   - `§75` Memory Inspector (GM Dashboard): added a "Created" column (`worldDate`) and resolved entity
     IDs to character names in "Involves", instead of raw IDs.
   - `§26` Focus Mode: new session-only `FocusModeService`, toggle in Story screen's header, hides both
     nav rails (desktop + mobile) and Story's own header chrome. Final whole-batch review caught a real
     bug the per-task review couldn't see (focus mode had no in-app exit once you navigated away from
     Story, since the only toggle lived in Story's header) — fixed by auto-resetting focus mode on any
     navigation away from the Story route (`FocusModeService` now watches `Router` `NavigationEnd`).
   - `B50` Manual Narrator switch: pre-submit "Narrator" dropdown in Story Mode lets the player pick
     which connected AI provider narrates the next turn. Backend gained a small pure `orderProviders()`
     function (`apps/api/src/providers/provider-order.ts`, unit-tested, following the existing
     `response-text.ts` pattern of extracting testable pure logic) that re-roots the A32 automatic-
     fallback chain at the player's choice without weakening the fallback safety net.
   - Process note: this batch used `superpowers:subagent-driven-development` (fresh implementer +
     reviewer subagent per task, ledger-tracked, one whole-batch final review at the end) for the first
     time on this project — worked well, caught 2 real Important findings (the select-binding race in
     Task 4, the Focus Mode navigation dead-end) that individual task reviews or a single-pass
     implementation likely would have missed. Worth reusing for future batches like this.

7. **Roadmap Batch 1: Continuity Guard + Continuity model profile (closes issue #25)** — spec:
   `docs/superpowers/specs/2026-08-16-continuity-guard-model-profiles-design.md`, plan:
   `docs/superpowers/plans/2026-08-16-continuity-guard-model-profiles.md`, same
   subagent-driven-development process as the Quick Wins batch, 6 tasks, commits `8f3f387..54f7cd4`.
   - New `model_profiles` table (migration `0015`) storing a single configurable provider+model pointer
     for the Continuity check — deliberately just the "Continuity" slot from §160 Model Profiles'
     Narrative/Fast/Continuity example, not a full profile system (no consumer for Narrative/Fast yet —
     YAGNI, revisit when something needs them).
   - `GET/PUT /api/ai/providers/continuity-model` routes + `getContinuityModel()` helper
     (`apps/api/src/routes/ai-providers.ts`).
   - `apps/api/src/services/continuity-guard.ts`: `isImportantScene()` (pure heuristic, unit-tested —
     true when a turn's proposed patch touches canon events, new characters/locations, secrets/scandals,
     or a memory rated notable-or-higher; deliberately does NOT diff relationship-dimension swings) and
     `checkContinuity()` (a second, lean AI call — only the entities the patch itself touches, not the
     full context-builder.ts package — asking "does this contradict anything?").
   - Wired into `POST /:id/turn/generate` only (never Manual Relay, which has no guaranteed connected
     provider). On a flagged contradiction: exactly one corrective retry of the narrative generation,
     then accept whatever comes back regardless (bounded, mirrors the existing §188 repair-retry shape).
     No profile configured (the default) → complete no-op, zero behavior change.
   - Settings gained a small "Kontinuitäts-Check (§106)" picker (provider + model, defaults to "Aus").
     Story Mode's existing "erzählt von X" indicator gains a conditional suffix when a retry actually
     fired.
   - **3 of the 6 tasks needed a fix round** (all fixed and re-reviewed clean, i.e. this list is the
     *shipped* state, not a list of known bugs):
     - Task 2: `PUT /continuity-model` couldn't tell a malformed/empty body from an explicit
       `{provider: null}` clear-request — both silently wiped the setting with `200`. Fixed to require
       the `provider` key be genuinely present in a parsed body; `400` otherwise.
     - **Task 4 (Critical): `getDecryptedCredential` was called outside the guard's try/catch.** Since
       AES-GCM decrypt can genuinely throw (corrupted ciphertext, incompatible `CREDENTIAL_MASTER_KEY`),
       an uncaught exception there would have failed an *already-successful* turn — a direct violation
       of the batch's core "never turn a working turn into a failed one" constraint. Worse: the first
       review pass mis-judged this as "unreachable until Task 5's UI ships" — actually reachable the
       whole time via the already-merged Task 2 `PUT` endpoint (curl/devtools, no UI needed). Fixed by
       moving the decrypt call inside the try block. This is the kind of bug the per-task review process
       exists to catch before it reaches production, not after.
     - Task 5: the Continuity provider `<select>`'s options (`providers()`) and its selected value
       (`continuityProvider()`) came from two independent, differently-timed API calls — if the value
       arrived before the matching `<option>` existed in the DOM, the write silently failed and never
       re-synced (no signal delta to react to). After a reload, a correctly-configured setting could
       display as "Aus". Fixed with a `computed()` that only reports the provider selected if it's
       actually present in the loaded connected-providers list.
   - **Not yet done: the final whole-batch review.** See "Immediate next steps" below — this is the very
     next action, before this plan's workspace can be deleted or `finishing-a-development-branch` runs.
   - Not covered by this batch (deliberately, see the design spec): Manual Relay has no Continuity Guard
     coverage; no relationship-dimension-swing detection in the heuristic; no "Narrative"/"Fast" model
     profiles.

## Resolved this session (was "in progress")

**CI regression from this session's earlier commit — root-caused and fixed, confirmed green.**

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

Committed as `301d901`, pushed, confirmed `API Checks` green on GitHub Actions before moving on.

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
- **#26 — Long-tail spec gaps (grouped, small items).** Quick Wins sub-batch shipped this session (see
  "Done this session" above): NPC appearance fields, `§75` Memory Inspector columns, `§26` Focus Mode,
  `B50` Manual Narrator dropdown. Still missing: `§20` Action Mode chips, `§22-23` scene/time transition
  cards, `§54` Dance Card, `§160` Model Profiles, `§189` Story Quality Controls, `B17` Provider Detail
  Page, `B20` session-only key, `B33` configurable fallback order, `B46` token-usage dashboard, `A38`
  Full Archive backup (adds `/assets/` to Compact Save). Still partial: `§29` Character Sheet non-GM
  view whereabouts (already partly addressed — check current state before assuming the gap is
  unchanged, the Quick Wins pass touched adjacent code). Still unused data: `Scene.expression`/
  `imageCue`, `CharacterVisualState.availableExpressions`, and `Character.appearance` fields beyond the
  6 now shown on both Player Profile and the Characters (NPC) screen. Triage individually when picked up.
  Two minor items deferred during the Quick Wins review (not bugs, just noted for whoever touches this
  code next): `story-screen.scss`'s Focus-toggle position CSS (`&:first-child { margin-left: auto; }`)
  is correct today but coupled to the header's exact DOM shape; `story-screen.html` has two
  near-identical `@if (!focusMode.active())` blocks that need disambiguating by surrounding content, not
  the bare condition text, if either is edited again.
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

## Execution roadmap (optimal order, decided 2026-08-16)

Sequencing logic: quick+independent wins first (momentum, low risk) → feature batches grouped by
*screen* (matches this project's own history — Letters/Map/Model-Selector/Tone-Prefs bundled together
in one earlier pass, same for Recap/Bookmarks/Quotes/Notes — less context-switching per pass) →
the one architecturally significant item (`#27` Module System) placed *before* the item that
conceptually depends on it (`§189` Story Quality Controls plausibly needs to hook into whichever
module/instruction-selection scaffolding `#27` builds) → the two broad cross-cutting passes (Mobile,
Visual Polish) placed *last* so each only has to happen once, over the final UI surface, instead of
being partially redone after every batch that adds new screens/elements.

Each batch below should get its own brainstorm → spec → plan → subagent-driven-development cycle (same
process as the Quick Wins batch), not one giant plan — that pattern worked well and caught real bugs a
single-pass implementation likely would have missed.

1. ~~**Continuity Guard + Model Profiles**~~ — **done this session** (see "Done this session" item 7),
   pending only the final whole-batch review (see "Immediate next steps" at the top of this file).
2. **Story Mode interaction UX** — `§20` Action Mode chips + `§22-23` scene/time transition cards. Same
   screen as Focus Mode (just shipped), same file family (`story-screen.*`) — bundle to minimize
   re-orientation cost.
3. **Settings/BYOK depth** — `B17` Provider Detail Page + `B20` session-only key + `B33` configurable
   fallback order + `B46` token-usage dashboard. Same screen (Settings), same underlying BYOK
   infrastructure (`ai-providers.ts`, `ai-providers-api.service.ts`) touched by all four.
3.5. **Society + Save/Backup features** — `§54` Dance Card (Society screen) + `A38` Full Archive backup
   (adds `/assets/` to Compact Save) + `§124` Timeline Identity (Save Selection — natural fit alongside
   the backup work since both touch save/timeline surfacing). Independent of 1-3 and of the
   architecture batch below; can freely swap order with 2/3 if something there turns out blocked.
4. **`#27` Module System / selective context loading + memory summarization (§108-110).** The big one —
   needs its own design pass (per the issue's own framing), touches `context-builder.ts` at its core.
   Deliberately placed after the smaller batches (1-3.5) are done and the codebase is quiet, and before
   Story Quality Controls (next) so that feature can build on whatever module-selection shape this
   produces rather than needing rework.
5. **`§189` Story Quality Controls** — "More Dialogue/More Atmosphere/Faster Pace/Less Description"
   toggles that feed into prompt construction. Sequenced right after `#27` since it's the one remaining
   item that plausibly needs to hook into the module system rather than the raw always-everything prompt.
6. **`#20` Mobile optimization pass.** Broad, cross-cutting, unverified how bad the current state
   actually is. Deliberately last among the feature work so it only needs to happen once, covering every
   screen/element added in batches 1-5, instead of needing a partial re-pass after each.
7. **`#19` Location art + visual polish (rest of Phase 7)** + `§167` Location Reference Lock (bundled in,
   per the existing note that it's the location-entity analogue of the already-built Character Reference
   Lock). Mostly art-direction/asset-generation work, largely independent of the rest — could in
   principle run in parallel with any other batch, but sequenced last here since it's the most
   "polish, not mechanics" item and benefits from the app's final UI shape being settled first.

**Opportunistic, not scheduled into a batch** — revisit when the external blocker clears, don't force a
session around these: retest Character Reference Lock's img2img call when Cloudflare's shared capacity
isn't exhausted (`3040: Capacity temporarily exceeded` throughout every attempt so far); test the
OpenAI/Anthropic provider adapters end-to-end if a real API key for either ever becomes available.

Phase 8 (Multi-World — additional world packs beyond Bridgerton) stays out of this roadmap entirely,
deferred by explicit prior request until Bridgerton's own starting setup gets revisited together first.

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
- This project has no branch/PR workflow — every session commits and pushes directly to `main`, which
  auto-deploys (Pages on every push; the Worker/D1 migrations stay a manual `npm run deploy` step). If a
  future session uses `superpowers:subagent-driven-development` (which defaults to an isolated
  worktree/branch), that default conflicts with this project's convention — ask the user explicitly
  which they want, same as this session did, rather than assuming either way.
