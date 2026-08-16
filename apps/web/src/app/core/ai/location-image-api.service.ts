import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import { SimulationState } from '../state/models/simulation-state.model';
import { ActiveSimulationService } from '../state/active-simulation.service';
import { EntityId } from '../state/models/entity-id';

export interface LocationImageResult {
  state: SimulationState;
  provider: 'imagen' | 'gemini' | 'pollinations' | 'cloudflare';
}

/** §19 (issue) / A15 Ortsbibliothek — same fallback pipeline as portraits, pointed at Location entities. */
@Injectable({ providedIn: 'root' })
export class LocationImageApiService {
  private readonly http = inject(HttpClient);
  private readonly activeSimulation = inject(ActiveSimulationService);

  generate(locationId: EntityId, prompt: string): Observable<LocationImageResult> {
    return this.http.post<LocationImageResult>(
      `${API_BASE_URL}/api/simulations/${this.activeSimulation.id()}/locations/${locationId}/image`,
      { prompt },
    );
  }
}
