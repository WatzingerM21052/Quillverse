import { Routes } from '@angular/router';
import { AppShell } from './features/shell/app-shell/app-shell';
import { PlaceholderScreen } from './features/shell/placeholder-screen/placeholder-screen';
import { StoryScreen } from './features/story/story-screen/story-screen';
import { CharactersScreen } from './features/characters/characters-screen/characters-screen';

export const routes: Routes = [
  {
    path: '',
    component: AppShell,
    children: [
      { path: '', component: StoryScreen },
      { path: 'characters', component: CharactersScreen },
      {
        path: 'world',
        component: PlaceholderScreen,
        data: { title: 'World', description: 'Das lebende Welt-Dashboard: Datum, London Season, gesellschaftliche Stimmung, Wetter.' },
      },
      {
        path: 'relationships',
        component: PlaceholderScreen,
        data: { title: 'Relationships', description: 'Beziehungsnetz mit dem Spieler im Zentrum, qualitativ statt in Zahlen dargestellt.' },
      },
      {
        path: 'map',
        component: PlaceholderScreen,
        data: { title: 'Map', description: 'Regency-Karte mit Fog of Knowledge — unbekannte Orte werden erst durch Gespräche, Reisen oder Briefe sichtbar.' },
      },
      {
        path: 'estate',
        component: PlaceholderScreen,
        data: { title: 'Estate', description: 'Der Hof visuell: Haus, Scheune, Stall, Felder, Finanz-Ledger, Jahresrad.' },
      },
      {
        path: 'society',
        component: PlaceholderScreen,
        data: { title: 'Society', description: 'Der Ton: sozialer Zugang, Gesellschaftskalender, Einladungen, Lady Whistledown.' },
      },
      {
        path: 'letters',
        component: PlaceholderScreen,
        data: { title: 'Letters', description: 'Eingegangene und versandte Briefe, Entwürfe, Einladungen — kein E-Mail-Composer, ein Schreibtisch.' },
      },
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
