# Master Prompt Slimming (Issue #1, §108-110)

Started: 2026-08-15.

## Problem

`assets/master-prompt.ts` embedded the full 56,274-char
`simulation-master-prompt-v3.md` verbatim, sent whole on every single turn
(both Manual Relay's context-package and the direct-API `/turn/generate`).
Two real test turns earlier this session burned 36.58K of the 250K Gemini
TPM budget between them, almost entirely from this one embedded string —
the binding constraint on every feature that calls a provider.

## What got cut, and why it's safe

Read every candidate section in full before cutting anything — this is a
content-preserving mechanical edit, not a rewrite, and the risk (per
review) was cutting GM-behavior rules that make narration good without any
way to detect the quality loss.

- **§109-112, §114 (SAVE-SYSTEM / SAVE-UPDATE / SAVE-STRUKTUR / META /
  RELATIONSHIP SAVE FORMAT)**: these describe an entirely different,
  superseded save mechanism — a single `BRIDGERTON_SIMULATION_STATE.md`
  markdown file the GM was originally meant to maintain by hand, with a
  160-line per-NPC prose template (§114) for relationships. Our actual
  implementation is a D1 database + the JSON schema `context-builder.ts`
  already appends as `OUTPUT_FORMAT_INSTRUCTIONS`. Keeping both isn't just
  wasted tokens — it's **contradictory instructions** about what shape to
  respond in. Cutting these is a correctness fix, not just an optimization.
  (Kept §113 IMMUTABLE FACTS — small, and the underlying "don't drift core
  facts" principle reads as a real behavioral rule even outside the old
  save-file framing.)
- **§131-134 (ANFANGSINITIALISIERUNG / DEFAULT-HOF / START-ATMOSPHÄRE /
  ERSTES CANON-TREFFEN) and §171-172 (FINALE INITIALISIERUNGSANWEISUNG /
  TAG 1)**: first-session-only instructions — literally "do not begin the
  plot yet, first interview the player about name/age/appearance/farm/...".
  Every game today continues an already-seeded, already-running simulation
  (character creator, issue #12, doesn't exist yet) — these sections are
  100% dead weight on every turn we actually generate. §171 also
  re-references the dead `BRIDGERTON_SIMULATION_STATE.md` format.
  (Kept §170 ERLEBNIS-GRUNDSATZ, right next to the cut range — read in
  full and confirmed it's an ongoing tone principle, not init-only.)
- **Decorative-only mechanical cleanup**: `---` section separators (no
  semantic content) and collapsing the resulting blank-line runs.

Everything else — all GM behavior, tone, world, relationship, economy,
canon-divergence rules — stays byte-for-byte as written.

## Result

56,274 → 49,018 chars, **-12.9%**. Implemented as a filter in
`scripts/embed-master-prompt.mjs` (by section number, dropping full
sections between their headers) rather than hand-editing the generated
file or the source spec doc — `docs/spec/simulation-master-prompt-v3.md`
stays the untouched canonical human reference; regenerating is
`node scripts/embed-master-prompt.mjs`.

## Verification

Type-checked clean. Live-verified with one real turn against the connected
Gemini key (kept to one call deliberately — quota is the whole reason this
issue exists): player action was "help my mother in the garden, talk about
the tight rent." Response stayed fully in-world, atmospheric, and correctly
wove in the financial-worry detail from the prompt (mother pausing to look
at unrepaired roof shingles, "every shilling counted") — no quality
degradation visible against the two baseline narrations from earlier this
session. Cleaned up via Undo Last Turn afterward — one call instead of a
hand-written SQL reset script, now that it exists.

## Not done here (deliberately out of scope)

- Real §108 MODULE SYSTEM (selective/conditional inclusion of rule
  sections per turn) — genuinely different, higher-risk work; today's cut
  was restricted to content that's unconditionally dead or contradictory,
  never "probably not needed most turns."
- Gemini context caching — would be the next real lever (send the static
  prompt once, reference it after), but needs verifying against current
  API docs and its interaction with free-tier TPM before building around
  it; not attempted this pass to avoid guessing at an unverified capability.
