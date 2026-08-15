import { Component, computed, inject, signal } from '@angular/core';
import { SimulationStateStore } from '../../../core/state/simulation-state.store';
import { EntityId } from '../../../core/state/models/entity-id';
import { Modal } from '../../../shared/ui/modal/modal';

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
  imports: [Modal],
  templateUrl: './letters-screen.html',
  styleUrl: './letters-screen.scss',
})
export class LettersScreen {
  private readonly store = inject(SimulationStateStore);

  protected readonly received = this.store.receivedLetters;
  protected readonly sent = this.store.sentLetters;
  protected readonly statusLabels = STATUS_LABELS;

  protected readonly selectedId = signal<EntityId | null>(null);

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
}
