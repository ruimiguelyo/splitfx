import { createAppStore } from '../../app/store';
import { expireQuote, refreshQuote, setNetwork } from './splitFxSlice';
import {
  selectBalances,
  selectExpenses,
  selectParticipantMap,
  selectParticipants,
  selectQuoteHealth,
  selectSettlementPlan,
  selectTripTotal,
} from './selectors';

describe('SplitFX selectors', () => {
  it('derives a balanced, compact settlement plan from the real store', () => {
    const store = createAppStore();
    const state = store.getState();
    const balances = selectBalances(state);
    const plan = selectSettlementPlan(state);

    expect(balances.reduce((total, balance) => total + balance.amount.minor, 0)).toBe(0);
    expect(plan.length).toBeGreaterThan(0);
    expect(plan.length).toBeLessThan(state.splitFx.participants.length);
  });

  it('prioritises offline state over stale quote state', () => {
    const store = createAppStore();
    store.dispatch(expireQuote());
    expect(selectQuoteHealth(store.getState(), Date.now())).toBe('expired');
    store.dispatch(setNetwork('offline'));
    expect(selectQuoteHealth(store.getState(), Date.now())).toBe('offline');
  });

  it('derives the total, participant lookup, and source collections', () => {
    const store = createAppStore();
    const state = store.getState();

    expect(selectTripTotal(state).minor).toBeGreaterThan(0);
    expect(selectTripTotal(state).currency).toBe('EUR');
    expect(selectParticipantMap(state).rui).toMatchObject({ name: 'Rui', initials: 'RS' });
    expect(selectParticipants(state)).toBe(state.splitFx.participants);
    expect(selectExpenses(state)).toBe(state.splitFx.expenses);
  });

  it('reports loading and error before checking expiry', () => {
    const loadingStore = createAppStore();
    loadingStore.dispatch({ type: refreshQuote.pending.type });
    expect(selectQuoteHealth(loadingStore.getState(), Number.MAX_SAFE_INTEGER)).toBe('loading');

    const errorStore = createAppStore();
    errorStore.dispatch({ type: refreshQuote.rejected.type });
    expect(selectQuoteHealth(errorStore.getState(), Number.MAX_SAFE_INTEGER)).toBe('error');

    const liveStore = createAppStore();
    expect(selectQuoteHealth(liveStore.getState(), 0)).toBe('live');
  });
});
