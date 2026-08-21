# Story Mode Interaction UX — Plan A (Static Action Chips + Scene/Time Transition Cards)

## Scope note

§20 (Action Mode chips) as originally discussed has two independent halves: static
chips (pure frontend) and an optional AI-generated suggestion mode (new backend
route, prompt builder, provider gating — roughly the size of the Prompt-verbessern
batch). Building all of that plus §22/§23 in one plan would bundle three
subsystems into one review cycle. This spec covers **Plan A only**: static chips
and the §22/§23 transition cards, both pure frontend, no backend changes. The
AI-generated chip mode is **Plan B**, a separate brainstorm → spec → plan → SDD
cycle, deliberately deferred and not started here. No "coming soon" toggle stub
ships in Plan A — the toggle UI itself is built in Plan B.

## Goal

Give the player quick, optional action shortcuts (§20) and a lightweight,
diegetic visual cue when the scene's location or in-world date changes (§22/§23),
without ever forcing a choice — free text remains always possible, and cards
never block interaction.

## 1. Static Action-Mode Chips (§20)

**Content** — four static chips rendered below the player-input textarea in
`story-screen.html`, sourced from a new constant (e.g. `ACTION_CHIPS` in
`story-screen.ts`):

| Label | Fill text |
|---|---|
| Antworten | `Ich antworte: ` |
| Schweigen | `Ich schweige und beobachte die Situation.` |
| Gehen | `Ich gehe.` |
| Beobachten | `Ich sehe mich aufmerksam um.` |

"Antworten" ends with a colon and trailing space rather than a full sentence,
inviting the player to keep typing rather than submitting a bare word.

**Behavior:**
- Clicking a chip fills `playerInput` **only if the field is currently empty**.
  If the player has already typed something, the click is a no-op — never
  silently discards typed text.
- After filling, focus moves to the textarea so the player can immediately
  continue typing or submit.
- Chips are always visible (no mode switch in Plan A); §20's "diese sind nur
  Vorschläge, Freitext bleibt jederzeit möglich" is satisfied by the
  empty-field-only fill rule plus the textarea remaining freely editable.
- Pure frontend addition to `story-screen.ts`/`.html`/`.scss`. No backend call,
  no new service, no new signal beyond the chip list itself.

## 2. Scene/Time Transition Cards (§22/§23)

**Detection state:** a new private field on `StoryScreen`, e.g.
`private lastCommittedScene: Scene | null = null;`, initialized to `null` —
**not** to the hardcoded placeholder scene the component currently starts with
(`story-screen.ts:125-134`, `locationId: 'loc_player_farm'`,
`worldDate: '12. April 1813'`). Both scene-committing call sites —
`generateDirect()` (`story-screen.ts:~166`) and `submitResponse()`
(`story-screen.ts:~222`) — currently call `this.scene.set(scene)` directly with
no diffing. Both must, immediately before that `set()` call, capture
`const previous = this.lastCommittedScene;`, compute the transition (below)
against `previous`, then set `this.lastCommittedScene = scene` after.
`undoLastTurn()` does not commit a new scene and is untouched.

Because `lastCommittedScene` starts `null`, the very first real turn in a
session never fires a transition card — there is nothing genuine to diff
against yet. This is deliberate: it prevents a false "you traveled to the
farm" banner comparing a real first location against the hardcoded starting
placeholder.

**Trigger logic**, evaluated only when `previous !== null`:

1. `previous.locationId !== scene.locationId` → show the **location banner**:
   location name + `worldDate` together, e.g.
   `"LONDON / Grosvenor Square / 18. April 1813"` (§22's own example format).
2. Else if `previous.worldDate !== scene.worldDate` (exact string
   inequality, no date parsing) → show the **time-skip chapter card** (§23):
   just the new `worldDate`, e.g. `"Mai 1813"`.
3. Else → no card.

If both location and date changed in the same turn, only the location banner
shows (case 1 takes priority) — it already carries the date, so a second card
would be redundant.

**Why exact string inequality is safe here:** `validate-turn-response.ts` only
checks `typeof worldDate === 'string'`, so the AI's date format isn't
structurally guaranteed. Checked against real production data (`turns` table,
`sim_default`, the only played simulation with turn history): across 3
consecutive turns on the same in-world day, `world_time_before`/`_after` were
byte-identical (`"12. April 1813"` all three times) — same-day turns reliably
produce a stable string, so this heuristic won't fire spuriously within a day.
There isn't yet production data spanning an actual multi-day skip to confirm
format stability across one, but the feature is purely cosmetic: worst case
on a format drift is a slightly oddly-formatted but still readable date on
the card, not a functional bug. No date parsing is attempted.

**Rendering:**
- New template block, distinctly named (e.g. `scene-transition-banner`) to
  avoid any confusion with the existing, unrelated `chapters` DB table
  (journal/savepoint chapters — a different feature).
- Rendered as an overlay on `story-stage` (the scene visual area), not in the
  header — it's diegetic scene content.
- Visible in Focus Mode (§26) as well as normal mode, since it's part of the
  scene, not chrome. `story-screen.html` currently has two separate
  `@if (!focusMode.active())` blocks (header content around line 3, and the
  undo-message/provider-indicator block around line 36) that look identical
  at a glance and are only disambiguated by their surrounding content — the
  transition banner must NOT be nested inside either of those blocks.
- Timing: fade in, hold ~2.5s, fade out, then removed — implemented as a
  signal (e.g. `transitionBanner = signal<{ kind: 'location' | 'time'; text: string } | null>(null)`)
  set when a transition is detected and cleared via `setTimeout(...)`.
  Non-blocking — the player can act immediately, the card is purely
  decorative and never gates input.

## Out of scope for Plan A

- AI-generated action suggestions and the mode toggle (Plan B).
- Any change to `worldDate` format, the `chapters` table, or backend turn
  generation.
- Parsing or structuring `worldDate` beyond string equality.

## Testing

- Unit tests for the transition-detection logic (location-only change,
  date-only change, both changed, neither changed, first turn after load
  produces no card) using the existing Angular testing setup for this
  component.
- Manual verification in the browser: click each chip on an empty field
  (fills + focuses), click a chip with existing text (no-op), trigger a
  location change and a date-only change via Manual Relay or a connected
  provider and confirm the correct card appears, confirm cards render in
  Focus Mode.
