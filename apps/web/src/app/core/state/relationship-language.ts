import { AttentionLevel, RelationshipMomentum } from './models/relationship.model';

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

const MOMENTUM_LABELS: Record<RelationshipMomentum, string> = {
  'strongly-positive-rising': 'stark aufblühend',
  'positive-rising': 'im Aufschwung',
  'slightly-positive': 'leicht positiv',
  stable: 'stabil',
  'slightly-negative': 'leicht angespannt',
  'negative-rising': 'zunehmend angespannt',
  'strongly-negative': 'stark belastet',
};

export function describeMomentum(momentum: RelationshipMomentum): string {
  return MOMENTUM_LABELS[momentum];
}

const ATTENTION_LABELS: Record<AttentionLevel, string> = {
  'practically-none': 'kaum Beachtung',
  low: 'wenig Beachtung',
  occasional: 'gelegentliche Beachtung',
  medium: 'spürbare Beachtung',
  high: 'große Beachtung',
  'very-high': 'ständig in Gedanken',
};

export function describeAttention(attention: AttentionLevel): string {
  return ATTENTION_LABELS[attention];
}
