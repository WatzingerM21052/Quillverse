import { Component, computed, inject } from '@angular/core';
import { SimulationStateStore } from '../../../core/state/simulation-state.store';
import { runContinuityCheck } from '../../../core/gm/continuity-check';

@Component({
  selector: 'qv-gm-dashboard-screen',
  imports: [],
  templateUrl: './gm-dashboard-screen.html',
  styleUrl: './gm-dashboard-screen.scss',
})
export class GmDashboardScreen {
  private readonly store = inject(SimulationStateStore);

  protected readonly stateVersion = computed(() => this.store.current().stateVersion);
  protected readonly openThreads = computed(() => this.store.current().openThreads);
  protected readonly allCharacters = computed(() => Object.values(this.store.current().characters));
  protected readonly canonEvents = this.store.canonEvents;

  protected readonly issues = computed(() => runContinuityCheck(this.store.current()));

  protected readonly canonDrift = computed(() => {
    const events = this.canonEvents();
    if (events.length === 0) return 'Nicht anwendbar — keine Canon-Ereignisse erfasst';

    const diverged = events.filter((e) => ['changed', 'replaced', 'prevented'].includes(e.status)).length;
    if (diverged === 0) return 'High — Canon Baseline weitgehend intakt';
    if (diverged <= events.length / 3) return 'Moderate';
    if (diverged <= events.length * (2 / 3)) return 'Low';
    return 'Fundamentally Diverged';
  });
}
