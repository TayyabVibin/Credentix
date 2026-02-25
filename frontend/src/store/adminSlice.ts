import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/client.ts';

interface AdminPaymentListItem {
  id: string;
  userId: string;
  userEmail: string;
  merchantReference: string;
  pspReference: string | null;
  amountMinor: number;
  currency: string;
  status: string;
  createdAt: string;
}

interface AdminPaymentEvent {
  id: string;
  fromStatus: string | null;
  toStatus: string;
  eventSource: string;
  createdAt: string;
}

interface AdminPaymentDetail extends AdminPaymentListItem {
  paymentMethodType: string | null;
  failureReason: string | null;
  authorizedAt: string | null;
  capturedAt: string | null;
  events: AdminPaymentEvent[];
}

interface AdminMetrics {
  dailyVolume: { date: string; amountMinor: number }[];
  totalVolume7d: number;
  successRate: number;
  pendingCount: number;
  authorizedCount: number;
  capturedCount: number;
}

interface AdminWebhookLog {
  id: string;
  pspReference: string | null;
  eventCode: string;
  success: boolean;
  processedAt: string | null;
  errorMessage: string | null;
  createdAt: string;
}

interface AdminPaymentsQuery {
  page?: number;
  limit?: number;
  status?: string;
  currency?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

interface AdminState {
  payments: AdminPaymentListItem[];
  paymentsTotal: number;
  paymentsPage: number;
  paymentsPages: number;
  paymentDetail: AdminPaymentDetail | null;
  metrics: AdminMetrics | null;
  webhookLogs: AdminWebhookLog[];
  webhookTotal: number;
  webhookPage: number;
  webhookPages: number;
  loading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  payments: [],
  paymentsTotal: 0,
  paymentsPage: 1,
  paymentsPages: 1,
  paymentDetail: null,
  metrics: null,
  webhookLogs: [],
  webhookTotal: 0,
  webhookPage: 1,
  webhookPages: 1,
  loading: false,
  error: null,
};

export const fetchAdminPayments = createAsyncThunk(
  'admin/fetchPayments',
  async (query: AdminPaymentsQuery) => {
    const params = new URLSearchParams();
    if (query.page) params.set('page', String(query.page));
    if (query.limit) params.set('limit', String(query.limit));
    if (query.status) params.set('status', query.status);
    if (query.currency) params.set('currency', query.currency);
    if (query.search) params.set('search', query.search);
    if (query.dateFrom) params.set('dateFrom', query.dateFrom);
    if (query.dateTo) params.set('dateTo', query.dateTo);
    const res = await api.get(`/admin/payments?${params.toString()}`);
    return res.data as {
      payments: AdminPaymentListItem[];
      total: number;
      page: number;
      pages: number;
    };
  },
);

export const fetchPaymentDetail = createAsyncThunk(
  'admin/fetchPaymentDetail',
  async (id: string) => {
    const res = await api.get(`/admin/payments/${id}`);
    return res.data as AdminPaymentDetail;
  },
);

export const fetchAdminMetrics = createAsyncThunk('admin/fetchMetrics', async () => {
  const res = await api.get('/admin/metrics');
  return res.data as AdminMetrics;
});

export const fetchAdminWebhooks = createAsyncThunk(
  'admin/fetchWebhooks',
  async ({ page, limit }: { page: number; limit: number }) => {
    const res = await api.get(`/admin/webhooks?page=${page}&limit=${limit}`);
    return res.data as {
      logs: AdminWebhookLog[];
      total: number;
      page: number;
      pages: number;
    };
  },
);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearPaymentDetail(state) {
      state.paymentDetail = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload.payments;
        state.paymentsTotal = action.payload.total;
        state.paymentsPage = action.payload.page;
        state.paymentsPages = action.payload.pages;
      })
      .addCase(fetchAdminPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch payments';
      })
      .addCase(fetchPaymentDetail.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPaymentDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentDetail = action.payload;
      })
      .addCase(fetchPaymentDetail.rejected, (state) => {
        state.loading = false;
        state.paymentDetail = null;
      })
      .addCase(fetchAdminMetrics.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminMetrics.fulfilled, (state, action) => {
        state.loading = false;
        state.metrics = action.payload;
      })
      .addCase(fetchAdminMetrics.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchAdminWebhooks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminWebhooks.fulfilled, (state, action) => {
        state.loading = false;
        state.webhookLogs = action.payload.logs;
        state.webhookTotal = action.payload.total;
        state.webhookPage = action.payload.page;
        state.webhookPages = action.payload.pages;
      })
      .addCase(fetchAdminWebhooks.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { clearPaymentDetail } = adminSlice.actions;
export default adminSlice.reducer;
