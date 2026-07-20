import { money } from '../../domain/money';
import type { Expense, Participant } from '../../domain/settlements';

export const demoParticipants: Participant[] = [
  { id: 'rui', name: 'Rui', initials: 'RS', colour: '#c7ff63' },
  { id: 'maya', name: 'Maya', initials: 'MK', colour: '#8fa8ff' },
  { id: 'sam', name: 'Sam', initials: 'SO', colour: '#ffad99' },
  { id: 'alex', name: 'Alex', initials: 'AN', colour: '#77d7c8' },
];

export const demoExpenses: Expense[] = [
  {
    id: 'apartment',
    description: 'Apartment',
    amount: money(62480, 'EUR'),
    paidBy: 'rui',
    sharedBy: ['rui', 'maya', 'sam', 'alex'],
    category: 'stay',
    createdAt: '2026-07-17T11:30:00.000Z',
  },
  {
    id: 'dinner',
    description: 'Welcome dinner',
    amount: money(15640, 'GBP'),
    paidBy: 'maya',
    sharedBy: ['rui', 'maya', 'sam', 'alex'],
    category: 'food',
    createdAt: '2026-07-18T20:15:00.000Z',
  },
  {
    id: 'trains',
    description: 'Airport trains',
    amount: money(21200, 'USD'),
    paidBy: 'alex',
    sharedBy: ['rui', 'sam', 'alex'],
    category: 'travel',
    createdAt: '2026-07-18T08:45:00.000Z',
  },
  {
    id: 'museum',
    description: 'Design museum',
    amount: money(7450, 'EUR'),
    paidBy: 'sam',
    sharedBy: ['rui', 'maya', 'sam', 'alex'],
    category: 'experience',
    createdAt: '2026-07-19T14:20:00.000Z',
  },
];

export const demoRates = {
  EUR: 1,
  GBP: 0.86,
  USD: 1.08,
} as const;
