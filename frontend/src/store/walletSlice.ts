import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/client.ts';

interface LedgerEntry {
  id: string;
  credits: number;
  balanceAfter: number;
  paymentId: string;
  createdAt: string;
}

interface WalletState {
  balance: number;
  recentTransactions: LedgerEntry[];
  transactions: LedgerEntry[];
  totalTransactions: number;
  currentPage: number;
  totalPages: number;
  loading: boolean;
}

const initialState: WalletState = {
  balance: 0,
  recentTransactions: [],
  transactions: [],
  totalTransactions: 0,
  currentPage: 1,
  totalPages: 1,
  loading: false,
};

export const fetchWallet = createAsyncThunk('wallet/fetch', async () => {
  const res = await api.get('/wallet');
  return res.data as { balance: number; recentTransactions: LedgerEntry[] };
});

export const fetchTransactions = createAsyncThunk(
  'wallet/fetchTransactions',
  async ({ page, limit }: { page: number; limit: number }) => {
    const res = await api.get(`/wallet/transactions?page=${page}&limit=${limit}`);
    return res.data as {
      entries: LedgerEntry[];
      total: number;
      page: number;
      pages: number;
    };
  },
);

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWallet.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWallet.fulfilled, (state, action) => {
        state.loading = false;
        state.balance = action.payload.balance;
        state.recentTransactions = action.payload.recentTransactions;
      })
      .addCase(fetchWallet.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload.entries;
        state.totalTransactions = action.payload.total;
        state.currentPage = action.payload.page;
        state.totalPages = action.payload.pages;
      })
      .addCase(fetchTransactions.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default walletSlice.reducer;
