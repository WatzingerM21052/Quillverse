import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import { SimulationState } from '../state/models/simulation-state.model';
import { ActiveSimulationService } from '../state/active-simulation.service';

/** §152 — manual state correction, logged as its own event, never silent. */
@Injectable({ providedIn: 'root' })
export class GmApiService {
  private readonly http = inject(HttpClient);
  private readonly activeSimulation = inject(ActiveSimulationService);

  correctLocation(characterId: string, newLocationId: string | null, reason: string): Observable<{ state: SimulationState }> {
    return this.http.post<{ state: SimulationState }>(
      `${API_BASE_URL}/api/simulations/${this.activeSimulation.id()}/gm/correct-location`,
      { characterId, newLocationId, reason },
    );
  }
}
