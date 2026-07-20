import { convertMoney, money, type Currency, type FxRates, type Money } from './money';

export interface Participant {
  readonly id: string;
  readonly name: string;
  readonly initials: string;
  readonly colour: string;
}

export interface Expense {
  readonly id: string;
  readonly description: string;
  readonly amount: Money;
  readonly paidBy: string;
  readonly sharedBy: string[];
  readonly category: 'stay' | 'food' | 'travel' | 'experience' | 'other';
  readonly createdAt: string;
}

export interface Balance {
  readonly participantId: string;
  readonly amount: Money;
}

export interface Settlement {
  readonly id: string;
  readonly from: string;
  readonly to: string;
  readonly amount: Money;
}

function splitMinorUnits(total: number, participantIds: readonly string[]): Map<string, number> {
  if (participantIds.length === 0) {
    throw new Error('An expense must be shared by at least one participant.');
  }

  const orderedIds = [...participantIds].sort();
  const baseShare = Math.trunc(total / orderedIds.length);
  let remainder = total - baseShare * orderedIds.length;

  return new Map(
    orderedIds.map((participantId) => {
      const extra = remainder > 0 ? 1 : remainder < 0 ? -1 : 0;
      remainder -= extra;
      return [participantId, baseShare + extra];
    }),
  );
}

export function calculateBalances(
  participants: readonly Participant[],
  expenses: readonly Expense[],
  baseCurrency: Currency,
  rates: FxRates,
): Balance[] {
  const totals = new Map(participants.map((participant) => [participant.id, 0]));

  expenses.forEach((expense) => {
    if (!totals.has(expense.paidBy)) {
      throw new Error(`Unknown payer: ${expense.paidBy}`);
    }

    const converted = convertMoney(expense.amount, baseCurrency, rates);
    const shares = splitMinorUnits(converted.minor, expense.sharedBy);
    totals.set(expense.paidBy, (totals.get(expense.paidBy) ?? 0) + converted.minor);

    shares.forEach((share, participantId) => {
      if (!totals.has(participantId)) {
        throw new Error(`Unknown participant: ${participantId}`);
      }

      totals.set(participantId, (totals.get(participantId) ?? 0) - share);
    });
  });

  return participants.map((participant) => ({
    participantId: participant.id,
    amount: money(totals.get(participant.id) ?? 0, baseCurrency),
  }));
}

/**
 * Produces a compact deterministic plan by matching the largest debtors and creditors.
 * It is intentionally described as "fewer transfers", not as a globally minimal solution.
 */
export function createSettlementPlan(balances: readonly Balance[]): Settlement[] {
  const creditors = balances
    .filter(({ amount }) => amount.minor > 0)
    .map(({ participantId, amount }) => ({ participantId, remaining: amount.minor }))
    .sort((a, b) => b.remaining - a.remaining || a.participantId.localeCompare(b.participantId));
  const debtors = balances
    .filter(({ amount }) => amount.minor < 0)
    .map(({ participantId, amount }) => ({ participantId, remaining: -amount.minor }))
    .sort((a, b) => b.remaining - a.remaining || a.participantId.localeCompare(b.participantId));

  const currency = balances[0]?.amount.currency ?? 'EUR';
  const settlements: Settlement[] = [];
  let creditorIndex = 0;
  let debtorIndex = 0;

  while (creditorIndex < creditors.length && debtorIndex < debtors.length) {
    const creditor = creditors[creditorIndex];
    const debtor = debtors[debtorIndex];

    if (!creditor || !debtor) {
      break;
    }

    const transferMinor = Math.min(creditor.remaining, debtor.remaining);
    settlements.push({
      id: `${debtor.participantId}-${creditor.participantId}-${settlements.length}`,
      from: debtor.participantId,
      to: creditor.participantId,
      amount: money(transferMinor, currency),
    });

    creditor.remaining -= transferMinor;
    debtor.remaining -= transferMinor;

    if (creditor.remaining === 0) creditorIndex += 1;
    if (debtor.remaining === 0) debtorIndex += 1;
  }

  return settlements;
}

export function totalInCurrency(
  expenses: readonly Expense[],
  currency: Currency,
  rates: FxRates,
): Money {
  const minor = expenses.reduce(
    (total, expense) => total + convertMoney(expense.amount, currency, rates).minor,
    0,
  );
  return money(minor, currency);
}
