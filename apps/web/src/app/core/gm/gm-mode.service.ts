import { Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'qv-gm-mode';

/**
 * GM/Debug Mode (§180): reveals inner thoughts, exact relationship numbers,
 * hidden feelings, and NPC actual state — never shown to the player during
 * normal play (§31, §35, §115). Purely a local UI toggle, not simulation state.
 */
@Injectable({ providedIn: 'root' })
export class GmModeService {
  private readonly _enabled = signal(this.readStored());
  readonly enabled = this._enabled.asReadonly();

  toggle(): void {
    this.set(!this._enabled());
  }

  set(value: boolean): void {
    this._enabled.set(value);
    try {
      localStorage.setItem(STORAGE_KEY, value ? '1' : '0');
    } catch {
      // localStorage unavailable (e.g. private browsing) — mode just won't persist.
    }
  }

  private readStored(): boolean {
    try {
      return localStorage.getItem(STORAGE_KEY) === '1';
    } catch {
      return false;
    }
  }
}
