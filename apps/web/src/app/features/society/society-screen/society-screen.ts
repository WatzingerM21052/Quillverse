import { Component, computed, inject, signal } from '@angular/core';
import { SimulationStateStore } from '../../../core/state/simulation-state.store';
import { Modal } from '../../../shared/ui/modal/modal';
import { WhistledownIssue } from '../../../core/state/models/whistledown.model';

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

  protected readonly whistledownIssues = this.store.whistledownIssues;
  protected readonly openIssue = signal<WhistledownIssue | null>(null);

  protected open(id: string): void {
    this.selectedId.set(id);
  }

  protected close(): void {
    this.selectedId.set(null);
  }

  protected openWhistledown(issue: WhistledownIssue): void {
    this.openIssue.set(issue);
  }

  protected closeWhistledown(): void {
    this.openIssue.set(null);
  }
}
