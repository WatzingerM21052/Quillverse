/**
 * Numbers are internal only — the player-facing UI must speak in qualitative
 * language, never raw scores (§35, §115).
 */
export function describeDimension(value: number): string {
  if (value >= 90) return 'außergewöhnlich stark';
  if (value >= 75) return 'deutlich ausgeprägt';
  if (value >= 55) return 'spürbar wachsend';
  if (value >= 35) return 'vorsichtig wachsend';
  if (value >= 15) return 'gerade erst entstehend';
  return 'kaum vorhanden';
}
