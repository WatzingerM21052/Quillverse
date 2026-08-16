import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SimulationStateStore } from '../../../core/state/simulation-state.store';
import { EntityId } from '../../../core/state/models/entity-id';
import { Location } from '../../../core/state/models/location.model';
import { Modal } from '../../../shared/ui/modal/modal';
import { CompassRose } from '../../../shared/ui/compass-rose/compass-rose';
import { LocationImageApiService } from '../../../core/ai/location-image-api.service';
import { buildLocationPrompt } from '../../../core/ai/location-prompt';
import { MapImageApiService } from '../../../core/ai/map-image-api.service';
import { buildMapPrompt } from '../../../core/ai/map-prompt';
import { API_BASE_URL } from '../../../core/config/api.config';
import { PendingStoryActionService } from '../../../core/state/pending-story-action.service';

const PLACEHOLDER_SCHEME = 'asset://';

@Component({
  selector: 'qv-map-screen',
  imports: [Modal, CompassRose],
  templateUrl: './map-screen.html',
  styleUrl: './map-screen.scss',
})
export class MapScreen {
  private readonly store = inject(SimulationStateStore);
  private readonly locationImageApi = inject(LocationImageApiService);
  private readonly mapImageApi = inject(MapImageApiService);
  private readonly pendingAction = inject(PendingStoryActionService);
  private readonly router = inject(Router);

  /** Fog of knowledge (§41) — only discovered locations ever reach the template. */
  protected readonly locations = this.store.discoveredLocations;

  protected readonly mapBackgroundUrl = computed(() => {
    const asset = this.store.mapBackgroundAsset();
    return asset ? `${API_BASE_URL}${asset}` : null;
  });

  protected readonly generatingMapImage = signal(false);
  protected readonly mapImageError = signal<string | null>(null);

  protected generateMapImage(): void {
    this.generatingMapImage.set(true);
    this.mapImageError.set(null);

    const prompt = buildMapPrompt(this.locations());
    this.mapImageApi.generate(prompt).subscribe({
      next: ({ state }) => {
        this.store.refresh(state);
        this.generatingMapImage.set(false);
      },
      error: (err) => {
        this.mapImageError.set(err?.error?.error ?? 'Landkarte konnte nicht erzeugt werden.');
        this.generatingMapImage.set(false);
      },
    });
  }

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

  /** §42 — pre-fills the Story screen's action instead of duplicating its Direct-API/Manual-Relay dual path here. */
  protected startJourney(location: Location): void {
    this.pendingAction.set(`Ich reise nach ${location.name}.`);
    this.router.navigateByUrl('/');
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
