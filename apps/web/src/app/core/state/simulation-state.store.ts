import { Injectable, computed, signal } from '@angular/core';
import { EntityId } from './models/entity-id';
import { SimulationState } from './models/simulation-state.model';
import { Relationship } from './models/relationship.model';
import { createSeedState } from './seed/seed-state';

/**
 * The app's own memory (§76-78, §86): the single place every screen reads
 * simulation state from. Never the AI, never the chat log. Until the AI
 * Orchestrator (later phase) applies real StatePatches, this holds seed data.
 */
@Injectable({ providedIn: 'root' })
export class SimulationStateStore {
  private readonly state = signal<SimulationState>(createSeedState());

  readonly current = this.state.asReadonly();

  readonly player = computed(() => this.state().characters[this.state().playerId]);

  readonly knownCharacters = computed(() =>
    Object.values(this.state().characters).filter((character) => character.id !== this.state().playerId),
  );

  characterById(id: EntityId) {
    return computed(() => this.state().characters[id]);
  }

  relationshipsOf(id: EntityId): Relationship[] {
    return this.state().relationships.filter((relationship) => relationship.from === id);
  }

  relationshipBetween(from: EntityId, to: EntityId): Relationship | undefined {
    return this.state().relationships.find((relationship) => relationship.from === from && relationship.to === to);
  }
}
