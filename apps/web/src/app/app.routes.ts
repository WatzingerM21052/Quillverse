import { Routes } from '@angular/router';
import { AppShell } from './features/shell/app-shell/app-shell';
import { StoryScreen } from './features/story/story-screen/story-screen';

// Story Mode is the landing screen (§9) so it loads eagerly with the shell —
// every other screen is lazy: nothing else ships in the initial bundle.
export const routes: Routes = [
  {
    path: '',
    component: AppShell,
    children: [
      { path: '', component: StoryScreen },
      {
        path: 'profile',
        loadComponent: () => import('./features/player/player-profile-screen/player-profile-screen').then((m) => m.PlayerProfileScreen),
      },
      {
        path: 'characters',
        loadComponent: () => import('./features/characters/characters-screen/characters-screen').then((m) => m.CharactersScreen),
      },
      {
        path: 'world',
        loadComponent: () => import('./features/world/world-screen/world-screen').then((m) => m.WorldScreen),
      },
      {
        path: 'relationships',
        loadComponent: () =>
          import('./features/relationships/relationships-screen/relationships-screen').then((m) => m.RelationshipsScreen),
      },
      {
        path: 'map',
        loadComponent: () => import('./features/map/map-screen/map-screen').then((m) => m.MapScreen),
      },
      {
        path: 'estate',
        loadComponent: () => import('./features/estate/estate-screen/estate-screen').then((m) => m.EstateScreen),
      },
      {
        path: 'society',
        loadComponent: () => import('./features/society/society-screen/society-screen').then((m) => m.SocietyScreen),
      },
      {
        path: 'letters',
        loadComponent: () => import('./features/letters/letters-screen/letters-screen').then((m) => m.LettersScreen),
      },
      {
        path: 'journal',
        loadComponent: () => import('./features/journal/journal-screen/journal-screen').then((m) => m.JournalScreen),
      },
      {
        path: 'timeline',
        loadComponent: () => import('./features/timeline/timeline-screen/timeline-screen').then((m) => m.TimelineScreen),
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/settings/settings-screen/settings-screen').then((m) => m.SettingsScreen),
      },
      {
        path: 'gm',
        loadComponent: () => import('./features/gm/gm-dashboard-screen/gm-dashboard-screen').then((m) => m.GmDashboardScreen),
      },
    ],
  },
];
