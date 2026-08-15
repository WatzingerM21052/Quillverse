import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import { SimulationState } from '../state/models/simulation-state.model';
import { Scene } from '../state/models/scene.model';
import { ActiveSimulationService } from '../state/active-simulation.service';

export interface ContextPackage {
  contextText: string;
  baseStateVersion: number;
}

export interface CommitTurnResult {
  state: SimulationState;
  scene: Scene;
}

/**
 * Manual Relay (addendum-v1.1-architecture.md A23-A26, B68) — the path that
 * needs zero API keys: build a context package, the player pastes it into
 * any external AI chat by hand, pastes the reply back, we validate + commit.
 */
@Injectable({ providedIn: 'root' })
export class ManualRelayService {
  private readonly http = inject(HttpClient);
  private readonly activeSimulation = inject(ActiveSimulationService);

  generateContextPackage(playerAction: string): Observable<ContextPackage> {
    return this.http.post<ContextPackage>(`${API_BASE_URL}/api/simulations/${this.activeSimulation.id()}/context-package`, {
      playerAction,
    });
  }

  commitTurn(playerAction: string, baseStateVersion: number, responseText: string): Observable<CommitTurnResult> {
    return this.http.post<CommitTurnResult>(`${API_BASE_URL}/api/simulations/${this.activeSimulation.id()}/commit`, {
      playerAction,
      baseStateVersion,
      responseText,
    });
  }
}
