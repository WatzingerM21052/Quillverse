import { Component, inject, signal } from '@angular/core';
import { SimulationStateStore } from '../../../core/state/simulation-state.store';
import { JournalApiService } from '../../../core/state/journal-api.service';
import { FavoriteQuote } from '../../../core/state/models/simulation-state.model';
import { Modal } from '../../../shared/ui/modal/modal';
import { API_BASE_URL } from '../../../core/config/api.config';

const PLACEHOLDER_SCHEME = 'asset://';

@Component({
  selector: 'qv-journal-screen',
  imports: [Modal],
  templateUrl: './journal-screen.html',
  styleUrl: './journal-screen.scss',
})
export class JournalScreen {
  private readonly store = inject(SimulationStateStore);
  private readonly journalApi = inject(JournalApiService);

  protected readonly chapters = this.store.chapters;
  protected readonly memories = this.store.journalMemories;
  protected readonly obligations = this.store.obligations;
  protected readonly notes = this.store.playerNotes;
  protected readonly quotes = this.store.favoriteQuotes;
  protected readonly characters = this.store.knownCharacters;
  protected readonly player = this.store.player;

  protected readonly storyCardQuote = signal<FavoriteQuote | null>(null);

  protected readonly newNoteText = signal('');
  protected readonly noteBusy = signal(false);
  protected readonly closeChapterBusy = signal(false);
  protected readonly journalError = signal<string | null>(null);

  protected isBookmark(tags: string[]): boolean {
    return tags.includes('bookmark');
  }

  protected speakerName(speakerId: string): string {
    if (speakerId === this.store.player().id) return this.store.player().name;
    return this.characters().find((c) => c.id === speakerId)?.name ?? speakerId;
  }

  protected addNote(): void {
    const text = this.newNoteText().trim();
    if (!text) return;

    this.noteBusy.set(true);
    this.journalError.set(null);
    this.journalApi.addNote(text).subscribe({
      next: ({ state }) => {
        this.store.refresh(state);
        this.newNoteText.set('');
        this.noteBusy.set(false);
      },
      error: (err) => {
        this.journalError.set(err?.error?.error ?? 'Notiz konnte nicht gespeichert werden.');
        this.noteBusy.set(false);
      },
    });
  }

  protected removeNote(noteId: string): void {
    this.noteBusy.set(true);
    this.journalApi.removeNote(noteId).subscribe({
      next: ({ state }) => {
        this.store.refresh(state);
        this.noteBusy.set(false);
      },
      error: () => this.noteBusy.set(false),
    });
  }

  protected removeQuote(quoteId: string): void {
    this.journalApi.removeFavoriteQuote(quoteId).subscribe({
      next: ({ state }) => this.store.refresh(state),
    });
  }

  /** §197 SCREENSHOT / STORY CARD — a styled card the player can screenshot; no export library. */
  protected openStoryCard(quote: FavoriteQuote): void {
    this.storyCardQuote.set(quote);
  }

  protected closeStoryCard(): void {
    this.storyCardQuote.set(null);
  }

  protected locationName(locationId: string): string {
    return this.store.current().locations[locationId]?.name ?? locationId;
  }

  protected playerPortraitUrl(): string | null {
    const basePortrait = this.player().visualState.basePortrait;
    return basePortrait.startsWith(PLACEHOLDER_SCHEME) ? null : `${API_BASE_URL}${basePortrait}`;
  }

  /** §192 SESSION END — "Close Chapter". */
  protected closeChapter(): void {
    this.closeChapterBusy.set(true);
    this.journalError.set(null);
    this.journalApi.closeChapter().subscribe({
      next: ({ state }) => {
        this.store.refresh(state);
        this.closeChapterBusy.set(false);
      },
      error: (err) => {
        this.journalError.set(err?.error?.error ?? 'Kapitel konnte nicht abgeschlossen werden.');
        this.closeChapterBusy.set(false);
      },
    });
  }

  private static readonly ROMAN_NUMERALS: [number, string][] = [
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I'],
  ];

  protected toRoman(value: number): string {
    let remaining = value;
    let result = '';
    for (const [amount, numeral] of JournalScreen.ROMAN_NUMERALS) {
      while (remaining >= amount) {
        result += numeral;
        remaining -= amount;
      }
    }
    return result;
  }
}
