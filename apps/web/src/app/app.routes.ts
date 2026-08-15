import { Routes } from '@angular/router';
import { AppShell } from './features/shell/app-shell/app-shell';
import { PlaceholderScreen } from './features/shell/placeholder-screen/placeholder-screen';
import { StoryScreen } from './features/story/story-screen/story-screen';
import { CharactersScreen } from './features/characters/characters-screen/characters-screen';
import { RelationshipsScreen } from './features/relationships/relationships-screen/relationships-screen';
import { EstateScreen } from './features/estate/estate-screen/estate-screen';
import { WorldScreen } from './features/world/world-screen/world-screen';
import { SocietyScreen } from './features/society/society-screen/society-screen';
import { LettersScreen } from './features/letters/letters-screen/letters-screen';

export const routes: Routes = [
  {
    path: '',
    component: AppShell,
    children: [
      { path: '', component: StoryScreen },
      { path: 'characters', component: CharactersScreen },
      { path: 'world', component: WorldScreen },
      { path: 'relationships', component: RelationshipsScreen },
      {
        path: 'map',
        component: PlaceholderScreen,
        data: { title: 'Map', description: 'Regency-Karte mit Fog of Knowledge — unbekannte Orte werden erst durch Gespräche, Reisen oder Briefe sichtbar.' },
      },
      { path: 'estate', component: EstateScreen },
      { path: 'society', component: SocietyScreen },
      { path: 'letters', component: LettersScreen },
      {
        path: 'journal',
        component: PlaceholderScreen,
        data: { title: 'Journal', description: 'Storymomente, Cinematic Artworks, persönliche Notizen und wichtige Erinnerungen.' },
      },
      {
        path: 'timeline',
        component: PlaceholderScreen,
        data: { title: 'Timeline', description: 'Die tatsächliche Zeitlinie der Simulation, inklusive Canon-Divergence-Ansicht.' },
      },
      {
        path: 'settings',
        component: PlaceholderScreen,
        data: { title: 'Settings', description: 'Simulation, Appearance, Story, AI & Models, Backup & Export, Privacy.' },
      },
    ],
  },
];
