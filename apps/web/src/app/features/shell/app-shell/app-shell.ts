import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SimulationStateStore } from '../../../core/state/simulation-state.store';
import { GmModeService } from '../../../core/gm/gm-mode.service';

interface NavItem {
  path: string;
  label: string;
}

/** Primary areas per ui-master-prompt-v1.md §7. Settings/AI/Save live separately. */
const PRIMARY_NAV: NavItem[] = [
  { path: '', label: 'Story' },
  { path: 'profile', label: 'Profile' },
  { path: 'world', label: 'World' },
  { path: 'characters', label: 'Characters' },
  { path: 'relationships', label: 'Relationships' },
  { path: 'map', label: 'Map' },
  { path: 'estate', label: 'Estate' },
  { path: 'society', label: 'Society' },
  { path: 'letters', label: 'Letters' },
  { path: 'journal', label: 'Journal' },
  { path: 'timeline', label: 'Timeline' },
];

const SECONDARY_NAV: NavItem[] = [{ path: 'settings', label: 'Settings' }];

@Component({
  selector: 'qv-app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.scss',
})
export class AppShell {
  private readonly store = inject(SimulationStateStore);
  protected readonly gmMode = inject(GmModeService);

  protected readonly primaryNav = PRIMARY_NAV;
  protected readonly secondaryNav = SECONDARY_NAV;
  protected readonly loading = this.store.loading;
  protected readonly loadError = this.store.loadError;
}
