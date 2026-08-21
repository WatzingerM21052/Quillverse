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
