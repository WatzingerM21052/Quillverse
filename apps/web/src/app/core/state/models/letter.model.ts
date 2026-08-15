import { EntityId } from './entity-id';

export type LetterStatus = 'written' | 'sent' | 'in-transit' | 'delivered' | 'answered' | 'lost';

export interface Letter {
  id: EntityId;
  senderId: EntityId;
  recipientId: EntityId;
  dateWritten: string;
  dateSent: string | null;
  dateArrived: string | null;
  content: string;
  status: LetterStatus;
  knownBy: EntityId[];
}
