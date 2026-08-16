import { Injectable, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

/**
 * §26 Focus Mode — hides nearly all UI chrome during Story Mode, leaving
 * scene/character/dialogue/input visible. Session-only (unlike
 * GmModeService, which persists to localStorage): this is a per-session
 * immersion toggle, not a durable setting, per the spec.
 *
 * Focus Mode only makes sense on the Story screen — it's the only screen
 * with a toggle to turn it back off, and AppShell hides the nav rail/bottom
 * bar app-wide (not just on Story) whenever it's active. Without this guard,
 * navigating away from Story while focus mode is on (browser back,
 * deep-link, etc.) strands the player on a screen with no nav and no way to
 * re-enable it short of a full reload. So: auto-reset whenever the resolved
 * route isn't the Story screen (the empty child path under AppShell).
 */
@Injectable({ providedIn: 'root' })
export class FocusModeService {
  private readonly router = inject(Router);

  private readonly _active = signal(false);
  readonly active = this._active.asReadonly();

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe((event) => {
        // Story Mode is the empty child path under AppShell, so its resolved
        // UrlTree has no 'primary' outlet child at all (not a child with zero
        // segments — verified empirically: DefaultUrlSerializer never creates
        // an empty UrlSegmentGroup under 'primary' for the root path). Any
        // other screen has exactly one non-empty segment under 'primary'.
        const primary = this.router.parseUrl(event.urlAfterRedirects).root.children['primary'];
        const isStoryScreen = !primary || primary.segments.length === 0;
        if (!isStoryScreen) {
          this._active.set(false);
        }
      });
  }

  toggle(): void {
    this._active.set(!this._active());
  }
}
