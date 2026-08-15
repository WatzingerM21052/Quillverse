import { Component, inject } from '@angular/core';
import { SimulationStateStore } from '../../../core/state/simulation-state.store';

@Component({
  selector: 'qv-player-profile-screen',
  imports: [],
  templateUrl: './player-profile-screen.html',
  styleUrl: './player-profile-screen.scss',
})
export class PlayerProfileScreen {
  private readonly store = inject(SimulationStateStore);

  protected readonly player = this.store.player;
  protected readonly inventory = this.store.playerInventory;
  protected readonly origin = this.store.worldPack().defaultPlayerStart.description;
  protected readonly reputation = this.store.playerReputation;
  protected readonly influence = this.store.playerInfluence;
  protected readonly favors = this.store.favors;

  protected skillEntries(skills: Record<string, string>): [string, string][] {
    return Object.entries(skills);
  }
}
