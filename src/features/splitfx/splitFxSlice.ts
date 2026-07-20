import { createAsyncThunk, createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit';
import type { Currency, FxRates, Money } from '../../domain/money';
import type { Expense, Participant } from '../../domain/settlements';
import { demoExpenses, demoParticipants, demoRates } from './demoData';

export type NetworkState = 'online' | 'offline';
export type QuoteRequestState = 'idle' | 'loading' | 'failed';

export interface SplitFxState {
  readonly groupName: string;
  readonly baseCurrency: Currency;
  readonly participants: Participant[];
  readonly expenses: Expense[];
  readonly rates: FxRates;
  readonly quoteUpdatedAt: number;
  readonly quoteValidUntil: number;
  readonly network: NetworkState;
  readonly quoteRequest: QuoteRequestState;
  readonly quoteError: string | null;
}

export interface NewExpense {
  readonly description: string;
  readonly amount: Money;
  readonly paidBy: string;
  readonly sharedBy: readonly string[];
  readonly category: Expense['category'];
}

const QUOTE_LIFETIME_MS = 5 * 60 * 1000;

export function createInitialSplitFxState(now = Date.now()): SplitFxState {
  return {
    groupName: 'Lisbon design weekend',
    baseCurrency: 'EUR',
    participants: demoParticipants,
    expenses: demoExpenses,
    rates: demoRates,
    quoteUpdatedAt: now,
    quoteValidUntil: now + QUOTE_LIFETIME_MS,
    network: 'online',
    quoteRequest: 'idle',
    quoteError: null,
  };
}

export const refreshQuote = createAsyncThunk<
  { rates: FxRates; updatedAt: number; validUntil: number },
  void,
  { state: { splitFx: SplitFxState }; rejectValue: string }
>('splitFx/refreshQuote', async (_, { getState, rejectWithValue, signal }) => {
  if (getState().splitFx.network === 'offline') {
    return rejectWithValue('Reconnect to refresh this quote.');
  }

  await new Promise<void>((resolve, reject) => {
    const timeout = window.setTimeout(resolve, 550);
    signal.addEventListener('abort', () => {
      window.clearTimeout(timeout);
      reject(new DOMException('Aborted', 'AbortError'));
    });
  });

  const updatedAt = Date.now();
  return {
    rates: demoRates,
    updatedAt,
    validUntil: updatedAt + QUOTE_LIFETIME_MS,
  };
});

const splitFxSlice = createSlice({
  name: 'splitFx',
  initialState: createInitialSplitFxState(),
  reducers: {
    addExpense: {
      reducer(state, action: PayloadAction<Expense>) {
        state.expenses.unshift(action.payload);
      },
      prepare(expense: NewExpense) {
        return {
          payload: {
            ...expense,
            sharedBy: [...expense.sharedBy],
            id: nanoid(),
            createdAt: new Date().toISOString(),
          },
        };
      },
    },
    removeExpense(state, action: PayloadAction<string>) {
      state.expenses = state.expenses.filter((expense) => expense.id !== action.payload);
    },
    expireQuote(state) {
      state.quoteValidUntil = 0;
    },
    setNetwork(state, action: PayloadAction<NetworkState>) {
      state.network = action.payload;
      if (action.payload === 'online') {
        state.quoteError = null;
      }
    },
    resetDemo() {
      return createInitialSplitFxState();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(refreshQuote.pending, (state) => {
        state.quoteRequest = 'loading';
        state.quoteError = null;
      })
      .addCase(refreshQuote.fulfilled, (state, action) => {
        state.quoteRequest = 'idle';
        state.rates = action.payload.rates;
        state.quoteUpdatedAt = action.payload.updatedAt;
        state.quoteValidUntil = action.payload.validUntil;
      })
      .addCase(refreshQuote.rejected, (state, action) => {
        state.quoteRequest = 'failed';
        state.quoteError = action.payload ?? 'The quote could not be refreshed.';
      });
  },
});

export const { addExpense, expireQuote, removeExpense, resetDemo, setNetwork } =
  splitFxSlice.actions;
export const splitFxReducer = splitFxSlice.reducer;
