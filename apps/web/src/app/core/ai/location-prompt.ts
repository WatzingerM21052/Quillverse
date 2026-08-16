import { Location } from '../state/models/location.model';

/** Loose scene-setting per location type — richer than the seed data's bare name/type alone. */
const SCENE_BY_TYPE: Record<string, string> = {
  farm: 'a modest tenant farm in the rural English countryside: thatched-roof farmhouse, barn, fenced fields, farm animals',
  market: 'a small English village market square: market stalls, half-timbered buildings, cobblestone, villagers going about their day',
  city: 'a Regency-era London street: elegant townhouses, cobblestone road, carriages, well-dressed passersby',
  estate: 'a grand English country estate: manor house with columned facade, manicured gardens, long gravel drive',
};

/**
 * §19 (issue) / A15 Ortsbibliothek — mirrors buildPortraitPrompt's structure
 * (world pack style bible + specific subject description) but for a
 * Location instead of a Character. No identity-consistency concern here,
 * so no reference-image machinery — just a good, specific scene prompt.
 */
export function buildLocationPrompt(location: Location, visualStyleBible: string): string {
  const scene = SCENE_BY_TYPE[location.type] ?? `a Regency-era English location: ${location.name}`;
  return [
    visualStyleBible,
    `Wide establishing shot, no people in focus, ${scene}.`,
    `This is "${location.name}".`,
    'Landscape/establishing composition, no text or logos.',
  ]
    .filter(Boolean)
    .join(' ');
}
