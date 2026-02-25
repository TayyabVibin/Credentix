import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice.ts';
import walletReducer from './walletSlice.ts';
import paymentsReducer from './paymentsSlice.ts';
import adminReducer from './adminSlice.ts';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    wallet: walletReducer,
    payments: paymentsReducer,
    admin: adminReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
