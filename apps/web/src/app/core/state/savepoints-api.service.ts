import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import { SimulationState } from './models/simulation-state.model';
import { ActiveSimulationService } from './active-simulation.service';

export interface SavepointSummary {
  id: string;
  label: string;
  stateVersion: number;
  createdAt: string;
}

export interface SimulationSummary {
  id: string;
  label: string;
  worldPackId: string;
  currentWorldDate: string;
  stateVersion: number;
  playerName: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Named full-state snapshots (§94-96, §153-155) — create, list, restore, fork into a new timeline. */
@Injectable({ providedIn: 'root' })
export class SavepointsApiService {
  private readonly http = inject(HttpClient);
  private readonly activeSimulation = inject(ActiveSimulationService);

  list(): Observable<SavepointSummary[]> {
    return this.http.get<SavepointSummary[]>(`${API_BASE_URL}/api/simulations/${this.activeSimulation.id()}/savepoints`);
  }

  create(label: string): Observable<SavepointSummary> {
    return this.http.post<SavepointSummary>(`${API_BASE_URL}/api/simulations/${this.activeSimulation.id()}/savepoints`, { label });
  }

  restore(savepointId: string): Observable<{ state: SimulationState }> {
    return this.http.post<{ state: SimulationState }>(
      `${API_BASE_URL}/api/simulations/${this.activeSimulation.id()}/savepoints/${savepointId}/restore`,
      {},
    );
  }

  fork(savepointId: string, label: string): Observable<SimulationSummary> {
    return this.http.post<SimulationSummary>(
      `${API_BASE_URL}/api/simulations/${this.activeSimulation.id()}/savepoints/${savepointId}/fork`,
      { label },
    );
  }

  listTimelines(): Observable<SimulationSummary[]> {
    return this.http.get<SimulationSummary[]>(`${API_BASE_URL}/api/simulations`);
  }
}
