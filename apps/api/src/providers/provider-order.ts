import { PROVIDER_IDS, type ProviderId } from './types';

/**
 * B50 Manual Narrator switch — re-roots the A32 automatic-fallback
 * iteration at the player's chosen provider (if it's a real, known
 * provider id), preserving the rest of the list as the fallback chain
 * afterward, unchanged. Falls back to the original order untouched when no
 * preference is given or the given one isn't recognized.
 */
export function orderProviders(
  preferred: string | null | undefined,
  all: readonly ProviderId[] = PROVIDER_IDS,
): ProviderId[] {
  const match = all.find((id) => id === preferred);
  if (!match) return [...all];
  return [match, ...all.filter((id) => id !== match)];
}
