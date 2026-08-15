import { Routes } from '@angular/router';
import { AppShell } from './features/shell/app-shell/app-shell';
import { StoryScreen } from './features/story/story-screen/story-screen';
import { CharactersScreen } from './features/characters/characters-screen/characters-screen';
import { RelationshipsScreen } from './features/relationships/relationships-screen/relationships-screen';
import { EstateScreen } from './features/estate/estate-screen/estate-screen';
import { WorldScreen } from './features/world/world-screen/world-screen';
import { SocietyScreen } from './features/society/society-screen/society-screen';
import { LettersScreen } from './features/letters/letters-screen/letters-screen';
import { JournalScreen } from './features/journal/journal-screen/journal-screen';
import { TimelineScreen } from './features/timeline/timeline-screen/timeline-screen';
import { SettingsScreen } from './features/settings/settings-screen/settings-screen';
import { GmDashboardScreen } from './features/gm/gm-dashboard-screen/gm-dashboard-screen';
import { MapScreen } from './features/map/map-screen/map-screen';

export const routes: Routes = [
  {
    path: '',
    component: AppShell,
    children: [
      { path: '', component: StoryScreen },
      { path: 'characters', component: CharactersScreen },
      { path: 'world', component: WorldScreen },
      { path: 'relationships', component: RelationshipsScreen },
      { path: 'map', component: MapScreen },
      { path: 'estate', component: EstateScreen },
      { path: 'society', component: SocietyScreen },
      { path: 'letters', component: LettersScreen },
      { path: 'journal', component: JournalScreen },
      { path: 'timeline', component: TimelineScreen },
      { path: 'settings', component: SettingsScreen },
      { path: 'gm', component: GmDashboardScreen },
    ],
  },
];
