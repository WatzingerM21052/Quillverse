import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import { SimulationState } from '../state/models/simulation-state.model';

const SIMULATION_ID = 'sim_default';

/** §152 — manual state correction, logged as its own event, never silent. */
@Injectable({ providedIn: 'root' })
export class GmApiService {
  private readonly http = inject(HttpClient);

  correctLocation(characterId: string, newLocationId: string | null, reason: string): Observable<{ state: SimulationState }> {
    return this.http.post<{ state: SimulationState }>(`${API_BASE_URL}/api/simulations/${SIMULATION_ID}/gm/correct-location`, {
      characterId,
      newLocationId,
      reason,
    });
  }
}
