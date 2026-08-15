import { EntityId } from './entity-id';

/** Rendered like a ledger book, never like online banking (§49). Positive = income. */
export interface FinanceTransaction {
  id: EntityId;
  date: string;
  description: string;
  amount: number;
}
