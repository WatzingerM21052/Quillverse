import { Component, computed, inject, signal } from '@angular/core';
import { SimulationStateStore } from '../../../core/state/simulation-state.store';
import { EntityId } from '../../../core/state/models/entity-id';
import { Modal } from '../../../shared/ui/modal/modal';

@Component({
  selector: 'qv-map-screen',
  imports: [Modal],
  templateUrl: './map-screen.html',
  styleUrl: './map-screen.scss',
})
export class MapScreen {
  private readonly store = inject(SimulationStateStore);

  /** Fog of knowledge (§41) — only discovered locations ever reach the template. */
  protected readonly locations = this.store.discoveredLocations;

  protected readonly selectedId = signal<EntityId | null>(null);
  protected readonly selectedLocation = computed(() =>
    this.locations().find((location) => location.id === this.selectedId()) ?? null,
  );

  protected select(id: EntityId): void {
    this.selectedId.set(id);
  }

  protected close(): void {
    this.selectedId.set(null);
  }
}
