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
  /** Whichever connected provider actually produced this turn — not necessarily the first choice (A32 automatic fallback). */
  provider: string;
  /** §106 Continuity Guard — true only when a flagged contradiction triggered one corrective retry. */
  continuityRetried: boolean;
}

/** Phase 2/6 gap closed: a turn generated directly via a connected BYOK provider, no copy-paste. */
@Injectable({ providedIn: 'root' })
export class DirectTurnApiService {
  private readonly http = inject(HttpClient);
  private readonly activeSimulation = inject(ActiveSimulationService);

  /**
   * Backend tries every connected provider in priority order (A32). Pass
   * `preferredProvider` (B50 Manual Narrator switch) to have that one tried
   * first — the rest of the fallback chain still applies if it fails.
   */
  generate(playerAction: string, preferredProvider?: string): Observable<GenerateTurnResult> {
    return this.http.post<GenerateTurnResult>(
      `${API_BASE_URL}/api/simulations/${this.activeSimulation.id()}/turn/generate`,
      preferredProvider ? { playerAction, preferredProvider } : { playerAction },
    );
  }

  /** §153 Undo Last Turn. */
  undoLastTurn(): Observable<{ state: SimulationState }> {
    return this.http.post<{ state: SimulationState }>(
      `${API_BASE_URL}/api/simulations/${this.activeSimulation.id()}/undo-last-turn`,
      {},
    );
  }
}
