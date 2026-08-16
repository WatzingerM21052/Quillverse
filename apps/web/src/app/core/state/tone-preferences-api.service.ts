import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import { SimulationState, TonePreferences } from './models/simulation-state.model';
import { ActiveSimulationService } from './active-simulation.service';

/** §174 Simulation Settings — editable any time, not just at Character Creator time (issue #24). */
@Injectable({ providedIn: 'root' })
export class TonePreferencesApiService {
  private readonly http = inject(HttpClient);
  private readonly activeSimulation = inject(ActiveSimulationService);

  update(tonePreferences: TonePreferences): Observable<{ state: SimulationState }> {
    return this.http.put<{ state: SimulationState }>(
      `${API_BASE_URL}/api/simulations/${this.activeSimulation.id()}/tone-preferences`,
      tonePreferences,
    );
  }
}
