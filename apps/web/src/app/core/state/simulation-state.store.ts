import { Injectable, computed, signal } from '@angular/core';
import { EntityId } from './models/entity-id';
import { SimulationState } from './models/simulation-state.model';
import { Relationship } from './models/relationship.model';
import { createSeedState } from './seed/seed-state';
import { WORLD_PACKS } from '../world-pack/world-pack-registry';

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

  readonly farm = computed(() => this.state().farm);
  readonly financeLedger = computed(() => this.state().financeLedger);
  readonly currentSeason = computed(() => this.state().currentSeason);
  readonly currentWorldDate = computed(() => this.state().currentWorldDate);
  readonly worldStatus = computed(() => this.state().worldStatus);
  readonly worldEvents = computed(() => this.state().worldEvents);
  readonly socialCalendar = computed(() => this.state().socialCalendar);

  readonly worldPack = computed(() => WORLD_PACKS[this.state().worldPackId]);
  readonly socialAccessLevel = computed(() => this.state().socialAccessLevel);
  readonly socialLadder = computed(() => this.worldPack().socialLadder);

  readonly receivedLetters = computed(() =>
    Object.values(this.state().letters).filter((letter) => letter.recipientId === this.state().playerId),
  );

  readonly chapters = computed(() => this.state().chapters);
  readonly canonEvents = computed(() => Object.values(this.state().canonEvents));

  readonly discoveredLocations = computed(() =>
    Object.values(this.state().locations).filter((location) => location.discovered),
  );

  private static readonly JOURNAL_WORTHY = new Set(['important', 'major', 'life-changing']);

  readonly journalMemories = computed(() =>
    Object.values(this.state().memories).filter((memory) => SimulationStateStore.JOURNAL_WORTHY.has(memory.importance)),
  );

  readonly sentLetters = computed(() =>
    Object.values(this.state().letters).filter((letter) => letter.senderId === this.state().playerId),
  );

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
