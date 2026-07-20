import { configureStore } from '@reduxjs/toolkit';
import { splitFxReducer } from '../features/splitfx/splitFxSlice';

export function createAppStore() {
  return configureStore({
    reducer: {
      splitFx: splitFxReducer,
    },
  });
}

export const store = createAppStore();

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
