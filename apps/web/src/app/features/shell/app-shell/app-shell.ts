import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SimulationStateStore } from '../../../core/state/simulation-state.store';
import { GmModeService } from '../../../core/gm/gm-mode.service';
import { LanguageService } from '../../../core/i18n/language.service';

interface NavItem {
  path: string;
  label: string;
}

interface NavItemDef {
  path: string;
  de: string;
  en: string;
}

/** Primary areas per ui-master-prompt-v1.md §7. Settings/AI/Save live separately. */
const PRIMARY_NAV: NavItemDef[] = [
  { path: '', de: 'Geschichte', en: 'Story' },
  { path: 'profile', de: 'Profil', en: 'Profile' },
  { path: 'world', de: 'Welt', en: 'World' },
  { path: 'characters', de: 'Figuren', en: 'Characters' },
  { path: 'relationships', de: 'Beziehungen', en: 'Relationships' },
  { path: 'map', de: 'Landkarte', en: 'Map' },
  { path: 'estate', de: 'Hof', en: 'Estate' },
  { path: 'society', de: 'Gesellschaft', en: 'Society' },
  { path: 'letters', de: 'Briefe', en: 'Letters' },
  { path: 'journal', de: 'Tagebuch', en: 'Journal' },
  { path: 'timeline', de: 'Zeitleiste', en: 'Timeline' },
];

const SECONDARY_NAV: NavItemDef[] = [{ path: 'settings', de: 'Einstellungen', en: 'Settings' }];

@Component({
  selector: 'qv-app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.scss',
})
export class AppShell {
  private readonly store = inject(SimulationStateStore);
  protected readonly gmMode = inject(GmModeService);
  protected readonly lang = inject(LanguageService);

  protected readonly primaryNav = computed<NavItem[]>(() =>
    PRIMARY_NAV.map((item) => ({ path: item.path, label: this.lang.t(item.de, item.en) })),
  );
  protected readonly secondaryNav = computed<NavItem[]>(() =>
    SECONDARY_NAV.map((item) => ({ path: item.path, label: this.lang.t(item.de, item.en) })),
  );
  protected readonly loading = this.store.loading;
  protected readonly loadError = this.store.loadError;
}
