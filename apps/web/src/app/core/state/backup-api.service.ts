import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import { SimulationState } from './models/simulation-state.model';
import { SimulationSummary } from './savepoints-api.service';
import { ActiveSimulationService } from './active-simulation.service';

export interface BackupManifest {
  formatVersion: number;
  simulationId: string;
  simulationName: string;
  stateVersion: number;
  worldDate: string;
  createdAt: string;
  includesAssets: boolean;
}

export interface ExportData {
  manifest: BackupManifest;
  simulation: SimulationState;
  markdown: Record<string, string>;
}

/** §A34-A45 Compact Save export/import — the backend assembles content, the ZIP itself is built/read client-side (fflate). */
@Injectable({ providedIn: 'root' })
export class BackupApiService {
  private readonly http = inject(HttpClient);
  private readonly activeSimulation = inject(ActiveSimulationService);

  exportData(): Observable<ExportData> {
    return this.http.get<ExportData>(`${API_BASE_URL}/api/simulations/${this.activeSimulation.id()}/export`);
  }

  /** §A43 — always creates a new timeline, never overwrites the active one. */
  import(manifest: BackupManifest, simulation: SimulationState, label: string): Observable<SimulationSummary> {
    return this.http.post<SimulationSummary>(`${API_BASE_URL}/api/simulations/import`, { manifest, simulation, label });
  }
}
