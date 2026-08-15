import { Component, inject } from '@angular/core';
import { SimulationStateStore } from '../../../core/state/simulation-state.store';
import { Season } from '../../../core/state/models/farm.model';

const SEASON_LABELS: Record<Season, string> = {
  spring: 'Frühling',
  summer: 'Sommer',
  autumn: 'Herbst',
  winter: 'Winter',
};

@Component({
  selector: 'qv-estate-screen',
  imports: [],
  templateUrl: './estate-screen.html',
  styleUrl: './estate-screen.scss',
})
export class EstateScreen {
  private readonly store = inject(SimulationStateStore);

  protected readonly farm = this.store.farm;
  protected readonly financeLedger = this.store.financeLedger;
  protected readonly currentSeason = this.store.currentSeason;
  protected readonly seasonLabels = SEASON_LABELS;
}
