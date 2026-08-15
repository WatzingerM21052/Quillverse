export type WorldEventCategory = 'social' | 'political' | 'local' | 'economic';

export interface WorldEvent {
  id: string;
  category: WorldEventCategory;
  title: string;
  description: string;
  date: string;
}

/** §38 — deliberately qualitative, not a stats table. */
export interface WorldStatus {
  londonSeasonStatus: string;
  socialMood: string;
  region: string;
  weather: string;
}
