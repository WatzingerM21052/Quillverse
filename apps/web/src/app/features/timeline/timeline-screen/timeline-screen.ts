import { Component, inject } from '@angular/core';
import { SimulationStateStore } from '../../../core/state/simulation-state.store';

@Component({
  selector: 'qv-timeline-screen',
  imports: [],
  templateUrl: './timeline-screen.html',
  styleUrl: './timeline-screen.scss',
})
export class TimelineScreen {
  private readonly store = inject(SimulationStateStore);

  protected readonly events = this.store.journalMemories;
  protected readonly canonEvents = this.store.canonEvents;
}
