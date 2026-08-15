export type InvitationAccess = 'not-invited' | 'invited' | 'attended' | 'unknown';

/** §52 — an elegant invitation card, not a generic event-list row. */
export interface SocialCalendarEntry {
  id: string;
  title: string;
  date: string;
  host: string;
  location: string;
  access: InvitationAccess;
}
