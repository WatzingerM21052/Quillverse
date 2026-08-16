import { Component, computed, inject, signal } from '@angular/core';
import { SimulationStateStore } from '../../../core/state/simulation-state.store';
import { EntityId } from '../../../core/state/models/entity-id';
import { Modal } from '../../../shared/ui/modal/modal';
import { LocationImageApiService } from '../../../core/ai/location-image-api.service';
import { buildLocationPrompt } from '../../../core/ai/location-prompt';
import { API_BASE_URL } from '../../../core/config/api.config';

const PLACEHOLDER_SCHEME = 'asset://';

@Component({
  selector: 'qv-map-screen',
  imports: [Modal],
  templateUrl: './map-screen.html',
  styleUrl: './map-screen.scss',
})
export class MapScreen {
  private readonly store = inject(SimulationStateStore);
  private readonly locationImageApi = inject(LocationImageApiService);

  /** Fog of knowledge (§41) — only discovered locations ever reach the template. */
  protected readonly locations = this.store.discoveredLocations;

  protected readonly selectedId = signal<EntityId | null>(null);
  protected readonly selectedLocation = computed(() =>
    this.locations().find((location) => location.id === this.selectedId()) ?? null,
  );

  protected readonly generatingImage = signal(false);
  protected readonly imageError = signal<string | null>(null);

  protected select(id: EntityId): void {
    this.selectedId.set(id);
    this.imageError.set(null);
  }

  protected close(): void {
    this.selectedId.set(null);
  }

  protected locationImageUrl(baseAsset: string): string | null {
    return baseAsset.startsWith(PLACEHOLDER_SCHEME) ? null : `${API_BASE_URL}${baseAsset}`;
  }

  protected generateImage(): void {
    const location = this.selectedLocation();
    if (!location) return;

    this.generatingImage.set(true);
    this.imageError.set(null);

    const prompt = buildLocationPrompt(location, this.store.worldPack().visualStyleBible);
    this.locationImageApi.generate(location.id, prompt).subscribe({
      next: ({ state }) => {
        this.store.refresh(state);
        this.generatingImage.set(false);
      },
      error: (err) => {
        this.imageError.set(err?.error?.error ?? 'Bild konnte nicht erzeugt werden.');
        this.generatingImage.set(false);
      },
    });
  }
}
