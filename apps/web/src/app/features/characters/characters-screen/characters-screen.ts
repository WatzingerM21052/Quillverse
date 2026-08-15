import { Component, computed, inject, signal } from '@angular/core';
import { SimulationStateStore } from '../../../core/state/simulation-state.store';
import { EntityId } from '../../../core/state/models/entity-id';
import { describeDimension } from '../../../core/state/relationship-language';
import { Modal } from '../../../shared/ui/modal/modal';
import { GmModeService } from '../../../core/gm/gm-mode.service';
import { PortraitApiService } from '../../../core/ai/portrait-api.service';
import { buildPortraitPrompt } from '../../../core/ai/portrait-prompt';
import { API_BASE_URL } from '../../../core/config/api.config';

/** Seed data ships unused placeholder URIs (e.g. "asset://character/anne/base") — never render those as an <img src>. */
const PLACEHOLDER_SCHEME = 'asset://';

@Component({
  selector: 'qv-characters-screen',
  imports: [Modal],
  templateUrl: './characters-screen.html',
  styleUrl: './characters-screen.scss',
})
export class CharactersScreen {
  private readonly store = inject(SimulationStateStore);
  private readonly portraitApi = inject(PortraitApiService);
  protected readonly gmMode = inject(GmModeService);

  protected readonly describeDimension = describeDimension;
  protected readonly characters = this.store.knownCharacters;
  protected readonly selectedId = signal<EntityId | null>(null);

  protected readonly generatingPortraitId = signal<EntityId | null>(null);
  protected readonly portraitError = signal<string | null>(null);

  protected readonly selectedCharacter = computed(() => {
    const id = this.selectedId();
    return id ? this.store.characterById(id)() : null;
  });

  protected readonly selectedRelationship = computed(() => {
    const id = this.selectedId();
    return id ? this.store.relationshipBetween(this.store.player().id, id) : undefined;
  });

  protected select(id: EntityId): void {
    this.selectedId.set(id);
  }

  protected closeSheet(): void {
    this.selectedId.set(null);
  }

  protected portraitUrl(basePortrait: string): string | null {
    return basePortrait.startsWith(PLACEHOLDER_SCHEME) ? null : `${API_BASE_URL}${basePortrait}`;
  }

  protected generatePortrait(characterId: EntityId): void {
    const character = this.store.characterById(characterId)();
    if (!character) return;

    this.generatingPortraitId.set(characterId);
    this.portraitError.set(null);

    const prompt = buildPortraitPrompt(character, this.store.worldPack().visualStyleBible);
    this.portraitApi.generate(characterId, prompt).subscribe({
      next: ({ state }) => {
        this.store.refresh(state);
        this.generatingPortraitId.set(null);
      },
      error: (err) => {
        this.portraitError.set(err?.error?.error ?? 'Portrait konnte nicht erzeugt werden.');
        this.generatingPortraitId.set(null);
      },
    });
  }
}
