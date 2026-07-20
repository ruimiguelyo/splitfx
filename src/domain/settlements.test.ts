import { money } from './money';
import {
  calculateBalances,
  createSettlementPlan,
  totalInCurrency,
  type Expense,
  type Participant,
} from './settlements';

const participants: Participant[] = [
  { id: 'rui', name: 'Rui', initials: 'RS', colour: '#c7ff63' },
  { id: 'maya', name: 'Maya', initials: 'MK', colour: '#8fa8ff' },
  { id: 'sam', name: 'Sam', initials: 'SO', colour: '#ffb4a5' },
];

const rates = { EUR: 1, GBP: 0.8, USD: 1.1 } as const;

describe('settlement domain', () => {
  it('keeps the accounting invariant at exactly zero minor units', () => {
    const expenses: Expense[] = [
      {
        id: 'dinner',
        description: 'Dinner',
        amount: money(9001, 'EUR'),
        paidBy: 'rui',
        sharedBy: ['rui', 'maya', 'sam'],
        category: 'food',
        createdAt: '2026-07-20T18:00:00.000Z',
      },
    ];

    const balances = calculateBalances(participants, expenses, 'EUR', rates);
    expect(balances.reduce((sum, balance) => sum + balance.amount.minor, 0)).toBe(0);
  });

  it('converts mixed currencies before splitting', () => {
    const expenses: Expense[] = [
      {
        id: 'stay',
        description: 'Stay',
        amount: money(8000, 'GBP'),
        paidBy: 'maya',
        sharedBy: ['rui', 'maya'],
        category: 'stay',
        createdAt: '2026-07-20T18:00:00.000Z',
      },
    ];

    expect(calculateBalances(participants.slice(0, 2), expenses, 'EUR', rates)).toEqual([
      { participantId: 'rui', amount: money(-5000, 'EUR') },
      { participantId: 'maya', amount: money(5000, 'EUR') },
    ]);
  });

  it('creates transfers that fully settle every balance without self-transfers', () => {
    const balances = [
      { participantId: 'rui', amount: money(7000, 'EUR') },
      { participantId: 'maya', amount: money(-5000, 'EUR') },
      { participantId: 'sam', amount: money(-2000, 'EUR') },
    ];

    const plan = createSettlementPlan(balances);
    expect(plan).toHaveLength(2);
    expect(plan.every((transfer) => transfer.from !== transfer.to)).toBe(true);
    expect(plan.reduce((sum, transfer) => sum + transfer.amount.minor, 0)).toBe(7000);
  });

  it('rejects expenses with no people sharing them', () => {
    const expense: Expense = {
      id: 'invalid',
      description: 'Nobody owes this',
      amount: money(1000, 'EUR'),
      paidBy: 'rui',
      sharedBy: [],
      category: 'other',
      createdAt: '2026-07-20T18:00:00.000Z',
    };

    expect(() => calculateBalances(participants, [expense], 'EUR', rates)).toThrow(
      /at least one participant/i,
    );
  });

  it('rejects unknown payers and unknown sharing participants', () => {
    const baseExpense: Expense = {
      id: 'invalid-membership',
      description: 'Invalid membership',
      amount: money(1000, 'EUR'),
      paidBy: 'ghost',
      sharedBy: ['rui'],
      category: 'other',
      createdAt: '2026-07-20T18:00:00.000Z',
    };

    expect(() => calculateBalances(participants, [baseExpense], 'EUR', rates)).toThrow(
      'Unknown payer: ghost',
    );
    expect(() =>
      calculateBalances(
        participants,
        [{ ...baseExpense, paidBy: 'rui', sharedBy: ['ghost'] }],
        'EUR',
        rates,
      ),
    ).toThrow('Unknown participant: ghost');
  });

  it('distributes negative remainder units deterministically by participant id', () => {
    const refund: Expense = {
      id: 'refund',
      description: 'Refund',
      amount: money(-100, 'EUR'),
      paidBy: 'rui',
      sharedBy: ['sam', 'rui', 'maya'],
      category: 'other',
      createdAt: '2026-07-20T18:00:00.000Z',
    };

    expect(calculateBalances(participants, [refund], 'EUR', rates)).toEqual([
      { participantId: 'rui', amount: money(-67, 'EUR') },
      { participantId: 'maya', amount: money(34, 'EUR') },
      { participantId: 'sam', amount: money(33, 'EUR') },
    ]);
  });

  it('orders equal creditors and debtors by id for repeatable transfer ids', () => {
    const plan = createSettlementPlan([
      { participantId: 'z-creditor', amount: money(500, 'EUR') },
      { participantId: 'a-creditor', amount: money(500, 'EUR') },
      { participantId: 'z-debtor', amount: money(-500, 'EUR') },
      { participantId: 'a-debtor', amount: money(-500, 'EUR') },
    ]);

    expect(plan.map(({ id }) => id)).toEqual(['a-debtor-a-creditor-0', 'z-debtor-z-creditor-1']);
    expect(createSettlementPlan([])).toEqual([]);
  });

  it('totals mixed-currency expenses in the requested currency', () => {
    const expenses: Expense[] = [
      {
        id: 'eur',
        description: 'EUR expense',
        amount: money(1000, 'EUR'),
        paidBy: 'rui',
        sharedBy: ['rui'],
        category: 'other',
        createdAt: '2026-07-20T18:00:00.000Z',
      },
      {
        id: 'gbp',
        description: 'GBP expense',
        amount: money(800, 'GBP'),
        paidBy: 'maya',
        sharedBy: ['maya'],
        category: 'other',
        createdAt: '2026-07-20T18:00:00.000Z',
      },
    ];

    expect(totalInCurrency(expenses, 'EUR', rates)).toEqual(money(2000, 'EUR'));
  });
});
