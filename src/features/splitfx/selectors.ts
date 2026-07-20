import { createSelector } from '@reduxjs/toolkit';
import { calculateBalances, createSettlementPlan, totalInCurrency } from '../../domain/settlements';
import type { RootState } from '../../app/store';

export const selectSplitFx = (state: RootState) => state.splitFx;
export const selectParticipants = (state: RootState) => state.splitFx.participants;
export const selectExpenses = (state: RootState) => state.splitFx.expenses;

export const selectBalances = createSelector([selectSplitFx], (splitFx) =>
  calculateBalances(splitFx.participants, splitFx.expenses, splitFx.baseCurrency, splitFx.rates),
);

export const selectSettlementPlan = createSelector([selectBalances], (balances) =>
  createSettlementPlan(balances),
);

export const selectTripTotal = createSelector([selectSplitFx], (splitFx) =>
  totalInCurrency(splitFx.expenses, splitFx.baseCurrency, splitFx.rates),
);

export const selectParticipantMap = createSelector([selectParticipants], (participants) =>
  Object.fromEntries(participants.map((participant) => [participant.id, participant])),
);

export type QuoteHealth = 'live' | 'expired' | 'offline' | 'loading' | 'error';

export function selectQuoteHealth(state: RootState, now = Date.now()): QuoteHealth {
  if (state.splitFx.network === 'offline') return 'offline';
  if (state.splitFx.quoteRequest === 'loading') return 'loading';
  if (state.splitFx.quoteRequest === 'failed') return 'error';
  if (now >= state.splitFx.quoteValidUntil) return 'expired';
  return 'live';
}
