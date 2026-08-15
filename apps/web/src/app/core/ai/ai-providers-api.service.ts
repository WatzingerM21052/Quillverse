import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';

export interface ProviderStatus {
  provider: string;
  connected: boolean;
  status: string;
  keyHint: string | null;
  lastVerifiedAt: string | null;
  /** §156 Model Cost/Limit UI — every attempt today, successful or not (both count against the provider's daily quota). */
  requestsToday: number;
}

/** Calls the real BYOK endpoints (addendum-v1.2-byok.md B4-B19) — no mock data. */
@Injectable({ providedIn: 'root' })
export class AiProvidersApiService {
  private readonly http = inject(HttpClient);

  list(): Observable<ProviderStatus[]> {
    return this.http.get<ProviderStatus[]>(`${API_BASE_URL}/api/ai/providers`);
  }

  connect(provider: string, apiKey: string): Observable<{ provider: string; connected: boolean; keyHint: string }> {
    return this.http.post<{ provider: string; connected: boolean; keyHint: string }>(
      `${API_BASE_URL}/api/ai/providers/${provider}`,
      { apiKey },
    );
  }

  disconnect(provider: string): Observable<{ provider: string; connected: boolean }> {
    return this.http.delete<{ provider: string; connected: boolean }>(`${API_BASE_URL}/api/ai/providers/${provider}`);
  }
}
