# Issue #26 Quick Wins — Design

Status: approved, not yet implemented.
Scope: the "Quick Wins" subset of issue #26 (Long-tail spec gaps), chosen because each item is
frontend-only or a trivial backend addition with no new data model — completable and verifiable in
one pass, same shape as the #21-24 batch. The rest of #26 (Dance Card, Focus-adjacent Story UX items
beyond what's listed here, Settings/BYOK depth, etc.) is explicitly out of scope for this pass.

Four independent items, each small enough to not need its own spec:

## 1. NPC appearance fields (Characters screen)

**Problem:** `Character.appearance` has 13 fields; the Characters screen's character-sheet modal only
shows 7 (`height`, `build`, `face`, `hair`, `eyes`, `clothing`, `distinguishingFeatures`). Player
Profile already shows 6 more (`voice`, `posture`, `typicalExpression`, `hands`, `grooming`,
`generalPresence`) as of the #21-24 pass — that fix was applied to Player Profile only, not to the
Characters (NPC) screen, despite that pass's commit message claiming otherwise. `clothing` is
intentionally excluded from the "missing" list since the wardrobe section already covers it.

**Fix:** `apps/web/src/app/features/characters/characters-screen/characters-screen.html` — add the same
6 `<dt>/<dd>` pairs to the existing `.character-sheet__appearance` `<dl>`, in the same order and with
the same German labels Player Profile already uses. No TS or model changes; the data is already on
every `Character` object the template has access to.

## 2. §75 Memory Inspector — missing columns

**Problem:** The spec's "Memory Inspector" (an optional technical/debug view) already exists as the GM
Dashboard's "Memory Inspector" table (`gm-dashboard-screen.html`/`.ts`, GM-mode-gated) — it just doesn't
match the spec's exact column set. Spec wants: Memory, Importance, `Referenced by: X, Y`, `Created: ...`.
Current table has: Fact, Importance, Status, Reach, Fading, Involves (raw entity IDs).

**Fix, same two files:**
- Add a `Created` column bound to `memory.worldDate` — the only date field `Memory` carries, and the
  one every other screen already treats as "when this happened."
- Resolve `Involves` (the `entityIds` column, which already functions as "Referenced by") from raw
  entity IDs to character names via the existing state store lookup (`store.current().characters[id]?.name
  ?? id`, same fallback pattern used elsewhere for this, e.g. `speakerName()` in the Story screen).
- Keep the existing Status/Reach/Fading columns — spec doesn't say to remove them, they're useful debug
  info already there, no reason to regress.

## 3. §26 Focus Mode

**Problem:** No way to hide UI chrome during Story Mode. Spec: "Focus Story Mode" hides nearly all UI;
only Scene, Character, Dialogue, and Input stay visible.

**Design:**
- New `apps/web/src/app/core/ui/focus-mode.service.ts` — a plain injectable with a `signal<boolean>`
  and a `toggle()` method. Session-only (no persistence, resets on reload), mirroring the existing
  `GmModeService` pattern (`core/gm/`) rather than introducing a new persistence mechanism.
- `AppShell` (`features/shell/app-shell/`) injects it and adds a class (e.g. `shell--focus`) to the root
  `.shell` element when active; SCSS hides both `.shell__rail--desktop` and `.shell__rail--mobile` under
  that class.
- Story screen (`features/story/story-screen/`) injects it too: a small toggle button next to the
  existing Undo button (`story-header`), and hides its own header meta line (date/location/weather/undo
  button/narrator indicator) when focus mode is active — but the toggle button itself stays visible
  (rendered outside the hidden block, or the hidden block excludes just the toggle) so the player can
  always exit.
- Focus Mode only affects the shell nav + Story's own header chrome — it's scoped to what's visible
  *while in Story Mode*, per spec intent ("perfekt für längere Sessions" implies staying on the Story
  screen). Navigating away isn't blocked; if the player leaves Story while focus mode is on, the shell
  nav simply reappears because Story's screen-level hiding no longer applies (only the shell-level hide
  persists) — acceptable since the point is an immersive Story session, not a global chrome lock, and
  matches how `GmModeService` similarly has no cross-screen "lock" semantics either.

## 4. B50 Manual Narrator switch

**Problem:** Story screen shows a passive, post-hoc "erzählt von {{ provider }}" label after a turn
generates. Spec wants a small, non-prominent pre-submit "Narrator: Gemini ▾" menu so the player can pick
*which* connected provider narrates the next turn, without it needing to be prominent (story immersion
has priority per spec).

**Design:**
- Frontend: `story-screen.ts` already fetches the connected-provider list in its constructor
  (`providersApi.list()`) to compute `connectedProvider`. Extend that subscription to also keep the
  full list of connected provider IDs (`connectedProviders = signal<string[]>([])`), and add a
  `selectedProvider = signal<string | null>(null)` defaulting to the existing auto-picked
  `connectedProvider()` value once it loads. Template: a `<select>` next to the provider indicator in
  `story-header`, only rendered when `connectedProviders().length > 0`, bound to `selectedProvider`.
- `DirectTurnApiService.generate()` gains an optional second parameter, `preferredProvider?: string`,
  included in the POST body when set.
- `story-screen.ts`'s `generateDirect()` passes `this.selectedProvider()` through.
- Backend (`apps/api/src/routes/turns.ts`, `POST /:id/turn/generate`): read an optional
  `preferredProvider` from the body. If present and it's one of `PROVIDER_IDS`, reorder the iteration
  list to try it first, then fall through to the remaining providers in their normal order on failure —
  same A32 automatic-fallback safety net as today, just re-rooted at the player's choice instead of
  always starting from the hardcoded priority order. If absent, behavior is unchanged (today's
  `PROVIDER_IDS` order).
- Not persisted anywhere (no DB column, no localStorage) — resets to auto-selection every session/reload,
  consistent with spec calling this a lightweight per-turn menu rather than a setting. This also means
  no migration is needed for this item.

## Testing

- Frontend: no existing unit test suite runs against these components (Angular app has no unit tests
  wired into CI per the repo's current state — verification for this batch is manual/live, matching how
  every other UI feature in this project has been verified this session and prior sessions).
- Backend: `apps/api` has vitest coverage for turn generation — add a case in the existing turns test
  file asserting that a `preferredProvider` in the request body is tried before the default
  `PROVIDER_IDS` order (mock two connected providers, assert the preferred one's adapter is called
  first).
- Manual verification plan for all four, live in the browser: NPC appearance fields visible on an NPC's
  character sheet; GM Dashboard Memory Inspector shows Created + resolved names; Focus Mode toggle hides
  nav + header and can be toggled back off; Narrator dropdown appears when a provider is connected,
  selecting a non-default one and submitting an action actually narrates via that provider (check the
  post-turn `lastUsedProvider` label matches the selection).
