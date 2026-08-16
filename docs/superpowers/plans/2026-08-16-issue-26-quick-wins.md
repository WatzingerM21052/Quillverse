# Issue #26 Quick Wins Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close four small, independent gaps flagged by the docs-vs-implementation audit in GitHub issue #26: missing NPC appearance fields, an incomplete Memory Inspector, no Focus Mode, and no pre-submit Narrator selection.

**Architecture:** Four self-contained changes, each touching 1-3 files, no shared dependencies between them. Tasks 1-2 are template-only mirrors of existing patterns. Task 3 adds one new signal-based Angular service plus wiring into two existing components. Task 4 extracts one small pure function on the backend (unit-tested, TDD) and threads an optional field through the existing frontend→backend turn-generation call.

**Tech Stack:** Angular (standalone components, signals, new `@if`/`@for` control-flow syntax), Hono (Cloudflare Worker), Vitest (`@cloudflare/vitest-pool-workers`).

## Global Constraints

- German-first UI: all new user-facing strings are German (matches the rest of Story/Characters/GM Dashboard, which are not yet wired into `LanguageService`'s `t()` — don't introduce `t()` calls here, that's out of scope for this batch).
- No new persistence for Focus Mode or the Narrator selection — both are session-only signals per the approved spec (`docs/superpowers/specs/2026-08-16-issue-26-quick-wins-design.md`).
- Frontend has no unit-test suite wired into CI (only `apps/web/src/app/app.spec.ts`, the unmodified Angular CLI default, exists) — frontend tasks are verified by running the dev server and checking behavior directly, not by writing `.spec.ts` files.
- Backend (`apps/api`) has real Vitest coverage run in CI (`npm test` in `.github/workflows/api-ci.yml`) — the one piece of new backend logic (Task 4) gets a real unit test, following the existing `src/providers/response-text.ts` / `test/response-text.test.ts` pattern of extracting pure logic into its own file for direct testing.
- Every task ends with `git commit`; keep commits scoped to one task each.

---

### Task 1: NPC appearance fields on the Characters screen

**Files:**
- Modify: `apps/web/src/app/features/characters/characters-screen/characters-screen.html:86-89`

**Interfaces:**
- Consumes: `Character.appearance` (already has `voice`, `posture`, `typicalExpression`, `hands`, `grooming`, `generalPresence` — no model changes needed).
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Add the six missing appearance fields**

The character-sheet modal's `.character-sheet__appearance` list currently stops after `distinguishingFeatures`. Player Profile (`apps/web/src/app/features/player/player-profile-screen/player-profile-screen.html:70-83`) already shows the same six extra fields for the player — mirror its exact labels and field order.

In `characters-screen.html`, find:

```html
          <dt>Besondere Merkmale</dt>
          <dd>{{ character.appearance.distinguishingFeatures }}</dd>
        </dl>
```

Replace with:

```html
          <dt>Besondere Merkmale</dt>
          <dd>{{ character.appearance.distinguishingFeatures }}</dd>
          <dt>Stimme</dt>
          <dd>{{ character.appearance.voice }}</dd>
          <dt>Haltung</dt>
          <dd>{{ character.appearance.posture }}</dd>
          <dt>Typischer Ausdruck</dt>
          <dd>{{ character.appearance.typicalExpression }}</dd>
          <dt>Hände</dt>
          <dd>{{ character.appearance.hands }}</dd>
          <dt>Pflege</dt>
          <dd>{{ character.appearance.grooming }}</dd>
          <dt>Auftreten</dt>
          <dd>{{ character.appearance.generalPresence }}</dd>
        </dl>
```

- [ ] **Step 2: Verify in the browser**

Run `cd apps/web && npm start`, open the app, go to Characters, click on an NPC (e.g. Anne Hale or Grace Hale). Confirm the "Aussehen" section now shows 13 fields total (the original 7 plus these 6), with the same labels Player Profile uses for the player.

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/app/features/characters/characters-screen/characters-screen.html
git commit -m "Show the 6 appearance fields on NPCs that Player Profile already had (§26 quick win 1/4)"
```

---

### Task 2: §75 Memory Inspector — Created column + resolved names

**Files:**
- Modify: `apps/web/src/app/features/gm/gm-dashboard-screen/gm-dashboard-screen.ts`
- Modify: `apps/web/src/app/features/gm/gm-dashboard-screen/gm-dashboard-screen.html:143-173`

**Interfaces:**
- Consumes: `store.current().characters` (already injected as `this.store`), `EntityId` type (already imported in this file).
- Produces: `characterName(id: EntityId): string` and `memoryReferencedBy(entityIds: EntityId[]): string` methods, for this task's own template only — nothing else in the plan depends on them.

- [ ] **Step 1: Add the two lookup methods**

In `gm-dashboard-screen.ts`, after the existing `allMemories` computed (currently ends around line 21), add:

```ts
  protected characterName(id: EntityId): string {
    return this.store.current().characters[id]?.name ?? id;
  }

  protected memoryReferencedBy(entityIds: EntityId[]): string {
    return entityIds.map((id) => this.characterName(id)).join(', ');
  }
```

(`memoryReferencedBy` calls `this.characterName` via `this` inside a regular method — safe to call from the template as `memoryReferencedBy(memory.entityIds)`, unlike passing `characterName` as a bare callback into `.map()` from the template, which would lose its `this` binding.)

- [ ] **Step 2: Update the Memory Inspector table**

In `gm-dashboard-screen.html`, find:

```html
        <thead>
          <tr>
            <th>Fact</th>
            <th>Importance</th>
            <th>Status</th>
            <th>Reach</th>
            <th>Fading</th>
            <th>Involves</th>
          </tr>
        </thead>
        <tbody>
          @for (memory of allMemories(); track memory.id) {
            <tr>
              <td>{{ memory.fact }}</td>
              <td>{{ memory.importance }}</td>
              <td>{{ memory.status }}</td>
              <td>{{ memory.reach }}</td>
              <td>{{ memory.fading }}</td>
              <td>{{ memory.entityIds.join(', ') }}</td>
            </tr>
          }
        </tbody>
```

Replace with:

```html
        <thead>
          <tr>
            <th>Fact</th>
            <th>Importance</th>
            <th>Status</th>
            <th>Reach</th>
            <th>Fading</th>
            <th>Involves</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          @for (memory of allMemories(); track memory.id) {
            <tr>
              <td>{{ memory.fact }}</td>
              <td>{{ memory.importance }}</td>
              <td>{{ memory.status }}</td>
              <td>{{ memory.reach }}</td>
              <td>{{ memory.fading }}</td>
              <td>{{ memoryReferencedBy(memory.entityIds) }}</td>
              <td>{{ memory.worldDate }}</td>
            </tr>
          }
        </tbody>
```

- [ ] **Step 3: Verify in the browser**

With the dev server running, enable GM Mode (Settings → GM/Debug toggle), open `/gm` (GM Dashboard), scroll to "Memory Inspector". Confirm: the "Involves" column shows character names (e.g. "Matthias Hale, Anne Hale") instead of raw IDs (`char_player_matthias, char_anne_hale`), and a new "Created" column shows each memory's world date (e.g. "1811" for the father's-death memory, "9. April 1813" for the letter memory).

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/app/features/gm/gm-dashboard-screen/gm-dashboard-screen.ts apps/web/src/app/features/gm/gm-dashboard-screen/gm-dashboard-screen.html
git commit -m "Memory Inspector: resolve entity IDs to names, add Created column (§75, §26 quick win 2/4)"
```

---

### Task 3: §26 Focus Mode

**Files:**
- Create: `apps/web/src/app/core/ui/focus-mode.service.ts`
- Modify: `apps/web/src/app/features/shell/app-shell/app-shell.ts`
- Modify: `apps/web/src/app/features/shell/app-shell/app-shell.html`
- Modify: `apps/web/src/app/features/shell/app-shell/app-shell.scss`
- Modify: `apps/web/src/app/features/story/story-screen/story-screen.ts`
- Modify: `apps/web/src/app/features/story/story-screen/story-screen.html:1-21`
- Modify: `apps/web/src/app/features/story/story-screen/story-screen.scss`

**Interfaces:**
- Produces: `FocusModeService` with `readonly active: Signal<boolean>` and `toggle(): void` — consumed by `AppShell` and `StoryScreen` in this same task (nothing outside this task depends on it, but it's `providedIn: 'root'` so it's a true singleton shared between them).

- [ ] **Step 1: Create the service**

Create `apps/web/src/app/core/ui/focus-mode.service.ts`:

```ts
import { Injectable, signal } from '@angular/core';

/**
 * §26 Focus Mode — hides nearly all UI chrome during Story Mode, leaving
 * scene/character/dialogue/input visible. Session-only (unlike
 * GmModeService, which persists to localStorage): this is a per-session
 * immersion toggle, not a durable setting, per the spec.
 */
@Injectable({ providedIn: 'root' })
export class FocusModeService {
  private readonly _active = signal(false);
  readonly active = this._active.asReadonly();

  toggle(): void {
    this._active.set(!this._active());
  }
}
```

- [ ] **Step 2: Wire into AppShell**

In `app-shell.ts`, add the import and injection alongside the existing `GmModeService`:

```ts
import { FocusModeService } from '../../../core/ui/focus-mode.service';
```

Add as a class member, next to `protected readonly gmMode = inject(GmModeService);`:

```ts
  protected readonly focusMode = inject(FocusModeService);
```

In `app-shell.html`, find the root element:

```html
<div class="shell">
```

Replace with:

```html
<div class="shell" [class.shell--focus]="focusMode.active()">
```

In `app-shell.scss`, add after the existing `.shell { ... }` block:

```scss
.shell.shell--focus {
  .shell__rail--desktop,
  .shell__rail--mobile {
    display: none;
  }
}
```

- [ ] **Step 3: Wire into Story screen**

In `story-screen.ts`, add the import:

```ts
import { FocusModeService } from '../../../core/ui/focus-mode.service';
```

Add as a class member, next to the other injected services (e.g. after `private readonly pendingAction = inject(PendingStoryActionService);`):

```ts
  protected readonly focusMode = inject(FocusModeService);
```

In `story-screen.html`, find the header block:

```html
  <header class="story-header">
    <span class="story-header__date">{{ scene().worldDate }}</span>
    <span class="story-header__location">{{ locationName(scene().locationId) }}</span>
    <span class="story-header__weather">{{ scene().weather }}</span>
    <button
      class="story-header__undo"
      type="button"
      [disabled]="undoing()"
      (click)="undoLastTurn()"
      title="Undo Last Turn (§153)"
    >
      ⟲ Undo
    </button>
  </header>
  @if (undoMessage()) {
    <p class="story-header__undo-message">{{ undoMessage() }}</p>
  }
  @if (lastUsedProvider(); as provider) {
    <p class="story-header__provider-indicator">erzählt von {{ provider }}</p>
  }
```

Replace with (the Focus toggle button stays outside the `@if`, so it's always reachable to turn Focus Mode back off):

```html
  <header class="story-header">
    @if (!focusMode.active()) {
      <span class="story-header__date">{{ scene().worldDate }}</span>
      <span class="story-header__location">{{ locationName(scene().locationId) }}</span>
      <span class="story-header__weather">{{ scene().weather }}</span>
      <button
        class="story-header__undo"
        type="button"
        [disabled]="undoing()"
        (click)="undoLastTurn()"
        title="Undo Last Turn (§153)"
      >
        ⟲ Undo
      </button>
    }
    <button
      class="story-header__focus-toggle"
      type="button"
      (click)="focusMode.toggle()"
      [title]="focusMode.active() ? 'Fokus-Modus verlassen' : 'Fokus-Modus (§26)'"
    >
      {{ focusMode.active() ? '⤢' : '⤡' }}
    </button>
  </header>
  @if (!focusMode.active()) {
    @if (undoMessage()) {
      <p class="story-header__undo-message">{{ undoMessage() }}</p>
    }
    @if (lastUsedProvider(); as provider) {
      <p class="story-header__provider-indicator">erzählt von {{ provider }}</p>
    }
  }
```

In `story-screen.scss`, add after the existing `.story-header__undo { ... }` block (still inside `.story-header { ... }`, as a sibling to `&__undo`):

```scss
  &__focus-toggle {
    margin-left: 0.5rem;
    background: none;
    border: 1px solid var(--qv-gold);
    color: var(--qv-champagne);
    border-radius: 4px;
    padding: 0.25rem 0.5rem;
    font-size: 0.85rem;
    cursor: pointer;
  }
```

Note: `&__undo` currently has `margin-left: auto` to push it to the header's right edge. With the toggle button now also present, that's still correct — `margin-left: auto` on `&__undo` pushes both the Undo and Focus buttons together to the right (Focus renders after Undo in DOM order when not in focus mode; when focus mode is active, Undo doesn't render because it's inside the removed `@if` block and `&__focus-toggle` has no `margin-left: auto` of its own, so verify visually in Step 4 that it doesn't end up flush-left when alone — if it does, add `margin-left: auto` to `&__focus-toggle` too).

- [ ] **Step 4: Verify in the browser**

With the dev server running, go to Story. Click the Focus toggle (⤡): confirm the desktop nav rail, mobile bottom bar, date/location/weather line, and Undo button all disappear, leaving the scene text, dialogue, input box, and the toggle button (now showing ⤢) visible. Click it again: confirm everything reappears. Also check the toggle button's position looks right in both states (per the note in Step 3 above — fix the CSS if it jumps to the left edge when alone).

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/app/core/ui/focus-mode.service.ts apps/web/src/app/features/shell/app-shell/app-shell.ts apps/web/src/app/features/shell/app-shell/app-shell.html apps/web/src/app/features/shell/app-shell/app-shell.scss apps/web/src/app/features/story/story-screen/story-screen.ts apps/web/src/app/features/story/story-screen/story-screen.html apps/web/src/app/features/story/story-screen/story-screen.scss
git commit -m "Add Focus Mode: hide nav + header chrome during Story Mode (§26, §26 quick win 3/4)"
```

---

### Task 4: B50 Manual Narrator switch

**Files:**
- Create: `apps/api/src/providers/provider-order.ts`
- Create: `apps/api/test/provider-order.test.ts`
- Modify: `apps/api/src/routes/turns.ts:134-146`
- Modify: `apps/web/src/app/core/ai/direct-turn-api.service.ts`
- Modify: `apps/web/src/app/features/story/story-screen/story-screen.ts`
- Modify: `apps/web/src/app/features/story/story-screen/story-screen.html`

**Interfaces:**
- Produces (backend): `orderProviders(preferred: string | null | undefined, all?: readonly ProviderId[]): ProviderId[]` — consumed by the `POST /:id/turn/generate` route handler in this same task.
- Produces (frontend): `DirectTurnApiService.generate(playerAction: string, preferredProvider?: string): Observable<GenerateTurnResult>` — consumed by `StoryScreen.generateDirect` in this same task.

- [ ] **Step 1: Write the failing backend test**

Create `apps/api/test/provider-order.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { orderProviders } from '../src/providers/provider-order';

describe('orderProviders', () => {
  it('re-roots the list at the preferred provider, keeping the rest in their original order', () => {
    expect(orderProviders('anthropic', ['gemini', 'openai', 'anthropic'])).toEqual(['anthropic', 'gemini', 'openai']);
  });

  it('returns the original order unchanged when no preference is given', () => {
    expect(orderProviders(null, ['gemini', 'openai', 'anthropic'])).toEqual(['gemini', 'openai', 'anthropic']);
    expect(orderProviders(undefined, ['gemini', 'openai', 'anthropic'])).toEqual(['gemini', 'openai', 'anthropic']);
  });

  it('ignores an unrecognized preferred provider and falls back to the original order', () => {
    expect(orderProviders('unknown', ['gemini', 'openai', 'anthropic'])).toEqual(['gemini', 'openai', 'anthropic']);
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `cd apps/api && npx vitest run test/provider-order.test.ts`
Expected: FAIL — `Cannot find module '../src/providers/provider-order'` (the file doesn't exist yet).

- [ ] **Step 3: Implement the minimal function**

Create `apps/api/src/providers/provider-order.ts`:

```ts
import { PROVIDER_IDS, type ProviderId } from './types';

/**
 * B50 Manual Narrator switch — re-roots the A32 automatic-fallback
 * iteration at the player's chosen provider (if it's a real, known
 * provider id), preserving the rest of the list as the fallback chain
 * afterward, unchanged. Falls back to the original order untouched when no
 * preference is given or the given one isn't recognized.
 */
export function orderProviders(
  preferred: string | null | undefined,
  all: readonly ProviderId[] = PROVIDER_IDS,
): ProviderId[] {
  const match = all.find((id) => id === preferred);
  if (!match) return [...all];
  return [match, ...all.filter((id) => id !== match)];
}
```

- [ ] **Step 4: Run it to verify it passes**

Run: `cd apps/api && npx vitest run test/provider-order.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Wire it into the turn/generate route**

In `apps/api/src/routes/turns.ts`, add the import at the top alongside the other `providers/` imports:

```ts
import { orderProviders } from '../providers/provider-order';
```

Find:

```ts
  const body = await c.req.json<{ playerAction?: string }>().catch(() => null);
  const playerAction = body?.playerAction?.trim();
```

Replace with:

```ts
  const body = await c.req.json<{ playerAction?: string; preferredProvider?: string }>().catch(() => null);
  const playerAction = body?.playerAction?.trim();
```

Find:

```ts
  for (const provider of PROVIDER_IDS) {
```

Replace with:

```ts
  for (const provider of orderProviders(body?.preferredProvider, PROVIDER_IDS)) {
```

- [ ] **Step 6: Run the full backend test suite**

Run: `cd apps/api && npm test`
Expected: all tests pass (the pre-existing suite plus the 3 new `orderProviders` tests).

- [ ] **Step 7: Frontend — thread the preferred provider through**

In `apps/web/src/app/core/ai/direct-turn-api.service.ts`, find:

```ts
  /** Backend tries every connected provider in priority order (A32) — no provider choice needed here. */
  generate(playerAction: string): Observable<GenerateTurnResult> {
    return this.http.post<GenerateTurnResult>(
      `${API_BASE_URL}/api/simulations/${this.activeSimulation.id()}/turn/generate`,
      { playerAction },
    );
  }
```

Replace with:

```ts
  /**
   * Backend tries every connected provider in priority order (A32). Pass
   * `preferredProvider` (B50 Manual Narrator switch) to have that one tried
   * first — the rest of the fallback chain still applies if it fails.
   */
  generate(playerAction: string, preferredProvider?: string): Observable<GenerateTurnResult> {
    return this.http.post<GenerateTurnResult>(
      `${API_BASE_URL}/api/simulations/${this.activeSimulation.id()}/turn/generate`,
      preferredProvider ? { playerAction, preferredProvider } : { playerAction },
    );
  }
```

- [ ] **Step 8: Story screen — track connected providers and the player's selection**

In `story-screen.ts`, find:

```ts
  /** null until the provider list loads; a provider id once one is connected, so submitAction can skip Manual Relay. */
  protected readonly connectedProvider = signal<string | null>(null);
```

Replace with:

```ts
  /** null until the provider list loads; a provider id once one is connected, so submitAction can skip Manual Relay. */
  protected readonly connectedProvider = signal<string | null>(null);
  /** B50 Manual Narrator switch — every connected provider, for the dropdown; empty until the list loads. */
  protected readonly connectedProviders = signal<string[]>([]);
  /** The player's chosen narrator for the next turn; defaults to connectedProvider once it loads, resets each session (not persisted). */
  protected readonly selectedProvider = signal<string | null>(null);
```

Find:

```ts
    this.providersApi.list().subscribe({
      next: (list) => {
        const connected = PROVIDER_PRIORITY.find((id) => list.some((p) => p.provider === id && p.connected));
        this.connectedProvider.set(connected ?? null);
      },
      error: () => this.connectedProvider.set(null),
    });
```

Replace with:

```ts
    this.providersApi.list().subscribe({
      next: (list) => {
        const connectedIds = PROVIDER_PRIORITY.filter((id) => list.some((p) => p.provider === id && p.connected));
        this.connectedProviders.set(connectedIds);
        const connected = connectedIds[0] ?? null;
        this.connectedProvider.set(connected);
        this.selectedProvider.set(connected);
      },
      error: () => this.connectedProvider.set(null),
    });
```

Find:

```ts
    this.directTurn.generate(action).subscribe({
```

Replace with:

```ts
    this.directTurn.generate(action, this.selectedProvider() ?? undefined).subscribe({
```

- [ ] **Step 9: Story screen template — add the Narrator dropdown**

In `story-screen.html`, inside the `@if (!focusMode.active()) { ... }` block added in Task 3 (the one wrapping date/location/weather/undo), find:

```html
      <span class="story-header__weather">{{ scene().weather }}</span>
      <button
        class="story-header__undo"
```

Replace with:

```html
      <span class="story-header__weather">{{ scene().weather }}</span>
      @if (connectedProviders().length > 0) {
        <label class="story-header__narrator">
          Narrator
          <select [value]="selectedProvider()" (change)="selectedProvider.set($any($event.target).value)">
            @for (provider of connectedProviders(); track provider) {
              <option [value]="provider">{{ provider }}</option>
            }
          </select>
        </label>
      }
      <button
        class="story-header__undo"
```

In `story-screen.scss`, add after the `&__undo { ... }` block, still inside `.story-header { ... }`:

```scss
  &__narrator {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;

    select {
      background: var(--qv-mahogany);
      color: var(--qv-champagne);
      border: 1px solid var(--qv-gold);
      border-radius: 4px;
      padding: 0.15rem 0.3rem;
      font-family: var(--qv-font-ui);
      font-size: 0.7rem;
    }
  }
```

- [ ] **Step 10: Verify**

Run `cd apps/api && npm test` again (full suite, confirms nothing else broke). Then with the dev server running and at least one AI provider connected (Settings → AI & Models), go to Story: confirm the "Narrator" dropdown appears next to the weather, pre-selected to the connected provider. If only one provider is connected, the dropdown will show just that one option — that's correct (nothing to choose between yet). Submit an action and confirm it still narrates successfully (`lastUsedProvider` label matches). Full verification of *switching* to a non-default provider needs a second connected provider — per the project's current state (README: only Gemini has been live-verified with a real key; OpenAI/Anthropic adapters are structurally complete but untested for lack of a key), that end-to-end path can't be exercised live right now. That's an existing, already-documented limitation, not something this task needs to resolve — the backend unit test in Step 1-4 is what proves the reordering logic itself is correct.

- [ ] **Step 11: Commit**

```bash
git add apps/api/src/providers/provider-order.ts apps/api/test/provider-order.test.ts apps/api/src/routes/turns.ts apps/web/src/app/core/ai/direct-turn-api.service.ts apps/web/src/app/features/story/story-screen/story-screen.ts apps/web/src/app/features/story/story-screen/story-screen.html apps/web/src/app/features/story/story-screen/story-screen.scss
git commit -m "Add pre-submit Narrator switch (B50, §26 quick win 4/4)"
```

---

## After all four tasks

- [ ] Update `docs/worklog.md`'s "Done this session" / "Planned" sections: move these four items out of the "Planned" list, note what shipped.
- [ ] `gh issue comment 26 --body "..."` noting these 4 sub-items are done, or close #26 if the remaining items in it are being deferred to their own future issues (check with the user first — #26 has other items not in this batch, e.g. Dance Card, Model Profiles, Story Quality Controls, which are explicitly out of scope here).
- [ ] Push and confirm `API Checks` CI is still green (it will run because Task 4 touches `apps/api`).
