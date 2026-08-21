# Story Mode Interaction UX — Plan A Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add four static Action-Mode chips (§20) and location/time transition
cards (§22/§23) to the Story screen — pure frontend, no backend changes.

**Architecture:** A pure, unit-tested function (`detectSceneTransition`) decides
whether a newly committed `Scene` differs from the previously committed one
enough to show a location banner or a time-skip chapter card. `StoryScreen`
tracks the last committed scene, calls the detector at both scene-commit call
sites, and drives a signal-backed, auto-dismissing overlay. Action chips are a
static constant array rendered as buttons that fill the (empty) player-input
textarea and focus it.

**Tech Stack:** Angular 20 (standalone components, signals, signal-based
`viewChild`), Karma + Jasmine (existing `ng test` harness, currently exercised
only by the default scaffold spec — this plan adds the first real spec file).

## Global Constraints

- Pure frontend only — no backend route, model, or prompt changes.
- A chip only fills `playerInput` when the field is empty, defined exactly as
  `playerInput().trim() === ''`. If non-empty, the click is a no-op.
- The trailing space in `"Ich antworte: "` is intentional (invites the player
  to keep typing) and must not be trimmed away anywhere in the fill path.
- `lastCommittedScene` starts as `null`, **never** as the hardcoded starting
  scene in `story-screen.ts:125-134` (`locationId: 'loc_player_farm'`,
  `worldDate: '12. April 1813'`). The first real committed scene of a session
  must never trigger a transition card.
- Both scene-commit call sites must run the "capture previous, then set"
  sequence: `generateDirect()`'s success handler (~`story-screen.ts:167-174`)
  and `submitResponse()`'s success handler (~`story-screen.ts:223-229`).
  `undoLastTurn()` does not commit a new scene and is not touched.
- If both `locationId` and `worldDate` changed in the same committed scene,
  show only the location banner (it already carries the date) — never both
  cards at once.
- No date parsing anywhere — `worldDate` comparison is exact string
  inequality only.
- The transition banner must render **outside** both of `story-screen.html`'s
  `@if (!focusMode.active())` blocks (header content at line 3, and the
  undo-message/provider-indicator block at line 36) — these two blocks look
  identical at a glance and are only told apart by their surrounding content;
  do not nest the banner inside either. The banner must be visible in Focus
  Mode, since it's diegetic scene content, not chrome.
- Banner timing: fade in, hold, fade out, over ~2.5s total, then removed from
  the DOM. Purely decorative — `pointer-events: none`, never blocks input.

---

### Task 1: Scene transition detection (pure function + unit tests)

**Files:**
- Create: `apps/web/src/app/features/story/story-screen/scene-transition.ts`
- Test: `apps/web/src/app/features/story/story-screen/scene-transition.spec.ts`

**Interfaces:**
- Produces: `export interface SceneTransition { kind: 'location' | 'time'; text: string }`
  and `export function detectSceneTransition(previous: Scene | null, next: Scene, nextLocationName: string): SceneTransition | null`.
  Task 2 imports both from this file.

- [ ] **Step 1: Write the failing tests**

Create `apps/web/src/app/features/story/story-screen/scene-transition.spec.ts`:

```typescript
import { detectSceneTransition } from './scene-transition';
import { Scene } from '../../../core/state/models/scene.model';

function makeScene(overrides: Partial<Scene> = {}): Scene {
  return {
    locationId: 'loc_player_farm',
    worldDate: '12. April 1813',
    time: 'Morgen',
    weather: 'klar',
    narration: [],
    dialogue: [],
    ...overrides,
  };
}

describe('detectSceneTransition', () => {
  it('returns null when there is no previous scene', () => {
    expect(detectSceneTransition(null, makeScene(), 'Farm')).toBeNull();
  });

  it('returns null when neither locationId nor worldDate changed', () => {
    const scene = makeScene();
    expect(detectSceneTransition(scene, makeScene(), 'Farm')).toBeNull();
  });

  it('returns a location transition when locationId changed', () => {
    const previous = makeScene();
    const next = makeScene({ locationId: 'loc_london_grosvenor', worldDate: '18. April 1813' });
    const result = detectSceneTransition(previous, next, 'Grosvenor Square');
    expect(result).toEqual({ kind: 'location', text: 'Grosvenor Square / 18. April 1813' });
  });

  it('returns a time transition when only worldDate changed', () => {
    const previous = makeScene();
    const next = makeScene({ worldDate: 'Mai 1813' });
    const result = detectSceneTransition(previous, next, 'Farm');
    expect(result).toEqual({ kind: 'time', text: 'Mai 1813' });
  });

  it('prefers the location transition when both locationId and worldDate changed', () => {
    const previous = makeScene();
    const next = makeScene({ locationId: 'loc_london_grosvenor', worldDate: 'Mai 1813' });
    const result = detectSceneTransition(previous, next, 'Grosvenor Square');
    expect(result).toEqual({ kind: 'location', text: 'Grosvenor Square / Mai 1813' });
  });

  it('does not trim or alter worldDate text', () => {
    const previous = makeScene();
    const next = makeScene({ worldDate: ' Mai 1813 ' });
    const result = detectSceneTransition(previous, next, 'Farm');
    expect(result?.text).toBe(' Mai 1813 ');
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `cd apps/web && npx ng test --watch=false --browsers=ChromeHeadless --include=**/scene-transition.spec.ts`
Expected: FAIL — `scene-transition.ts` does not exist yet (module not found).

- [ ] **Step 3: Write the implementation**

Create `apps/web/src/app/features/story/story-screen/scene-transition.ts`:

```typescript
import { Scene } from '../../../core/state/models/scene.model';

export interface SceneTransition {
  kind: 'location' | 'time';
  text: string;
}

/**
 * §22/§23 — decides whether the just-committed scene differs enough from the
 * previous one to show a location banner or a time-skip chapter card.
 * `previous === null` (no prior committed scene this session) never triggers,
 * so the hardcoded starting scene is never diffed against a real first turn.
 */
export function detectSceneTransition(
  previous: Scene | null,
  next: Scene,
  nextLocationName: string,
): SceneTransition | null {
  if (previous === null) return null;

  if (previous.locationId !== next.locationId) {
    return { kind: 'location', text: `${nextLocationName} / ${next.worldDate}` };
  }

  if (previous.worldDate !== next.worldDate) {
    return { kind: 'time', text: next.worldDate };
  }

  return null;
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `cd apps/web && npx ng test --watch=false --browsers=ChromeHeadless --include=**/scene-transition.spec.ts`
Expected: PASS, 6 specs, 0 failures.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/app/features/story/story-screen/scene-transition.ts apps/web/src/app/features/story/story-screen/scene-transition.spec.ts
git commit -m "feat: add pure scene transition detection for §22/§23"
```

---

### Task 2: Wire transition detection into StoryScreen + render the banner

**Files:**
- Modify: `apps/web/src/app/features/story/story-screen/story-screen.ts`
- Modify: `apps/web/src/app/features/story/story-screen/story-screen.html`
- Modify: `apps/web/src/app/features/story/story-screen/story-screen.scss`

**Interfaces:**
- Consumes: `detectSceneTransition`, `SceneTransition` from
  `./scene-transition` (Task 1).
- Produces: `protected readonly transitionBanner: Signal<SceneTransition | null>`
  on `StoryScreen`, read by the template added in this task.

- [ ] **Step 1: Add the import and the transition state to `story-screen.ts`**

Add to the import block at the top of `story-screen.ts`:

```typescript
import { detectSceneTransition, SceneTransition } from './scene-transition';
```

Add these members near the other scene-related signals (after the `scene`
signal definition, i.e. after line 134's closing `});`):

```typescript
  protected readonly transitionBanner = signal<SceneTransition | null>(null);
  private lastCommittedScene: Scene | null = null;
  private transitionTimeout: ReturnType<typeof setTimeout> | null = null;

  /**
   * Both scene-commit paths (generateDirect, submitResponse) must funnel
   * through here — the previous scene has to be captured before it's
   * overwritten, or the transition check always compares a scene to itself.
   */
  private applyCommittedScene(scene: Scene): void {
    const previous = this.lastCommittedScene;
    const transition = detectSceneTransition(previous, scene, this.locationName(scene.locationId));
    this.lastCommittedScene = scene;
    this.scene.set(scene);

    if (transition) {
      if (this.transitionTimeout) clearTimeout(this.transitionTimeout);
      this.transitionBanner.set(transition);
      this.transitionTimeout = setTimeout(() => this.transitionBanner.set(null), 2600);
    }
  }
```

- [ ] **Step 2: Route both scene-commit sites through `applyCommittedScene`**

In `generateDirect()`'s `next` handler, the current body is:

```typescript
      next: ({ state, scene, provider, continuityRetried }) => {
        this.store.refresh(state);
        this.scene.set(scene);
        this.playerInput.set('');
```

Change the `this.scene.set(scene);` line to `this.applyCommittedScene(scene);`
(order relative to `store.refresh(state)` stays the same — refresh must
happen first so `locationName()` can resolve a newly-discovered location).

In `submitResponse()`'s `next` handler, the current body is:

```typescript
      next: ({ state, scene }) => {
        this.store.refresh(state);
        this.scene.set(scene);
        this.playerInput.set('');
```

Apply the same change: `this.scene.set(scene);` → `this.applyCommittedScene(scene);`.

- [ ] **Step 3: Add the banner to the template**

In `story-screen.html`, inside `<section class="story-stage">` (currently
lines 64-80), add the banner as a sibling of the existing background and
character divs, e.g. right before the closing `</section>`:

```html
    @if (transitionBanner(); as banner) {
      <div class="scene-transition-banner" [class.scene-transition-banner--time]="banner.kind === 'time'">
        {{ banner.text }}
      </div>
    }
```

This is deliberately **outside** the two `@if (!focusMode.active())` blocks
at the top of the file (around line 3 and line 36) — those gate header chrome
and undo/provider messages, not scene content, and the banner must stay
visible when Focus Mode is active.

- [ ] **Step 4: Add the banner styles**

In `story-screen.scss`, add after the `.story-stage` block (after its closing
`}`, which follows the `__background` and speaker-portrait rules):

```scss
.scene-transition-banner {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  text-align: center;
  pointer-events: none;
  font-family: var(--qv-font-display);
  font-style: italic;
  font-size: 1.4rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--qv-champagne);
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.6);
  background: rgba(20, 12, 8, 0.35);
  animation: scene-transition-fade 2.5s ease-in-out forwards;

  &--time {
    text-transform: none;
    font-size: 1.6rem;
  }
}

@keyframes scene-transition-fade {
  0% {
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
```

- [ ] **Step 5: Build and manually verify**

Run: `cd apps/web && npx ng build` — must succeed with no errors.

Manual check (dev server, `npx ng serve`, against a local or the deployed API
per this repo's existing `api.config.ts` setup): trigger a turn that changes
`locationId` and confirm the location banner appears and fades within ~2.5s;
trigger a turn that changes only `worldDate` and confirm the time card
appears instead; trigger a turn with no location/date change and confirm no
card appears; toggle Focus Mode on and confirm the banner still renders when
a transition fires. There is no existing component-level test harness for
`StoryScreen` in this codebase (only the pure function from Task 1 has unit
tests) — this step is manual-verification-only, not a gap to fill with a new
test scaffold.

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/app/features/story/story-screen/story-screen.ts apps/web/src/app/features/story/story-screen/story-screen.html apps/web/src/app/features/story/story-screen/story-screen.scss
git commit -m "feat: wire §22/§23 scene transition banner into StoryScreen"
```

---

### Task 3: Static Action-Mode chips (§20)

**Files:**
- Modify: `apps/web/src/app/features/story/story-screen/story-screen.ts`
- Modify: `apps/web/src/app/features/story/story-screen/story-screen.html`
- Modify: `apps/web/src/app/features/story/story-screen/story-screen.scss`

**Interfaces:**
- Produces: `protected readonly actionChips: ActionChip[]` and
  `protected fillChip(fillText: string): void` on `StoryScreen`, consumed only
  by the template added in this task.

- [ ] **Step 1: Add the chip data and fill logic to `story-screen.ts`**

Add `ElementRef` and `viewChild` to the `@angular/core` import at the top of
the file (the existing import is
`import { Component, computed, inject, signal } from '@angular/core';`):

```typescript
import { Component, computed, inject, signal, viewChild, ElementRef } from '@angular/core';
```

Add this module-level constant near `PROVIDER_LINKS` (after its closing
`];`):

```typescript
interface ActionChip {
  label: string;
  fillText: string;
}

const ACTION_CHIPS: ActionChip[] = [
  { label: 'Antworten', fillText: 'Ich antworte: ' },
  { label: 'Schweigen', fillText: 'Ich schweige und beobachte die Situation.' },
  { label: 'Gehen', fillText: 'Ich gehe.' },
  { label: 'Beobachten', fillText: 'Ich sehe mich aufmerksam um.' },
];
```

Inside the `StoryScreen` class, add near the `playerInput` signal
(after its declaration, `protected readonly playerInput = signal('');`):

```typescript
  protected readonly actionChips = ACTION_CHIPS;
  private readonly playerActionField = viewChild<ElementRef<HTMLTextAreaElement>>('playerActionField');

  /** §20 — only fills the field when empty; never overwrites text the player already typed. */
  protected fillChip(fillText: string): void {
    if (this.playerInput().trim() !== '') return;
    this.playerInput.set(fillText);
    this.playerActionField()?.nativeElement.focus();
  }
```

- [ ] **Step 2: Add the template reference and the chip row**

In `story-screen.html`, add a template reference variable to the existing
textarea (currently lines 117-123):

```html
    <textarea
      id="player-action"
      #playerActionField
      class="player-input__field"
      rows="2"
      [value]="playerInput()"
      (input)="playerInput.set($any($event.target).value)"
    ></textarea>
```

Immediately after that `</textarea>` and before the submit button, add the
chip row:

```html
    <div class="player-input__chips">
      @for (chip of actionChips; track chip.label) {
        <button type="button" class="player-input__chip" (click)="fillChip(chip.fillText)">{{ chip.label }}</button>
      }
    </div>
```

- [ ] **Step 3: Add the chip styles**

In `story-screen.scss`, inside the existing `.player-input { ... }` block
(starts at line 296), add these two nested rules after the `&__field { ... }`
block and before `&__submit { ... }`:

```scss
  &__chips {
    display: flex;
    flex-wrap: wrap;
    flex-basis: 100%;
    gap: 0.4rem;
  }

  &__chip {
    background: none;
    border: 1px solid var(--qv-gold);
    color: var(--qv-champagne);
    border-radius: 999px;
    padding: 0.25rem 0.75rem;
    font-family: var(--qv-font-ui);
    font-size: 0.75rem;
    cursor: pointer;

    &:hover {
      background: rgba(184, 147, 74, 0.15);
    }
  }
```

- [ ] **Step 4: Build and manually verify**

Run: `cd apps/web && npx ng build` — must succeed with no errors.

Manual check: with the player-input field empty, click each of the four
chips and confirm the field fills with the exact fill text (including the
trailing space after "Ich antworte:") and gains focus; type some text into
the field first, then click a chip, and confirm the field is unchanged (chip
click is a no-op when non-empty).

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/app/features/story/story-screen/story-screen.ts apps/web/src/app/features/story/story-screen/story-screen.html apps/web/src/app/features/story/story-screen/story-screen.scss
git commit -m "feat: add static Action-Mode chips (§20)"
```
