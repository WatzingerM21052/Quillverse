import { Component, computed, inject, signal } from '@angular/core';
import { SimulationStateStore } from '../../../core/state/simulation-state.store';
import { runContinuityCheck } from '../../../core/gm/continuity-check';
import { GmApiService } from '../../../core/gm/gm-api.service';
import { EntityId } from '../../../core/state/models/entity-id';

@Component({
  selector: 'qv-gm-dashboard-screen',
  imports: [],
  templateUrl: './gm-dashboard-screen.html',
  styleUrl: './gm-dashboard-screen.scss',
})
export class GmDashboardScreen {
  private readonly store = inject(SimulationStateStore);
  private readonly gmApi = inject(GmApiService);

  protected readonly stateVersion = computed(() => this.store.current().stateVersion);
  protected readonly openThreads = computed(() => this.store.current().openThreads);
  protected readonly allCharacters = computed(() => Object.values(this.store.current().characters));
  protected readonly allLocations = computed(() => Object.values(this.store.current().locations));
  protected readonly allMemories = computed(() => Object.values(this.store.current().memories));
  protected readonly canonEvents = this.store.canonEvents;
  protected readonly secrets = this.store.secrets;
  protected readonly causalityLog = this.store.causalityLog;

  protected readonly issues = computed(() => runContinuityCheck(this.store.current()));

  protected characterName(id: EntityId): string {
    return this.store.current().characters[id]?.name ?? id;
  }

  protected memoryReferencedBy(entityIds: EntityId[]): string {
    return entityIds.map((id) => this.characterName(id)).join(', ');
  }

  protected readonly canonDrift = computed(() => {
    const events = this.canonEvents();
    if (events.length === 0) return 'Nicht anwendbar — keine Canon-Ereignisse erfasst';

    const diverged = events.filter((e) => ['changed', 'replaced', 'prevented'].includes(e.status)).length;
    if (diverged === 0) return 'High — Canon Baseline weitgehend intakt';
    if (diverged <= events.length / 3) return 'Moderate';
    if (diverged <= events.length * (2 / 3)) return 'Low';
    return 'Fundamentally Diverged';
  });

  protected readonly editingCharacterId = signal<EntityId | null>(null);
  protected readonly editLocationId = signal<string>('');
  protected readonly editReason = signal('');
  protected readonly correctionSaving = signal(false);
  protected readonly correctionError = signal<string | null>(null);

  protected startEdit(characterId: EntityId, currentLocationId: EntityId | null): void {
    this.editingCharacterId.set(characterId);
    this.editLocationId.set(currentLocationId ?? '');
    this.editReason.set('');
    this.correctionError.set(null);
  }

  protected cancelEdit(): void {
    this.editingCharacterId.set(null);
  }

  protected saveCorrection(): void {
    const characterId = this.editingCharacterId();
    const reason = this.editReason().trim();
    if (!characterId || !reason) return;

    this.correctionSaving.set(true);
    this.correctionError.set(null);

    this.gmApi.correctLocation(characterId, this.editLocationId() || null, reason).subscribe({
      next: ({ state }) => {
        this.store.refresh(state);
        this.correctionSaving.set(false);
        this.editingCharacterId.set(null);
      },
      error: (err) => {
        this.correctionError.set(err?.error?.error ?? 'Korrektur konnte nicht gespeichert werden.');
        this.correctionSaving.set(false);
      },
    });
  }
}
