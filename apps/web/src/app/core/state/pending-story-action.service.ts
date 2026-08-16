import { Injectable, signal } from '@angular/core';

/**
 * §42 Map "Reise beginnen" (issue #22) — rather than duplicating the Story
 * screen's Direct-API/Manual-Relay dual path inside the Map screen, travel
 * pre-fills the player's action textarea and routes there. The player still
 * reviews/edits and explicitly submits, same as any other action.
 */
@Injectable({ providedIn: 'root' })
export class PendingStoryActionService {
  private readonly pending = signal<string | null>(null);

  set(action: string): void {
    this.pending.set(action);
  }

  /** Consumes the pending action — returns it once, then clears, so navigating back to Story later doesn't re-fill stale text. */
  consume(): string | null {
    const value = this.pending();
    this.pending.set(null);
    return value;
  }
}
