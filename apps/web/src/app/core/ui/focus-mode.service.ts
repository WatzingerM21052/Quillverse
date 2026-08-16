import { Injectable, signal } from '@angular/core';

/**
 * §26 Focus Mode — hides nearly all UI chrome during Story Mode, leaving
 * scene/character/dialogue/input visible. Session-only (unlike
 * GmModeService, which persists to localStorage): this is a per-session
 * immersion toggle, not a durable setting, per the spec.
 */
@Injectable({ providedIn: 'root' })
export class FocusModeService {
  private readonly _active = signal(false);
  readonly active = this._active.asReadonly();

  toggle(): void {
    this._active.set(!this._active());
  }
}
