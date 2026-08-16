import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import { SimulationState } from './models/simulation-state.model';
import { ActiveSimulationService } from './active-simulation.service';
import { EntityId } from './models/entity-id';

export interface JournalResult {
  state: SimulationState;
}

/** §194-196, §192 — Player Notes, Favorite Quotes, Bookmark Moment, Close Chapter. */
@Injectable({ providedIn: 'root' })
export class JournalApiService {
  private readonly http = inject(HttpClient);
  private readonly activeSimulation = inject(ActiveSimulationService);

  private get base(): string {
    return `${API_BASE_URL}/api/simulations/${this.activeSimulation.id()}`;
  }

  /** §195 — "Remember this moment". */
  bookmark(text: string): Observable<JournalResult> {
    return this.http.post<JournalResult>(`${this.base}/bookmark`, { text });
  }

  addNote(text: string): Observable<JournalResult> {
    return this.http.post<JournalResult>(`${this.base}/notes`, { text });
  }

  removeNote(noteId: string): Observable<JournalResult> {
    return this.http.delete<JournalResult>(`${this.base}/notes/${noteId}`);
  }

  favoriteQuote(text: string, speakerId: EntityId, locationId: string): Observable<JournalResult> {
    return this.http.post<JournalResult>(`${this.base}/quotes`, { text, speakerId, locationId });
  }

  removeFavoriteQuote(quoteId: string): Observable<JournalResult> {
    return this.http.delete<JournalResult>(`${this.base}/quotes/${quoteId}`);
  }

  /** §192 SESSION END — short summary + chapters row + savepoint snapshot. */
  closeChapter(title?: string): Observable<JournalResult> {
    return this.http.post<JournalResult>(`${this.base}/close-chapter`, { title });
  }
}
