import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import { SimulationState } from '../state/models/simulation-state.model';
import { Scene } from '../state/models/scene.model';
import { ActiveSimulationService } from '../state/active-simulation.service';

export interface GenerateTurnResult {
  state: SimulationState;
  scene: Scene;
}

/** Phase 2/6 gap closed: a turn generated directly via a connected BYOK provider, no copy-paste. */
@Injectable({ providedIn: 'root' })
export class DirectTurnApiService {
  private readonly http = inject(HttpClient);
  private readonly activeSimulation = inject(ActiveSimulationService);

  generate(playerAction: string, provider: string): Observable<GenerateTurnResult> {
    return this.http.post<GenerateTurnResult>(
      `${API_BASE_URL}/api/simulations/${this.activeSimulation.id()}/turn/generate`,
      { playerAction, provider },
    );
  }
}
