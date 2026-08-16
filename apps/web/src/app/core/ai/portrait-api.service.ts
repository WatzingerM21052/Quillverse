import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import { SimulationState } from '../state/models/simulation-state.model';
import { ActiveSimulationService } from '../state/active-simulation.service';
import { EntityId } from '../state/models/entity-id';

export interface PortraitResult {
  state: SimulationState;
  provider: 'imagen' | 'gemini' | 'pollinations' | 'cloudflare';
  /** §166 escape hatch — true when a locked character's img2img reference call failed and this was generated without it instead. */
  referenceFallback: boolean;
}

export interface LockResult {
  state: SimulationState;
}

/** §163-164, §166 — image generation is a separate concern from the story provider. */
@Injectable({ providedIn: 'root' })
export class PortraitApiService {
  private readonly http = inject(HttpClient);
  private readonly activeSimulation = inject(ActiveSimulationService);

  generate(characterId: EntityId, prompt: string): Observable<PortraitResult> {
    return this.http.post<PortraitResult>(
      `${API_BASE_URL}/api/simulations/${this.activeSimulation.id()}/characters/${characterId}/portrait`,
      { prompt },
    );
  }

  /** §166 — makes the character's current portrait the reference for future variants. */
  lock(characterId: EntityId): Observable<LockResult> {
    return this.http.post<LockResult>(
      `${API_BASE_URL}/api/simulations/${this.activeSimulation.id()}/characters/${characterId}/portrait/lock`,
      {},
    );
  }

  unlock(characterId: EntityId): Observable<LockResult> {
    return this.http.delete<LockResult>(
      `${API_BASE_URL}/api/simulations/${this.activeSimulation.id()}/characters/${characterId}/portrait/lock`,
    );
  }
}
