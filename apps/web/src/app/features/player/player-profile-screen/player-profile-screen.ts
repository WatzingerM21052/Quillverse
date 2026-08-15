import { Component, inject, signal } from '@angular/core';
import { SimulationStateStore } from '../../../core/state/simulation-state.store';
import { PortraitApiService } from '../../../core/ai/portrait-api.service';
import { buildPortraitPrompt } from '../../../core/ai/portrait-prompt';
import { API_BASE_URL } from '../../../core/config/api.config';

/** Seed data ships unused placeholder URIs (e.g. "asset://character/matthias/base") — never render those as an <img src>. */
const PLACEHOLDER_SCHEME = 'asset://';

@Component({
  selector: 'qv-player-profile-screen',
  imports: [],
  templateUrl: './player-profile-screen.html',
  styleUrl: './player-profile-screen.scss',
})
export class PlayerProfileScreen {
  private readonly store = inject(SimulationStateStore);
  private readonly portraitApi = inject(PortraitApiService);

  protected readonly player = this.store.player;
  protected readonly inventory = this.store.playerInventory;
  protected readonly origin = this.store.worldPack().defaultPlayerStart.description;
  protected readonly reputation = this.store.playerReputation;
  protected readonly influence = this.store.playerInfluence;
  protected readonly favors = this.store.favors;

  protected readonly generatingPortrait = signal(false);
  protected readonly portraitError = signal<string | null>(null);

  protected skillEntries(skills: Record<string, string>): [string, string][] {
    return Object.entries(skills);
  }

  protected portraitUrl(basePortrait: string): string | null {
    return basePortrait.startsWith(PLACEHOLDER_SCHEME) ? null : `${API_BASE_URL}${basePortrait}`;
  }

  protected generatePortrait(): void {
    const player = this.player();
    this.generatingPortrait.set(true);
    this.portraitError.set(null);

    const prompt = buildPortraitPrompt(player, this.store.worldPack().visualStyleBible);
    this.portraitApi.generate(player.id, prompt).subscribe({
      next: ({ state }) => {
        this.store.refresh(state);
        this.generatingPortrait.set(false);
      },
      error: (err) => {
        this.portraitError.set(err?.error?.error ?? 'Portrait konnte nicht erzeugt werden.');
        this.generatingPortrait.set(false);
      },
    });
  }
}
