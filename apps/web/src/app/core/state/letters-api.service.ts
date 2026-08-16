import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import { SimulationState } from './models/simulation-state.model';
import { ActiveSimulationService } from './active-simulation.service';
import { EntityId } from './models/entity-id';

/** §59-63 Letter composer (issue #21). */
@Injectable({ providedIn: 'root' })
export class LettersApiService {
  private readonly http = inject(HttpClient);
  private readonly activeSimulation = inject(ActiveSimulationService);

  send(recipientId: EntityId, content: string): Observable<{ state: SimulationState }> {
    return this.http.post<{ state: SimulationState }>(
      `${API_BASE_URL}/api/simulations/${this.activeSimulation.id()}/letters`,
      { recipientId, content },
    );
  }
}
