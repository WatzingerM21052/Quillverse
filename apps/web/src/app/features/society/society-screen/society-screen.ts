import { Component, computed, inject, signal } from '@angular/core';
import { SimulationStateStore } from '../../../core/state/simulation-state.store';
import { Modal } from '../../../shared/ui/modal/modal';

@Component({
  selector: 'qv-society-screen',
  imports: [Modal],
  templateUrl: './society-screen.html',
  styleUrl: './society-screen.scss',
})
export class SocietyScreen {
  private readonly store = inject(SimulationStateStore);

  protected readonly ladder = this.store.socialLadder;
  protected readonly currentLevel = this.store.socialAccessLevel;
  protected readonly calendar = this.store.socialCalendar;

  protected readonly selectedId = signal<string | null>(null);
  protected readonly selectedEntry = computed(() => this.calendar().find((entry) => entry.id === this.selectedId()) ?? null);

  protected open(id: string): void {
    this.selectedId.set(id);
  }

  protected close(): void {
    this.selectedId.set(null);
  }
}
