# Character Creator Field-Improvement ("Verbessern") Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a per-field "✨ Verbessern" action to the Character Creator's 7 free-text inputs, letting the player improve a rough note (polish or expand) before generating the full character draft.

**Architecture:** A new stateless backend endpoint (`POST /api/character-creation/improve-field`) reuses the existing provider-fallback/JSON-repair-retry pattern from `/draft` to turn one field's raw text into an improved version. The frontend adds a global Polieren/Ausformulieren mode switch plus a per-field button and suggestion card (accept/dismiss), independent per field.

**Tech Stack:** Angular (signals), Hono (Cloudflare Worker), TypeScript, Vitest.

## Global Constraints

- Design spec: `docs/superpowers/specs/2026-08-21-prompt-verbessern-design.md` — this plan implements it exactly; do not add scope beyond it (no other screens, no per-field mode override, no mode persistence across reloads).
- The 7 improvable fields, exactly: `appearanceNotes`, `personalityNotes`, `strengthsWeaknesses`, `backstory`, `personalGoals`, `family`, `farmDetails`.
- Backend AI responses must be requested and validated as JSON (`{ "improvedText": string }`), with the same repair-retry pattern `/draft` already uses (`REPAIR_INSTRUCTION`, 2 attempts per provider) — never parse free text directly.
- Follow existing code style exactly: German UI copy, existing SCSS custom properties (`--qv-gold`, `--qv-oxblood`, `--qv-ivory`, `--qv-champagne`, `--qv-mahogany`), existing signal-based component patterns.
- This project has no branch/PR workflow — commit directly, following each task's commit step.

---

### Task 1: Backend model — `ImprovableField` type

**Files:**
- Modify: `apps/api/src/models/character-creation.ts`

**Interfaces:**
- Produces: `ImprovableField` type (union of the 7 field names) and `IMPROVABLE_FIELDS: ImprovableField[]` array — consumed by Task 2, Task 3, Task 4.

- [ ] **Step 1: Add the type and constant**

Append to the end of `apps/api/src/models/character-creation.ts`:

```ts
/** The 7 free-text Character Creator fields eligible for the "Verbessern" action. */
export type ImprovableField =
  | 'appearanceNotes'
  | 'personalityNotes'
  | 'strengthsWeaknesses'
  | 'backstory'
  | 'personalGoals'
  | 'family'
  | 'farmDetails';

export const IMPROVABLE_FIELDS: ImprovableField[] = [
  'appearanceNotes',
  'personalityNotes',
  'strengthsWeaknesses',
  'backstory',
  'personalGoals',
  'family',
  'farmDetails',
];
```

- [ ] **Step 2: Type-check**

Run: `cd apps/api && npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add apps/api/src/models/character-creation.ts
git commit -m "Add ImprovableField type for Character Creator field improvement"
```

---

### Task 2: Backend — `validateFieldImprovement`

**Files:**
- Create: `apps/api/src/services/validate-field-improvement.ts`
- Test: `apps/api/test/validate-field-improvement.test.ts`

**Interfaces:**
- Produces: `FieldImprovementValidationOutcome` type and `validateFieldImprovement(raw: string): FieldImprovementValidationOutcome` — consumed by Task 4.

- [ ] **Step 1: Write the failing test**

Create `apps/api/test/validate-field-improvement.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { validateFieldImprovement } from '../src/services/validate-field-improvement';

describe('validateFieldImprovement', () => {
  it('accepts a well-formed response', () => {
    const result = validateFieldImprovement(JSON.stringify({ improvedText: 'Ein hochgewachsener junger Mann mit ruhigen Augen.' }));
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.improvedText).toBe('Ein hochgewachsener junger Mann mit ruhigen Augen.');
  });

  it('rejects malformed JSON', () => {
    const result = validateFieldImprovement('not json');
    expect(result.ok).toBe(false);
  });

  it('rejects a JSON object missing improvedText', () => {
    const result = validateFieldImprovement(JSON.stringify({ text: 'falscher Schlüssel' }));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/improvedText/);
  });

  it('rejects an empty improvedText', () => {
    const result = validateFieldImprovement(JSON.stringify({ improvedText: '   ' }));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/improvedText/);
  });

  it('rejects a JSON array instead of an object', () => {
    const result = validateFieldImprovement(JSON.stringify(['not', 'an', 'object']));
    expect(result.ok).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd apps/api && npx vitest run test/validate-field-improvement.test.ts`
Expected: FAIL — `Cannot find module '../src/services/validate-field-improvement'`.

- [ ] **Step 3: Write the implementation**

Create `apps/api/src/services/validate-field-improvement.ts`:

```ts
export type FieldImprovementValidationOutcome = { ok: true; improvedText: string } | { ok: false; error: string };

/** Structural check before an improved field is shown to the player — same discipline as validateCharacterCreationDraft. */
export function validateFieldImprovement(raw: string): FieldImprovementValidationOutcome {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { ok: false, error: 'That is not valid JSON.' };
  }

  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    return { ok: false, error: 'Expected a single JSON object.' };
  }
  const candidate = parsed as Record<string, unknown>;

  if (typeof candidate['improvedText'] !== 'string' || !candidate['improvedText'].trim()) {
    return { ok: false, error: 'Missing or empty "improvedText".' };
  }

  return { ok: true, improvedText: candidate['improvedText'] };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd apps/api && npx vitest run test/validate-field-improvement.test.ts`
Expected: PASS (5/5).

- [ ] **Step 5: Commit**

```bash
git add apps/api/src/services/validate-field-improvement.ts apps/api/test/validate-field-improvement.test.ts
git commit -m "Add validateFieldImprovement with tests"
```

---

### Task 3: Backend — field-improvement prompt builder

**Files:**
- Create: `apps/api/src/services/character-field-improvement-prompt.ts`

**Interfaces:**
- Consumes: `ImprovableField` from Task 1 (`apps/api/src/models/character-creation.ts`), existing `CharacterCreationAnswers`.
- Produces: `buildFieldImprovementPrompt(field: ImprovableField, value: string, mode: 'polish' | 'expand', answers: CharacterCreationAnswers): string` — consumed by Task 4.

No test file — this project has no existing test for `buildCharacterCreationPrompt` either (prompt builders are exercised indirectly through route/manual verification, per existing convention).

- [ ] **Step 1: Write the implementation**

Create `apps/api/src/services/character-field-improvement-prompt.ts`:

```ts
import type { CharacterCreationAnswers, ImprovableField } from '../models/character-creation';

const FIELD_LABELS: Record<ImprovableField, string> = {
  appearanceNotes: 'Aussehen',
  personalityNotes: 'Persönlichkeit, Humor',
  strengthsWeaknesses: 'Stärken & Schwächen',
  backstory: 'Bisherige Lebensgeschichte',
  personalGoals: 'Persönliche Ziele',
  family: 'Familie (Eltern, Geschwister, Verhältnis, Haushalt)',
  farmDetails: 'Hof (Größe, Besitz/Pacht, Tiere, Schulden, Einkommen)',
};

const MODE_INSTRUCTIONS: Record<'polish' | 'expand', string> = {
  polish:
    'Verbessere ausschließlich Grammatik, Rechtschreibung und Stil. Inhalt und ungefähre Länge müssen ' +
    'nahe am Original bleiben — erfinde keine neuen Details.',
  expand:
    'Formuliere die Notiz zu 2-3 fließenden, atmosphärischen Sätzen im Regency-Ton aus. Du darfst ' +
    'plausible, zum bisherigen Kontext passende Details ergänzen, ohne den Kern der Notiz zu ändern.',
};

/** Labels for the other Character Creator answers, shown to the model as context only (not part of its output). */
const OTHER_ANSWER_LABELS: Partial<Record<keyof CharacterCreationAnswers, string>> = {
  characterName: 'Name',
  age: 'Alter',
  gender: 'Geschlecht',
  appearanceNotes: 'Aussehen',
  personalityNotes: 'Persönlichkeit',
  strengthsWeaknesses: 'Stärken/Schwächen',
  education: 'Bildung',
  specialSkills: 'Besondere Fähigkeiten',
  backstory: 'Lebensgeschichte',
  personalGoals: 'Persönliche Ziele',
  family: 'Familie',
  farmDetails: 'Hof-Details',
};

const OUTPUT_CONTRACT = `=== OUTPUT FORMAT ===

Antworte mit GENAU EINEM JSON-Objekt, sonst nichts — keine Prosa davor oder danach, kein Markdown-Codefence.
Struktur exakt wie folgt:

{ "improvedText": "<der verbesserte Text für dieses eine Feld>" }`;

/**
 * Field-improvement prompt for the Character Creator's per-field "Verbessern" action. Reuses the same
 * Regency starting-position framing as buildCharacterCreationPrompt so improved text stays consistent
 * with the fixed starting conditions, but only asks the model to touch one field.
 */
export function buildFieldImprovementPrompt(
  field: ImprovableField,
  value: string,
  mode: 'polish' | 'expand',
  answers: CharacterCreationAnswers,
): string {
  const otherAnswers = (Object.keys(OTHER_ANSWER_LABELS) as (keyof CharacterCreationAnswers)[])
    .filter((key) => key !== field && answers[key])
    .map((key) => `${OTHER_ANSWER_LABELS[key]}: ${answers[key]}`)
    .join('\n');

  return [
    `=== AUFGABE ===\n\nDu verbesserst NUR das Feld "${FIELD_LABELS[field]}" eines Regency-Charakter-Entwurfs ` +
      `(kein Adel, arme aber respektable Pächterfamilie am Rand von London). ${MODE_INSTRUCTIONS[mode]}`,
    `=== AKTUELLER TEXT DES FELDS "${FIELD_LABELS[field]}" ===\n\n${value}`,
    otherAnswers
      ? `=== ÜBRIGE ANGABEN DES SPIELERS (nur zum Kontext, nicht Teil der Ausgabe) ===\n\n${otherAnswers}`
      : '',
    OUTPUT_CONTRACT,
  ]
    .filter(Boolean)
    .join('\n\n');
}
```

- [ ] **Step 2: Type-check**

Run: `cd apps/api && npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add apps/api/src/services/character-field-improvement-prompt.ts
git commit -m "Add field-improvement prompt builder"
```

---

### Task 4: Backend — `POST /api/character-creation/improve-field` route

**Files:**
- Modify: `apps/api/src/routes/character-creation.ts`

**Interfaces:**
- Consumes: `IMPROVABLE_FIELDS`, `ImprovableField` (Task 1); `validateFieldImprovement` (Task 2); `buildFieldImprovementPrompt` (Task 3); existing `PROVIDER_IDS`, `PROVIDER_ADAPTERS`, `getDecryptedCredential`, `getSelectedModel`, `logAiCall`, `REPAIR_INSTRUCTION`.
- Produces: `POST /api/character-creation/improve-field` — request `{ field: string; value: string; mode: 'polish' | 'expand'; answers?: CharacterCreationAnswers }`, response `{ improvedText: string; provider: string }` on success or `{ error: string }` (400/502) on failure. Consumed by Task 5 (frontend service).

- [ ] **Step 1: Add imports and the route handler**

In `apps/api/src/routes/character-creation.ts`, update the import block at the top (add two new imports and extend the existing models import):

```ts
import { Hono } from 'hono';
import { buildCharacterCreationPrompt } from '../services/character-creation-prompt';
import { buildFieldImprovementPrompt } from '../services/character-field-improvement-prompt';
import { validateCharacterCreationDraft } from '../services/validate-character-creation-draft';
import { validateFieldImprovement } from '../services/validate-field-improvement';
import { createSimulationFromDraft } from '../db/create-simulation';
import type { TonePreferences as ToneReferences } from '../models';
import { logAiCall } from '../db/ai-calls';
import { PROVIDER_ADAPTERS } from '../providers/registry';
import { PROVIDER_IDS } from '../providers/types';
import { getDecryptedCredential, getSelectedModel } from './ai-providers';
import { IMPROVABLE_FIELDS, type CharacterCreationAnswers, type CharacterCreationDraft, type ImprovableField } from '../models/character-creation';
```

Then, add this constant near the existing `DRAFT_LOG_ID` constant:

```ts
const FIELD_IMPROVE_LOG_ID = 'character-creation-field-improve';

function isImprovableField(value: unknown): value is ImprovableField {
  return typeof value === 'string' && (IMPROVABLE_FIELDS as string[]).includes(value);
}
```

Then, add the new route below the existing `/draft` route (before the `/confirm` route):

```ts
/**
 * Per-field "Verbessern" action — improves one Character Creator textarea's text (polish grammar/style,
 * or expand a short note into a fuller Regency-toned passage), without touching the rest of the form.
 * Same provider-fallback/repair-retry pattern as /draft, just against a one-string-field output contract.
 */
characterCreationRoute.post('/improve-field', async (c) => {
  const body = await c
    .req.json<{ field?: string; value?: string; mode?: string; answers?: CharacterCreationAnswers }>()
    .catch(() => null);

  const field = body?.field;
  const value = body?.value?.trim();
  const mode = body?.mode;

  if (!isImprovableField(field) || !value || (mode !== 'polish' && mode !== 'expand')) {
    return c.json({ error: 'field, a non-empty value, and mode ("polish" | "expand") are required.' }, 400);
  }

  const prompt = buildFieldImprovementPrompt(field, value, mode, body?.answers ?? {});

  let anyProviderConnected = false;
  let lastError = 'No AI provider is connected. Connect one in Settings to use the Character Creator.';

  for (const provider of PROVIDER_IDS) {
    const apiKey = await getDecryptedCredential(c.env, provider);
    if (!apiKey) continue;
    anyProviderConnected = true;
    const modelId = await getSelectedModel(c.env, provider);

    for (let attempt = 0; attempt < 2; attempt++) {
      const attemptPrompt = attempt === 0 ? prompt : prompt + REPAIR_INSTRUCTION;
      const startedAt = Date.now();

      let responseText: string;
      try {
        responseText = await PROVIDER_ADAPTERS[provider].generateStory(apiKey, attemptPrompt, modelId ?? undefined);
      } catch (err) {
        lastError = err instanceof Error ? err.message : `${provider} request failed.`;
        await logAiCall(c.env.DB, FIELD_IMPROVE_LOG_ID, provider, false, Date.now() - startedAt, 'generation_failed');
        continue;
      }

      const validation = validateFieldImprovement(responseText);
      if (!validation.ok) {
        lastError = `${provider} response could not be parsed: ${validation.error}`;
        await logAiCall(c.env.DB, FIELD_IMPROVE_LOG_ID, provider, false, Date.now() - startedAt, 'invalid_response');
        continue;
      }

      await logAiCall(c.env.DB, FIELD_IMPROVE_LOG_ID, provider, true, Date.now() - startedAt, null);
      return c.json({ improvedText: validation.improvedText, provider });
    }
  }

  return c.json({ error: lastError }, anyProviderConnected ? 502 : 400);
});
```

Note: `CharacterCreationDraft` was already imported in the original file from `'../models/character-creation'` — the updated import line above keeps it (as a `type` import) alongside the two new names so nothing already used in `/confirm` breaks.

- [ ] **Step 2: Type-check**

Run: `cd apps/api && npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Run the full backend test suite**

Run: `cd apps/api && npm test`
Expected: all existing tests still pass (this task adds no new test file — route-level tests don't exist for `/draft` either, per existing project convention).

- [ ] **Step 4: Commit**

```bash
git add apps/api/src/routes/character-creation.ts
git commit -m "Add POST /api/character-creation/improve-field route"
```

---

### Task 5: Frontend — API service method

**Files:**
- Modify: `apps/web/src/app/core/ai/character-creation-api.service.ts`

**Interfaces:**
- Produces: `ImprovableField` type, `ImprovementMode` type, and `CharacterCreationApiService.improveField(field, value, mode, answers): Observable<{ improvedText: string; provider: string }>` — consumed by Task 6.

- [ ] **Step 1: Add types and the method**

In `apps/web/src/app/core/ai/character-creation-api.service.ts`, add these two type exports right after the existing `ToneReferences` interface (before `CharacterCreationDraft`):

```ts
export type ImprovableField =
  | 'appearanceNotes'
  | 'personalityNotes'
  | 'strengthsWeaknesses'
  | 'backstory'
  | 'personalGoals'
  | 'family'
  | 'farmDetails';

export type ImprovementMode = 'polish' | 'expand';
```

Then add this method to `CharacterCreationApiService`, right after the existing `draft()` method:

```ts
  improveField(
    field: ImprovableField,
    value: string,
    mode: ImprovementMode,
    answers: CharacterCreationAnswers,
  ): Observable<{ improvedText: string; provider: string }> {
    return this.http.post<{ improvedText: string; provider: string }>(
      `${API_BASE_URL}/api/character-creation/improve-field`,
      { field, value, mode, answers },
    );
  }
```

- [ ] **Step 2: Type-check**

Run: `cd apps/web && npx tsc --noEmit -p tsconfig.app.json`
Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/app/core/ai/character-creation-api.service.ts
git commit -m "Add improveField() to CharacterCreationApiService"
```

---

### Task 6: Frontend — component state and methods

**Files:**
- Modify: `apps/web/src/app/features/character-creator/character-creator-screen/character-creator-screen.ts`

**Interfaces:**
- Consumes: `ImprovableField`, `ImprovementMode` and `CharacterCreationApiService.improveField()` (Task 5).
- Produces: `improveMode` signal, `fieldImprovements` signal, `FieldImprovementState` interface, and methods `improveField(field)`, `acceptSuggestion(field)`, `dismissSuggestion(field)` — consumed by Task 7 (template).

- [ ] **Step 1: Update imports and add state/methods**

Replace the full contents of `apps/web/src/app/features/character-creator/character-creator-screen/character-creator-screen.ts` with:

```ts
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  CharacterCreationApiService,
  CharacterCreationAnswers,
  CharacterCreationDraft,
  ImprovableField,
  ImprovementMode,
  ToneReferences,
} from '../../../core/ai/character-creation-api.service';
import { ActiveSimulationService } from '../../../core/state/active-simulation.service';

interface FieldImprovementState {
  loading: boolean;
  suggestion: string | null;
  error: string | null;
}

/** §131 ANFANGSINITIALISIERUNG / §170-176 Character Creator — an AI-assisted interview, not a bare form: answers are optional, the AI fills gaps and proposes a full draft to review. */
@Component({
  selector: 'qv-character-creator-screen',
  imports: [],
  templateUrl: './character-creator-screen.html',
  styleUrl: './character-creator-screen.scss',
})
export class CharacterCreatorScreen {
  private readonly api = inject(CharacterCreationApiService);
  private readonly activeSimulation = inject(ActiveSimulationService);
  private readonly router = inject(Router);

  protected readonly answers = signal<CharacterCreationAnswers>({});
  protected readonly draft = signal<CharacterCreationDraft | null>(null);
  protected readonly draftProvider = signal<string | null>(null);
  protected readonly label = signal('');

  protected readonly generating = signal(false);
  protected readonly confirming = signal(false);
  protected readonly error = signal<string | null>(null);

  /** Global mode for every field's "Verbessern" action — shared, not per-field, per approved design. */
  protected readonly improveMode = signal<ImprovementMode>('expand');
  protected readonly fieldImprovements = signal<Partial<Record<ImprovableField, FieldImprovementState>>>({});

  protected setAnswer<K extends keyof CharacterCreationAnswers>(key: K, value: CharacterCreationAnswers[K]): void {
    this.answers.update((current) => ({ ...current, [key]: value }));
  }

  protected setTone<K extends keyof ToneReferences>(key: K, value: string): void {
    this.answers.update((current) => ({ ...current, tone: { ...current.tone, [key]: value } }));
  }

  /** §131 "Wenn Angaben fehlen: schlage glaubwürdige Standardwerte vor" — blank fields are fine, the AI fills them. */
  protected generateDraft(): void {
    this.generating.set(true);
    this.error.set(null);
    this.draft.set(null);

    this.api.draft(this.answers()).subscribe({
      next: ({ draft, provider }) => {
        this.draft.set(draft);
        this.draftProvider.set(provider);
        this.label.set(`${draft.player.name}s Geschichte`);
        this.generating.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.error ?? 'Der Vorschlag konnte nicht erzeugt werden.');
        this.generating.set(false);
      },
    });
  }

  /** §131 "Frage nach eventuellen Korrekturen" — regenerate against the same (or adjusted) answers rather than editing the draft field by field. */
  protected regenerate(): void {
    this.generateDraft();
  }

  protected confirmAndStart(): void {
    const draft = this.draft();
    const label = this.label().trim();
    if (!draft || !label) return;

    this.confirming.set(true);
    this.error.set(null);

    this.api.confirm(draft, label, this.answers().tone ?? {}).subscribe({
      next: (summary) => {
        this.activeSimulation.setActive(summary.id);
        this.confirming.set(false);
        this.router.navigateByUrl('/');
      },
      error: (err) => {
        this.error.set(err?.error?.error ?? 'Die Zeitlinie konnte nicht erstellt werden.');
        this.confirming.set(false);
      },
    });
  }

  /** Improves one field's text (Polieren/Ausformulieren, per the global improveMode) without touching the rest of the form. */
  protected improveField(field: ImprovableField): void {
    const value = (this.answers()[field] ?? '').trim();
    if (!value) return;

    this.fieldImprovements.update((state) => ({
      ...state,
      [field]: { loading: true, suggestion: null, error: null },
    }));

    this.api.improveField(field, value, this.improveMode(), this.answers()).subscribe({
      next: ({ improvedText }) => {
        this.fieldImprovements.update((state) => ({
          ...state,
          [field]: { loading: false, suggestion: improvedText, error: null },
        }));
      },
      error: (err) => {
        this.fieldImprovements.update((state) => ({
          ...state,
          [field]: { loading: false, suggestion: null, error: err?.error?.error ?? 'Der Text konnte nicht verbessert werden.' },
        }));
      },
    });
  }

  protected acceptSuggestion(field: ImprovableField): void {
    const suggestion = this.fieldImprovements()[field]?.suggestion;
    if (!suggestion) return;
    this.setAnswer(field, suggestion);
    this.dismissSuggestion(field);
  }

  protected dismissSuggestion(field: ImprovableField): void {
    this.fieldImprovements.update((state) => {
      const next = { ...state };
      delete next[field];
      return next;
    });
  }
}
```

- [ ] **Step 2: Type-check**

Run: `cd apps/web && npx tsc --noEmit -p tsconfig.app.json`
Expected: no errors (the template still references only `setAnswer`/`setTone`/etc. that already exist — new members are unused by the template until Task 7, which Angular's template type-checker will flag as "declared but never read" only if `strict` template checking treats unused protected members as errors; it does not, so this is expected to pass cleanly).

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/app/features/character-creator/character-creator-screen/character-creator-screen.ts
git commit -m "Add field-improvement state and methods to CharacterCreatorScreen"
```

---

### Task 7: Frontend — template (mode switch, per-field buttons, suggestion cards)

**Files:**
- Modify: `apps/web/src/app/features/character-creator/character-creator-screen/character-creator-screen.html`

**Interfaces:**
- Consumes: `improveMode`, `fieldImprovements`, `improveField()`, `acceptSuggestion()`, `dismissSuggestion()` (Task 6).
- Produces: rendered UI, consumed by Task 8 (styling) and Task 9 (manual verification).

**Important:** the 7 textareas below switch from *uncontrolled* (`(input)` only, as they are today) to *controlled* (`[value]` bound to the signal too). This is required so that `acceptSuggestion()` calling `setAnswer()` visibly updates the textarea — today's textareas would silently ignore a programmatic signal change since nothing reads `answers()` back into the DOM. The 5 fields that stay out of scope (Name, Alter, Geschlecht, Bildung, Besondere Fähigkeiten) and the 5 tone fields are untouched and stay uncontrolled, consistent with current behavior.

- [ ] **Step 1: Add the global mode switch**

In `apps/web/src/app/features/character-creator/character-creator-screen/character-creator-screen.html`, replace this exact two-line block (it appears once in the file, right after the `creator__hint` paragraph):

```html
  @if (!draft()) {
    <section class="creator__form">
```

with:

```html
  @if (!draft()) {
    <div class="creator__mode-switch">
      <span>Verbessern-Modus:</span>
      <button
        type="button"
        class="creator__mode-switch-btn"
        [class.creator__mode-switch-btn--active]="improveMode() === 'polish'"
        (click)="improveMode.set('polish')"
      >
        Polieren
      </button>
      <button
        type="button"
        class="creator__mode-switch-btn"
        [class.creator__mode-switch-btn--active]="improveMode() === 'expand'"
        (click)="improveMode.set('expand')"
      >
        Ausformulieren
      </button>
    </div>

    <section class="creator__form">
```

(This wraps the switch in the same `@if (!draft())` the form section already uses — it should only show while filling out the form, not on the review screen.)

- [ ] **Step 2: Replace the 7 improvable fields' markup**

Replace this block (currently lines 12-53 — the `<h2>Charakter</h2>` section through the end of the `<h2>Hof</h2>` textarea):

```html
      <h2>Charakter</h2>
      <label>Name<input type="text" (input)="setAnswer('characterName', $any($event.target).value)" /></label>
      <label>Alter<input type="text" (input)="setAnswer('age', $any($event.target).value)" /></label>
      <label>Geschlecht<input type="text" (input)="setAnswer('gender', $any($event.target).value)" /></label>
      <label
        >Aussehen<textarea rows="2" (input)="setAnswer('appearanceNotes', $any($event.target).value)"></textarea
      ></label>
      <label
        >Persönlichkeit, Humor<textarea rows="2" (input)="setAnswer('personalityNotes', $any($event.target).value)"></textarea
      ></label>
      <label
        >Stärken &amp; Schwächen<textarea
          rows="2"
          (input)="setAnswer('strengthsWeaknesses', $any($event.target).value)"
        ></textarea
      ></label>
      <label>Bildung (Lesen/Schreiben)<input type="text" (input)="setAnswer('education', $any($event.target).value)" /></label>
      <label
        >Besondere Fähigkeiten<input type="text" (input)="setAnswer('specialSkills', $any($event.target).value)"
      /></label>
      <label
        >Bisherige Lebensgeschichte<textarea rows="3" (input)="setAnswer('backstory', $any($event.target).value)"></textarea
      ></label>
      <label
        >Persönliche Ziele<textarea rows="2" (input)="setAnswer('personalGoals', $any($event.target).value)"></textarea
      ></label>

      <h2>Familie</h2>
      <label
        >Eltern, Geschwister, Verhältnis, Haushalt<textarea
          rows="3"
          (input)="setAnswer('family', $any($event.target).value)"
        ></textarea
      ></label>

      <h2>Hof</h2>
      <label
        >Größe, Besitz/Pacht, Tiere, Schulden, Einkommen<textarea
          rows="3"
          (input)="setAnswer('farmDetails', $any($event.target).value)"
        ></textarea
      ></label>
```

with:

```html
      <h2>Charakter</h2>
      <label>Name<input type="text" (input)="setAnswer('characterName', $any($event.target).value)" /></label>
      <label>Alter<input type="text" (input)="setAnswer('age', $any($event.target).value)" /></label>
      <label>Geschlecht<input type="text" (input)="setAnswer('gender', $any($event.target).value)" /></label>

      <label>
        <span class="creator__field-label-row">
          Aussehen
          <button
            type="button"
            class="creator__improve-btn"
            [disabled]="!(answers().appearanceNotes ?? '').trim() || fieldImprovements().appearanceNotes?.loading"
            (click)="improveField('appearanceNotes')"
          >
            {{ fieldImprovements().appearanceNotes?.loading ? 'Verbessere …' : '✨ Verbessern' }}
          </button>
        </span>
        <textarea
          rows="2"
          [value]="answers().appearanceNotes ?? ''"
          (input)="setAnswer('appearanceNotes', $any($event.target).value)"
        ></textarea>
      </label>
      @if (fieldImprovements().appearanceNotes?.suggestion) {
        <div class="creator__suggestion">
          <p>{{ fieldImprovements().appearanceNotes?.suggestion }}</p>
          <div class="creator__suggestion-actions">
            <button type="button" (click)="acceptSuggestion('appearanceNotes')">Übernehmen</button>
            <button type="button" (click)="dismissSuggestion('appearanceNotes')">Verwerfen</button>
          </div>
        </div>
      }
      @if (fieldImprovements().appearanceNotes?.error) {
        <p class="creator__error creator__error--field">{{ fieldImprovements().appearanceNotes?.error }}</p>
      }

      <label>
        <span class="creator__field-label-row">
          Persönlichkeit, Humor
          <button
            type="button"
            class="creator__improve-btn"
            [disabled]="!(answers().personalityNotes ?? '').trim() || fieldImprovements().personalityNotes?.loading"
            (click)="improveField('personalityNotes')"
          >
            {{ fieldImprovements().personalityNotes?.loading ? 'Verbessere …' : '✨ Verbessern' }}
          </button>
        </span>
        <textarea
          rows="2"
          [value]="answers().personalityNotes ?? ''"
          (input)="setAnswer('personalityNotes', $any($event.target).value)"
        ></textarea>
      </label>
      @if (fieldImprovements().personalityNotes?.suggestion) {
        <div class="creator__suggestion">
          <p>{{ fieldImprovements().personalityNotes?.suggestion }}</p>
          <div class="creator__suggestion-actions">
            <button type="button" (click)="acceptSuggestion('personalityNotes')">Übernehmen</button>
            <button type="button" (click)="dismissSuggestion('personalityNotes')">Verwerfen</button>
          </div>
        </div>
      }
      @if (fieldImprovements().personalityNotes?.error) {
        <p class="creator__error creator__error--field">{{ fieldImprovements().personalityNotes?.error }}</p>
      }

      <label>
        <span class="creator__field-label-row">
          Stärken &amp; Schwächen
          <button
            type="button"
            class="creator__improve-btn"
            [disabled]="!(answers().strengthsWeaknesses ?? '').trim() || fieldImprovements().strengthsWeaknesses?.loading"
            (click)="improveField('strengthsWeaknesses')"
          >
            {{ fieldImprovements().strengthsWeaknesses?.loading ? 'Verbessere …' : '✨ Verbessern' }}
          </button>
        </span>
        <textarea
          rows="2"
          [value]="answers().strengthsWeaknesses ?? ''"
          (input)="setAnswer('strengthsWeaknesses', $any($event.target).value)"
        ></textarea>
      </label>
      @if (fieldImprovements().strengthsWeaknesses?.suggestion) {
        <div class="creator__suggestion">
          <p>{{ fieldImprovements().strengthsWeaknesses?.suggestion }}</p>
          <div class="creator__suggestion-actions">
            <button type="button" (click)="acceptSuggestion('strengthsWeaknesses')">Übernehmen</button>
            <button type="button" (click)="dismissSuggestion('strengthsWeaknesses')">Verwerfen</button>
          </div>
        </div>
      }
      @if (fieldImprovements().strengthsWeaknesses?.error) {
        <p class="creator__error creator__error--field">{{ fieldImprovements().strengthsWeaknesses?.error }}</p>
      }

      <label>Bildung (Lesen/Schreiben)<input type="text" (input)="setAnswer('education', $any($event.target).value)" /></label>
      <label
        >Besondere Fähigkeiten<input type="text" (input)="setAnswer('specialSkills', $any($event.target).value)"
      /></label>

      <label>
        <span class="creator__field-label-row">
          Bisherige Lebensgeschichte
          <button
            type="button"
            class="creator__improve-btn"
            [disabled]="!(answers().backstory ?? '').trim() || fieldImprovements().backstory?.loading"
            (click)="improveField('backstory')"
          >
            {{ fieldImprovements().backstory?.loading ? 'Verbessere …' : '✨ Verbessern' }}
          </button>
        </span>
        <textarea
          rows="3"
          [value]="answers().backstory ?? ''"
          (input)="setAnswer('backstory', $any($event.target).value)"
        ></textarea>
      </label>
      @if (fieldImprovements().backstory?.suggestion) {
        <div class="creator__suggestion">
          <p>{{ fieldImprovements().backstory?.suggestion }}</p>
          <div class="creator__suggestion-actions">
            <button type="button" (click)="acceptSuggestion('backstory')">Übernehmen</button>
            <button type="button" (click)="dismissSuggestion('backstory')">Verwerfen</button>
          </div>
        </div>
      }
      @if (fieldImprovements().backstory?.error) {
        <p class="creator__error creator__error--field">{{ fieldImprovements().backstory?.error }}</p>
      }

      <label>
        <span class="creator__field-label-row">
          Persönliche Ziele
          <button
            type="button"
            class="creator__improve-btn"
            [disabled]="!(answers().personalGoals ?? '').trim() || fieldImprovements().personalGoals?.loading"
            (click)="improveField('personalGoals')"
          >
            {{ fieldImprovements().personalGoals?.loading ? 'Verbessere …' : '✨ Verbessern' }}
          </button>
        </span>
        <textarea
          rows="2"
          [value]="answers().personalGoals ?? ''"
          (input)="setAnswer('personalGoals', $any($event.target).value)"
        ></textarea>
      </label>
      @if (fieldImprovements().personalGoals?.suggestion) {
        <div class="creator__suggestion">
          <p>{{ fieldImprovements().personalGoals?.suggestion }}</p>
          <div class="creator__suggestion-actions">
            <button type="button" (click)="acceptSuggestion('personalGoals')">Übernehmen</button>
            <button type="button" (click)="dismissSuggestion('personalGoals')">Verwerfen</button>
          </div>
        </div>
      }
      @if (fieldImprovements().personalGoals?.error) {
        <p class="creator__error creator__error--field">{{ fieldImprovements().personalGoals?.error }}</p>
      }

      <h2>Familie</h2>
      <label>
        <span class="creator__field-label-row">
          Eltern, Geschwister, Verhältnis, Haushalt
          <button
            type="button"
            class="creator__improve-btn"
            [disabled]="!(answers().family ?? '').trim() || fieldImprovements().family?.loading"
            (click)="improveField('family')"
          >
            {{ fieldImprovements().family?.loading ? 'Verbessere …' : '✨ Verbessern' }}
          </button>
        </span>
        <textarea
          rows="3"
          [value]="answers().family ?? ''"
          (input)="setAnswer('family', $any($event.target).value)"
        ></textarea>
      </label>
      @if (fieldImprovements().family?.suggestion) {
        <div class="creator__suggestion">
          <p>{{ fieldImprovements().family?.suggestion }}</p>
          <div class="creator__suggestion-actions">
            <button type="button" (click)="acceptSuggestion('family')">Übernehmen</button>
            <button type="button" (click)="dismissSuggestion('family')">Verwerfen</button>
          </div>
        </div>
      }
      @if (fieldImprovements().family?.error) {
        <p class="creator__error creator__error--field">{{ fieldImprovements().family?.error }}</p>
      }

      <h2>Hof</h2>
      <label>
        <span class="creator__field-label-row">
          Größe, Besitz/Pacht, Tiere, Schulden, Einkommen
          <button
            type="button"
            class="creator__improve-btn"
            [disabled]="!(answers().farmDetails ?? '').trim() || fieldImprovements().farmDetails?.loading"
            (click)="improveField('farmDetails')"
          >
            {{ fieldImprovements().farmDetails?.loading ? 'Verbessere …' : '✨ Verbessern' }}
          </button>
        </span>
        <textarea
          rows="3"
          [value]="answers().farmDetails ?? ''"
          (input)="setAnswer('farmDetails', $any($event.target).value)"
        ></textarea>
      </label>
      @if (fieldImprovements().farmDetails?.suggestion) {
        <div class="creator__suggestion">
          <p>{{ fieldImprovements().farmDetails?.suggestion }}</p>
          <div class="creator__suggestion-actions">
            <button type="button" (click)="acceptSuggestion('farmDetails')">Übernehmen</button>
            <button type="button" (click)="dismissSuggestion('farmDetails')">Verwerfen</button>
          </div>
        </div>
      }
      @if (fieldImprovements().farmDetails?.error) {
        <p class="creator__error creator__error--field">{{ fieldImprovements().farmDetails?.error }}</p>
      }
```

- [ ] **Step 3: Type-check the template**

Run: `cd apps/web && npx tsc --noEmit -p tsconfig.app.json`
Expected: no errors (Angular's template type-checker validates `[value]`, `(click)`, and `@if` bindings against the component class from Task 6).

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/app/features/character-creator/character-creator-screen/character-creator-screen.html
git commit -m "Add Verbessern buttons, mode switch, and suggestion cards to Character Creator template"
```

---

### Task 8: Frontend — styling

**Files:**
- Modify: `apps/web/src/app/features/character-creator/character-creator-screen/character-creator-screen.scss`

**Interfaces:**
- Consumes: class names introduced in Task 7 as amended by its fix round (`creator__mode-switch`, `creator__mode-switch-btn`, `creator__mode-switch-btn--active`, `creator__field`, `creator__field-label-row`, `creator__improve-btn`, `creator__suggestion`, `creator__suggestion-actions`, `creator__error--field`).

**Note:** Task 7's review found that its original brief text (nesting the `<button>` inside the `<label>` alongside the `<textarea>`) broke label/control association — clicking a field's label text fired an unintended AI call instead of focusing the textarea. The fix (already applied in Task 7's commits) restructures each of the 7 field blocks to `<div class="creator__field"><label class="creator__field-label-row" for="field-X">...text + button...</label><textarea id="field-X" ...></textarea></div>` — the `<label>` no longer wraps the `<textarea>`, they're siblings inside a new `.creator__field` wrapper, linked via `for`/`id`. This task's styles account for that structure: `.creator__field` now carries the flex-column layout the old `<label>` used to provide, and `.creator__field-label-row` applies directly to the `<label>` element (not a nested `<span>`).

- [ ] **Step 1: Append the new styles**

Add to the end of `apps/web/src/app/features/character-creator/character-creator-screen/character-creator-screen.scss`:

```scss
.creator__field {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.creator__mode-switch {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--qv-font-ui);
  font-size: 0.8rem;
  color: var(--qv-champagne);
  margin: 0 0 1.5rem;
}

.creator__mode-switch-btn {
  background: none;
  border: 1px solid var(--qv-gold);
  color: var(--qv-ivory);
  border-radius: 6px;
  padding: 0.3rem 0.8rem;
  font-family: var(--qv-font-ui);
  font-size: 0.75rem;
  cursor: pointer;
  opacity: 0.6;

  &--active {
    opacity: 1;
    background: var(--qv-oxblood);
  }
}

// Equal specificity to the existing `.creator__form label` rule (character-creator-screen.scss:40-47),
// later in source order — wins the cascade and overrides that rule's `flex-direction: column` with `row`.
label.creator__field-label-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.creator__improve-btn {
  background: none;
  border: 1px solid var(--qv-gold);
  color: var(--qv-gold);
  border-radius: 6px;
  padding: 0.2rem 0.6rem;
  font-family: var(--qv-font-ui);
  font-size: 0.7rem;
  cursor: pointer;
  white-space: nowrap;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
}

.creator__suggestion {
  background: rgba(184, 147, 74, 0.12);
  border: 1px solid var(--qv-gold);
  border-radius: 6px;
  padding: 0.6rem 0.8rem;
  margin-top: -0.4rem;

  p {
    font-family: var(--qv-font-serif);
    font-size: 0.85rem;
    color: var(--qv-ivory);
    margin: 0 0 0.5rem;
  }
}

.creator__suggestion-actions {
  display: flex;
  gap: 0.5rem;

  button {
    background: none;
    border: 1px solid var(--qv-gold);
    color: var(--qv-ivory);
    border-radius: 6px;
    padding: 0.3rem 0.8rem;
    font-family: var(--qv-font-ui);
    font-size: 0.75rem;
    cursor: pointer;
  }
}

.creator__error--field {
  margin-top: -0.4rem;
}
```

- [ ] **Step 2: Build check**

Run: `cd apps/web && npm run build`
Expected: build succeeds with no SCSS errors.

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/app/features/character-creator/character-creator-screen/character-creator-screen.scss
git commit -m "Style Verbessern buttons, mode switch, and suggestion cards"
```

---

### Task 9: Manual end-to-end verification

No files change in this task — it verifies Tasks 1-8 together against a real running app, following this project's established convention (per `docs/worklog.md`) of live-verifying AI-integration features via Claude-in-Chrome rather than adding new automated UI tests.

- [ ] **Step 1: Start both dev servers**

Run: `cd apps/api && npm run dev` (in one terminal)
Run: `cd apps/web && npm start` (in another terminal)

- [ ] **Step 2: Confirm a provider is connected**

Open the app, go to Settings → BYOK, confirm at least one provider (e.g. Gemini) has a saved, validated key. If not, connect one first — the feature cannot be verified without a connected provider (same precondition as the existing draft-generation flow).

- [ ] **Step 3: Verify "Polieren" mode**

Navigate to `/new-character`. Type a short, deliberately rough note into "Aussehen" (e.g. `groß und hat braune augen`, no capitalization/punctuation). Leave the mode switch on "Polieren". Click the field's `✨ Verbessern` button. Confirm: a suggestion card appears below the field with corrected grammar/capitalization, content and length close to the original. Click `Übernehmen` and confirm the textarea's visible content updates to the suggestion and the card disappears.

- [ ] **Step 4: Verify "Ausformulieren" mode**

Switch the mode to "Ausformulieren". Type a short note into "Bisherige Lebensgeschichte" (e.g. `Vater ist gestorben, Mutter näht für andere`). Click that field's `✨ Verbessern`. Confirm the suggestion is a fuller, atmospheric 2-3 sentence passage in Regency tone, still consistent with the note. Click `Verwerfen` this time and confirm the card disappears and the original textarea content is unchanged.

- [ ] **Step 5: Verify independence and error path**

With two fields' suggestions loading or open at once (e.g. click "Verbessern" on "Familie" then immediately on "Hof"), confirm both proceed independently (no shared loading state). Temporarily disconnect the provider in Settings (or use an invalid key) and click a field's `Verbessern` button; confirm the inline error appears under that specific field and the rest of the form (including the "Vorschlag generieren" button) remains usable.

- [ ] **Step 6: Confirm the existing flow is unaffected**

Fill out the rest of the form and click "Vorschlag generieren". Confirm the full character draft still generates and the confirm/regenerate flow at the bottom still works exactly as before this change.

- [ ] **Step 7: Update the worklog**

Add a short entry to `docs/worklog.md`'s status snapshot (or "Done this session" list, per the file's existing convention) noting the Character Creator field-improvement feature is implemented, live-verified, and its commits pushed. Follow the same one-paragraph style already used for other completed features in that file.

- [ ] **Step 8: Push**

```bash
git push
```
