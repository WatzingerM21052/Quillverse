import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import { SimulationState } from './models/simulation-state.model';

const SIMULATION_ID = 'sim_default';

export interface SavepointSummary {
  id: string;
  label: string;
  stateVersion: number;
  createdAt: string;
}

/** Named full-state snapshots (§94-96, §153-155) — create, list, restore. */
@Injectable({ providedIn: 'root' })
export class SavepointsApiService {
  private readonly http = inject(HttpClient);

  list(): Observable<SavepointSummary[]> {
    return this.http.get<SavepointSummary[]>(`${API_BASE_URL}/api/simulations/${SIMULATION_ID}/savepoints`);
  }

  create(label: string): Observable<SavepointSummary> {
    return this.http.post<SavepointSummary>(`${API_BASE_URL}/api/simulations/${SIMULATION_ID}/savepoints`, { label });
  }

  restore(savepointId: string): Observable<{ state: SimulationState }> {
    return this.http.post<{ state: SimulationState }>(
      `${API_BASE_URL}/api/simulations/${SIMULATION_ID}/savepoints/${savepointId}/restore`,
      {},
    );
  }
}
