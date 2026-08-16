import { Component, computed, inject, signal } from '@angular/core';
import { SimulationStateStore } from '../../../core/state/simulation-state.store';
import { EntityId } from '../../../core/state/models/entity-id';
import { Modal } from '../../../shared/ui/modal/modal';
import { WaxSeal } from '../../../shared/ui/wax-seal/wax-seal';
import { LettersApiService } from '../../../core/state/letters-api.service';

const STATUS_LABELS: Record<string, string> = {
  written: 'Geschrieben',
  sent: 'Versandt',
  'in-transit': 'Unterwegs',
  delivered: 'Angekommen',
  answered: 'Beantwortet',
  lost: 'Verloren',
};

@Component({
  selector: 'qv-letters-screen',
  imports: [Modal, WaxSeal],
  templateUrl: './letters-screen.html',
  styleUrl: './letters-screen.scss',
})
export class LettersScreen {
  private readonly store = inject(SimulationStateStore);
  private readonly lettersApi = inject(LettersApiService);

  protected readonly received = this.store.receivedLetters;
  protected readonly sent = this.store.sentLetters;
  protected readonly statusLabels = STATUS_LABELS;
  protected readonly recipients = this.store.knownCharacters;

  protected readonly selectedId = signal<EntityId | null>(null);

  protected readonly composing = signal(false);
  protected readonly composeRecipientId = signal<EntityId | ''>('');
  protected readonly composeContent = signal('');
  protected readonly sending = signal(false);
  protected readonly sendError = signal<string | null>(null);

  protected readonly selectedLetter = computed(() => {
    const id = this.selectedId();
    if (!id) return null;
    return [...this.received(), ...this.sent()].find((letter) => letter.id === id) ?? null;
  });

  protected senderName(id: EntityId): string {
    return this.store.characterById(id)()?.name ?? 'Unbekannt';
  }

  protected open(id: EntityId): void {
    this.selectedId.set(id);
  }

  protected close(): void {
    this.selectedId.set(null);
  }

  protected startCompose(): void {
    this.composing.set(true);
    this.composeRecipientId.set('');
    this.composeContent.set('');
    this.sendError.set(null);
  }

  protected cancelCompose(): void {
    this.composing.set(false);
  }

  /** §59-63 — the recipient and delivery (status/dateArrived) beyond "sent" stays AI-driven, same as any other letter. */
  protected sendLetter(): void {
    const recipientId = this.composeRecipientId();
    const content = this.composeContent().trim();
    if (!recipientId || !content) return;

    this.sending.set(true);
    this.sendError.set(null);
    this.lettersApi.send(recipientId, content).subscribe({
      next: ({ state }) => {
        this.store.refresh(state);
        this.sending.set(false);
        this.composing.set(false);
      },
      error: (err) => {
        this.sendError.set(err?.error?.error ?? 'Brief konnte nicht versandt werden.');
        this.sending.set(false);
      },
    });
  }
}
