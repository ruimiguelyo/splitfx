import { money } from '../../domain/money';
import { createAppStore } from '../../app/store';
import {
  addExpense,
  createInitialSplitFxState,
  expireQuote,
  refreshQuote,
  removeExpense,
  resetDemo,
  setNetwork,
  splitFxReducer,
} from './splitFxSlice';

describe('splitFxSlice', () => {
  it('adds a truthful user-created expense without mutating the original state', () => {
    const before = createInitialSplitFxState(1000);
    const after = splitFxReducer(
      before,
      addExpense({
        description: 'Coffee',
        amount: money(1600, 'EUR'),
        paidBy: 'rui',
        sharedBy: ['rui', 'maya'],
        category: 'food',
      }),
    );

    expect(after.expenses).toHaveLength(before.expenses.length + 1);
    expect(after.expenses[0]?.description).toBe('Coffee');
    expect(before.expenses[0]?.description).toBe('Apartment');
  });

  it('models quote expiry and offline recovery explicitly', () => {
    const initial = createInitialSplitFxState(1000);
    const expired = splitFxReducer(initial, expireQuote());
    const offline = splitFxReducer(expired, setNetwork('offline'));
    const recovered = splitFxReducer(offline, setNetwork('online'));

    expect(expired.quoteValidUntil).toBe(0);
    expect(offline.network).toBe('offline');
    expect(recovered.network).toBe('online');
  });

  it('removes an expense and restores the original demo deterministically', () => {
    const initial = createInitialSplitFxState(1000);
    const withoutDinner = splitFxReducer(initial, removeExpense('dinner'));
    expect(withoutDinner.expenses.some(({ id }) => id === 'dinner')).toBe(false);

    const reset = splitFxReducer(withoutDinner, resetDemo());
    expect(reset.expenses.some(({ id }) => id === 'dinner')).toBe(true);
    expect(reset.quoteRequest).toBe('idle');
    expect(reset.quoteError).toBeNull();
  });

  it('refreshes an online quote and exposes its loading transition', async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-07-20T12:00:00.000Z'));
    const store = createAppStore();

    const refresh = store.dispatch(refreshQuote());
    expect(store.getState().splitFx.quoteRequest).toBe('loading');

    jest.advanceTimersByTime(550);
    const action = await refresh;

    expect(refreshQuote.fulfilled.match(action)).toBe(true);
    expect(store.getState().splitFx).toMatchObject({
      quoteRequest: 'idle',
      quoteError: null,
      quoteUpdatedAt: Date.parse('2026-07-20T12:00:00.550Z'),
      quoteValidUntil: Date.parse('2026-07-20T12:05:00.550Z'),
    });
    jest.useRealTimers();
  });

  it('rejects an offline refresh with actionable copy and clears it on reconnect', async () => {
    const store = createAppStore();
    store.dispatch(setNetwork('offline'));

    const action = await store.dispatch(refreshQuote());
    expect(refreshQuote.rejected.match(action)).toBe(true);
    expect(action.payload).toBe('Reconnect to refresh this quote.');
    expect(store.getState().splitFx).toMatchObject({
      quoteRequest: 'failed',
      quoteError: 'Reconnect to refresh this quote.',
    });

    store.dispatch(setNetwork('online'));
    expect(store.getState().splitFx.quoteError).toBeNull();
  });

  it('clears the refresh timer and uses fallback copy when a request is aborted', async () => {
    jest.useFakeTimers();
    const clearTimeout = jest.spyOn(window, 'clearTimeout');
    const store = createAppStore();

    const refresh = store.dispatch(refreshQuote());
    refresh.abort();
    const action = await refresh;

    expect(refreshQuote.rejected.match(action)).toBe(true);
    if (!refreshQuote.rejected.match(action)) {
      throw new Error('Expected an aborted refresh to dispatch a rejected action.');
    }
    expect(action.meta.aborted).toBe(true);
    expect(clearTimeout).toHaveBeenCalled();
    expect(store.getState().splitFx).toMatchObject({
      quoteRequest: 'failed',
      quoteError: 'The quote could not be refreshed.',
    });

    clearTimeout.mockRestore();
    jest.useRealTimers();
  });
});
