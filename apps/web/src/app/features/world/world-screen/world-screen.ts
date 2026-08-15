import { Component, inject } from '@angular/core';
import { SimulationStateStore } from '../../../core/state/simulation-state.store';
import { WorldEventCategory } from '../../../core/state/models/world-status.model';

const CATEGORY_LABELS: Record<WorldEventCategory, string> = {
  social: 'Gesellschaft',
  political: 'Politik',
  local: 'Lokal',
  economic: 'Wirtschaft',
};

@Component({
  selector: 'qv-world-screen',
  imports: [],
  templateUrl: './world-screen.html',
  styleUrl: './world-screen.scss',
})
export class WorldScreen {
  private readonly store = inject(SimulationStateStore);

  protected readonly worldDate = this.store.currentWorldDate;
  protected readonly status = this.store.worldStatus;
  protected readonly events = this.store.worldEvents;
  protected readonly categoryLabels = CATEGORY_LABELS;
}
