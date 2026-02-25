import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/client.ts';

interface PurchaseResponse {
  paymentId: string;
  merchantReference: string;
  sessionId: string;
  sessionData: string;
  clientKey: string;
  environment: string;
}

interface PaymentsState {
  currentPurchase: PurchaseResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: PaymentsState = {
  currentPurchase: null,
  loading: false,
  error: null,
};

export const initiatePurchase = createAsyncThunk(
  'payments/initiate',
  async (
    data: { bundleId: string; returnUrl: string },
    { rejectWithValue },
  ) => {
    try {
      const res = await api.post('/wallet/purchase', data);
      return res.data as PurchaseResponse;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(error.response?.data?.message ?? 'Purchase failed');
    }
  },
);

const paymentsSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    clearPurchase(state) {
      state.currentPurchase = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initiatePurchase.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initiatePurchase.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPurchase = action.payload;
      })
      .addCase(initiatePurchase.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearPurchase } = paymentsSlice.actions;
export default paymentsSlice.reducer;
