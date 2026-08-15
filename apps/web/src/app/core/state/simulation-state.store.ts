import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { EntityId } from './models/entity-id';
import { SimulationState } from './models/simulation-state.model';
import { Relationship } from './models/relationship.model';
import { createSeedState } from './seed/seed-state';
import { WORLD_PACKS } from '../world-pack/world-pack-registry';
import { API_BASE_URL } from '../config/api.config';

const DEFAULT_SIMULATION_ID = 'sim_default';

/**
 * The app's own memory (§76-78, §86): the single place every screen reads
 * simulation state from. Never the AI, never the chat log.
 *
 * Renders instantly from the same seed data as the backend (§A54 — state must
 * never wait on the network) and then swaps to the real fetched state from
 * quillverse-api once it arrives. If the fetch fails, the seed stays in place
 * rather than breaking the screen (mirrors the asset-fallback rule, A53).
 */
@Injectable({ providedIn: 'root' })
export class SimulationStateStore {
  private readonly http = inject(HttpClient);

  private readonly state = signal<SimulationState>(createSeedState());
  readonly loading = signal(true);
  readonly loadError = signal<string | null>(null);

  constructor() {
    this.http.get<SimulationState>(`${API_BASE_URL}/api/simulations/${DEFAULT_SIMULATION_ID}`).subscribe({
      next: (loaded) => {
        this.state.set(loaded);
        this.loading.set(false);
      },
      error: () => {
        this.loadError.set('Konnte keine Verbindung zum Server herstellen — zeige lokalen Stand.');
        this.loading.set(false);
      },
    });
  }

  readonly current = this.state.asReadonly();

  /** Called after a turn commits (Manual Relay or, later, the AI Orchestrator) so every screen updates. */
  refresh(newState: SimulationState): void {
    this.state.set(newState);
  }

  readonly player = computed(() => this.state().characters[this.state().playerId]);

  readonly farm = computed(() => this.state().farm);
  readonly financeLedger = computed(() => this.state().financeLedger);
  readonly currentSeason = computed(() => this.state().currentSeason);
  readonly currentWorldDate = computed(() => this.state().currentWorldDate);
  readonly worldStatus = computed(() => this.state().worldStatus);
  readonly worldEvents = computed(() => this.state().worldEvents);
  readonly socialCalendar = computed(() => this.state().socialCalendar);
  readonly whistledownIssues = computed(() => this.state().whistledownIssues);

  readonly worldPack = computed(() => WORLD_PACKS[this.state().worldPackId]);
  readonly socialAccessLevel = computed(() => this.state().socialAccessLevel);
  readonly socialLadder = computed(() => this.worldPack().socialLadder);

  readonly receivedLetters = computed(() =>
    Object.values(this.state().letters).filter((letter) => letter.recipientId === this.state().playerId),
  );

  readonly chapters = computed(() => this.state().chapters);
  readonly canonEvents = computed(() => Object.values(this.state().canonEvents));

  readonly playerReputation = computed(() =>
    this.state().reputation.filter((entry) => entry.characterId === this.state().playerId),
  );
  readonly playerInfluence = computed(() =>
    this.state().influence.filter((entry) => entry.characterId === this.state().playerId),
  );
  readonly favors = computed(() => this.state().favors);
  readonly rumors = computed(() => this.state().rumors);
  readonly secrets = computed(() => this.state().secrets);
  readonly scandals = computed(() => this.state().scandals);
  readonly obligations = computed(() => this.state().obligations);
  readonly causalityLog = computed(() => this.state().causalityLog);

  readonly playerInventory = computed(() =>
    this.state().inventory.filter((item) => item.ownerId === this.state().playerId),
  );

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
