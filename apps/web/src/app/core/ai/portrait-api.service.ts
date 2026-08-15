import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import { SimulationState } from '../state/models/simulation-state.model';
import { ActiveSimulationService } from '../state/active-simulation.service';
import { EntityId } from '../state/models/entity-id';

export interface PortraitResult {
  state: SimulationState;
  provider: 'gemini' | 'pollinations';
}

/** §163-164 — image generation is a separate concern from the story provider. */
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
}
