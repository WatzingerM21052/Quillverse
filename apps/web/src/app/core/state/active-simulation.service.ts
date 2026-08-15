import { Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'qv-active-simulation';
const DEFAULT_SIMULATION_ID = 'sim_default';

/** Which timeline (§154-155 Branching Timelines) every API call targets. */
@Injectable({ providedIn: 'root' })
export class ActiveSimulationService {
  private readonly _id = signal(this.readStored());
  readonly id = this._id.asReadonly();

  setActive(id: string): void {
    this._id.set(id);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      // localStorage unavailable — selection just won't persist across reloads.
    }
  }

  private readStored(): string {
    try {
      return localStorage.getItem(STORAGE_KEY) ?? DEFAULT_SIMULATION_ID;
    } catch {
      return DEFAULT_SIMULATION_ID;
    }
  }
}
