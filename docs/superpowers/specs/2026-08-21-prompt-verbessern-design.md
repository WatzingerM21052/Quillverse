# "Verbessern"-Button im Character Creator — Design

Status: approved, not yet implemented.
Scope: adds a per-field AI text-improvement action to the Character Creator's free-text inputs
(`/new-character`), so the player can improve a rough note before generating the full draft. Out of
scope: any other screen's text inputs (Letters composer, Journal, etc.) — this pass is Character
Creator only; extending the pattern elsewhere is a separate future decision.

## Problem

The Character Creator (`character-creator-screen.html`) has 7 free-text fields (Aussehen,
Persönlichkeit/Humor, Stärken & Schwächen, Bisherige Lebensgeschichte, Persönliche Ziele, Familie, Hof)
that the player fills with short notes before clicking "Vorschlag generieren", which turns all answers
into a full `CharacterCreationDraft`. Players who aren't confident writers, or who just want to jot
keywords, currently have no way to improve a single field's wording before that final generation step.

## UI (frontend)

Each of the 7 textarea fields gets a small `✨ Verbessern` button next to its label, disabled while the
field is empty. A global mode switch sits near the existing hint box at the top of the form:

```
Verbessern-Modus: ( Polieren ) ⇄ ( Ausformulieren )
```

- **Polieren** — fix grammar/style, keep content and length close to the original (no invented detail).
- **Ausformulieren** — expand short notes into 2-3 flowing, atmospheric Regency-toned sentences,
  filling in plausible detail (same spirit as §131's "AI fills gaps with plausible defaults").

The switch applies to all 7 field buttons; there is no per-field mode override, to avoid 14 buttons on
the form.

Clicking a field's `Verbessern` button:
1. Button shows a loading state (`Verbessere …`), disabled while in flight.
2. On success, a suggestion card appears **below that field** showing the improved text, with two
   actions: `Übernehmen` (writes the suggestion into the field via the existing `setAnswer`) and
   `Verwerfen` (dismisses the card, field unchanged).
3. On failure, an inline error appears under that field (same visual pattern as the existing
   `error()` signal used for the draft-generation flow), not a form-wide error.
4. Only one open suggestion card per field; re-clicking `Verbessern` while a card is open replaces it.
5. Each field's loading/suggestion/error state is independent — improving one field never blocks or
   affects another field, and never blocks the main "Vorschlag generieren" button.
6. Changing the global mode switch only affects future clicks; any already-open suggestion card is
   left as-is.

### Component state (`CharacterCreatorScreen`)

- `improveMode = signal<'polish' | 'expand'>('expand')`
- `fieldImprovements = signal<Partial<Record<ImprovableField, { loading: boolean; suggestion: string | null; error: string | null }>>>({})`
  where `ImprovableField` is the union of the 7 improvable keys of `CharacterCreationAnswers`
  (`appearanceNotes | personalityNotes | strengthsWeaknesses | backstory | personalGoals | family | farmDetails`)
- `improveField(field: ImprovableField)` — reads current value from `answers()`, calls the API service,
  updates `fieldImprovements` accordingly
- `acceptSuggestion(field: ImprovableField)` — calls `setAnswer(field, suggestion)`, clears that field's
  entry in `fieldImprovements`
- `dismissSuggestion(field: ImprovableField)` — clears that field's entry in `fieldImprovements`

### API client

`CharacterCreationApiService` gets one new method, mirroring `draft()`:

```ts
improveField(field: string, value: string, mode: 'polish' | 'expand', answers: CharacterCreationAnswers):
  Observable<{ improvedText: string; provider: string }>
```

POSTs to `${API_BASE_URL}/api/character-creation/improve-field`.

## Backend

New route `POST /api/character-creation/improve-field` in `apps/api/src/routes/character-creation.ts`,
structurally a leaner sibling of the existing `/draft` route — same provider-fallback chain, same
JSON-repair-retry pattern, different prompt and a much smaller response contract.

**Request body:** `{ field: string; value: string; mode: 'polish' | 'expand'; answers: CharacterCreationAnswers }`.
`answers` (the rest of the form, not just the one field) is passed through so the prompt can use it as
context — e.g. improving "Familie" can reference the name already typed into "Charakter".

**Prompt:** new `buildFieldImprovementPrompt(field, value, mode, answers)` in a new file
`apps/api/src/services/character-field-improvement-prompt.ts`. Builds a prompt containing: the
Regency/world context, a per-field human label + short description (same labels the frontend uses —
"Aussehen", "Familie", etc.), the mode-specific instruction (polish vs. expand as defined above), the
other answers as context, and an instruction to return **only** a JSON object of the shape
`{ "improvedText": string }` — no prose, no markdown fence (same constraint style already used
elsewhere in this codebase's prompts).

**Response contract & validation:** new `validateFieldImprovement(responseText)` in
`apps/api/src/services/validate-field-improvement.ts`, analogous to
`validate-character-creation-draft.ts` — parses the response as JSON, checks it has a non-empty string
`improvedText`, returns `{ ok: true; improvedText: string } | { ok: false; error: string }`.

**Route logic** (mirrors `/draft`'s loop almost exactly):
- Iterate `PROVIDER_IDS`; skip providers with no stored credential (`getDecryptedCredential`).
- No connected provider at all → `400` with the same "No AI provider is connected…" message style as
  `/draft`.
- For each connected provider, up to 2 attempts (first plain, second with the existing
  `REPAIR_INSTRUCTION` appended) calling `PROVIDER_ADAPTERS[provider].generateStory(apiKey, prompt, modelId)`.
- Validate the response with `validateFieldImprovement`; on success, `logAiCall` (success) and return
  `c.json({ improvedText, provider })`.
- On provider error or invalid JSON, `logAiCall` (failure) with reason (`generation_failed` /
  `invalid_response`, same enum values `/draft` already uses), continue to the next attempt/provider.
- All attempts exhausted → `502` with the last error message.
- `logAiCall` uses a new fixed pseudo-id `character-creation-field-improve` (parallel to the existing
  `DRAFT_LOG_ID = 'character-creation-draft'`), so these calls count toward the §156 usage/quota display
  under their own label rather than being invisible or miscounted against draft generation.

No new database table or migration — this endpoint is stateless (no persistence, same as `/draft`
before confirmation).

## Error handling & edge cases

- No provider connected: field-level inline error, same wording style as the existing draft-generation
  error path.
- All providers fail: field-level inline error showing the last provider's error message.
- Empty field: `Verbessern` button stays disabled (mirrors the existing "disabled while `generating()`"
  pattern already used for the draft button), so this case can't reach the backend.
- Concurrent improvements on different fields: allowed and independent (`fieldImprovements` is keyed
  per field).
- Re-clicking `Verbessern` on a field with an already-open suggestion card: starts a new request:
  overwrites that field's `fieldImprovements` entry once the new result/error arrives (the old card is
  effectively replaced, not stacked).

## Testing

- Backend: unit tests for `validateFieldImprovement` (valid JSON, JSON missing the key, non-JSON text,
  empty string) — same shape as existing tests for `validateCharacterCreationDraft`. A route-level test
  for the provider-fallback/repair-retry behavior, mirroring however `/draft` is currently tested (same
  file/pattern, if such a test exists for `/draft`; if not, this route doesn't need one either — no new
  test infrastructure introduced beyond what the project already has for `/draft`).
- Frontend: no new automated UI test — this project's frontend has no established pattern for testing
  signal-driven interactive flows like this one. Verify live via Claude-in-Chrome after deploy: type a
  short note into one field, toggle both modes, confirm suggestion card appears/disappears correctly on
  Übernehmen/Verwerfen, confirm the main "Vorschlag generieren" flow is unaffected.

## Out of scope / explicitly deferred

- Extending "Verbessern" to any other screen's text inputs (Letters, Journal, Settings notes, etc.).
- Per-field mode override (all 7 fields share one global Polieren/Ausformulieren switch).
- Persisting the chosen mode across sessions (resets to `'expand'` default on reload, same as other
  session-only UI state in this project, e.g. Focus Mode).
- Streaming/partial responses — the field improvement call is a single request/response, same as `/draft`.
