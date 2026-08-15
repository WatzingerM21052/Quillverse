import { Component, computed, inject, signal } from '@angular/core';
import { SimulationStateStore } from '../../../core/state/simulation-state.store';
import { EntityId } from '../../../core/state/models/entity-id';
import { describeDimension } from '../../../core/state/relationship-language';

@Component({
  selector: 'qv-characters-screen',
  imports: [],
  templateUrl: './characters-screen.html',
  styleUrl: './characters-screen.scss',
})
export class CharactersScreen {
  private readonly store = inject(SimulationStateStore);

  protected readonly describeDimension = describeDimension;
  protected readonly characters = this.store.knownCharacters;
  protected readonly selectedId = signal<EntityId | null>(null);

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
}
