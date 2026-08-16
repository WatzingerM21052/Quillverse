import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import { SimulationState } from '../state/models/simulation-state.model';
import { ActiveSimulationService } from '../state/active-simulation.service';

export interface MapImageResult {
  state: SimulationState;
  provider: 'imagen' | 'gemini' | 'pollinations' | 'cloudflare';
}

/** Same fallback pipeline as portraits/locations, pointed at the simulation's map background instead of one entity. */
@Injectable({ providedIn: 'root' })
export class MapImageApiService {
  private readonly http = inject(HttpClient);
  private readonly activeSimulation = inject(ActiveSimulationService);

  generate(prompt: string): Observable<MapImageResult> {
    return this.http.post<MapImageResult>(`${API_BASE_URL}/api/simulations/${this.activeSimulation.id()}/map/image`, { prompt });
  }
}
