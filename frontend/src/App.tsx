import { useState, useMemo, useEffect, lazy, Suspense } from 'react';
import { useSnackbar } from 'notistack';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { lightTheme, darkTheme } from './design-system/theme';
import { MainLayout, AdminLayout, ProtectedRoute, AdminRoute } from './layout';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { fetchProfile } from './store/authSlice';
import { API_ERROR_EVENT } from './utils/apiErrorEvent';

const HomePage = lazy(() => import('./features/landing/HomePage'));
const LoginPage = lazy(() => import('./features/auth/LoginPage'));
const RegisterPage = lazy(() => import('./features/auth/RegisterPage'));
const WalletPage = lazy(() => import('./features/wallet/WalletPage'));
const PurchasePage = lazy(() => import('./features/purchase/PurchasePage'));
const PurchaseProcessingPage = lazy(() => import('./features/purchase/PurchaseProcessingPage'));
const TransactionsPage = lazy(() => import('./features/transactions/TransactionsPage'));
const ProfilePage = lazy(() => import('./features/profile/ProfilePage'));
const AdminDashboardPage = lazy(() => import('./features/admin/AdminDashboardPage'));
const AdminPaymentsPage = lazy(() => import('./features/admin/AdminPaymentsPage'));
const AdminPaymentDetailPage = lazy(() => import('./features/admin/AdminPaymentDetailPage'));
const AdminWebhooksPage = lazy(() => import('./features/admin/AdminWebhooksPage'));

function LoadingFallback() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
      <CircularProgress />
    </Box>
  );
}

export default function App() {
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('credentix_theme');
    return (saved === 'light' ? 'light' : 'dark');
  });

  const theme = useMemo(() => (mode === 'dark' ? darkTheme : lightTheme), [mode]);

  const toggleTheme = () => {
    setMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('credentix_theme', next);
      return next;
    });
  };

  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (isAuthenticated && !user) {
      dispatch(fetchProfile());
    }
  }, [isAuthenticated, user, dispatch]);

  useEffect(() => {
    const handler = (e: CustomEvent<{ message: string }>) => {
      enqueueSnackbar(e.detail.message, { variant: 'error' });
    };
    window.addEventListener(API_ERROR_EVENT, handler as EventListener);
    return () => window.removeEventListener(API_ERROR_EVENT, handler as EventListener);
  }, [enqueueSnackbar]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout themeMode={mode} onThemeToggle={toggleTheme} />}>
                <Route path="/wallet" element={<WalletPage />} />
                <Route path="/purchase" element={<PurchasePage />} />
                <Route path="/purchase/processing" element={<PurchaseProcessingPage />} />
                <Route path="/purchase/return" element={<PurchaseProcessingPage />} />
                <Route path="/transactions" element={<TransactionsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Route>

              <Route element={<AdminRoute />}>
                <Route element={<AdminLayout themeMode={mode} onThemeToggle={toggleTheme} />}>
                  <Route path="/admin" element={<AdminDashboardPage />} />
                  <Route path="/admin/payments" element={<AdminPaymentsPage />} />
                  <Route path="/admin/payments/:id" element={<AdminPaymentDetailPage />} />
                  <Route path="/admin/webhooks" element={<AdminWebhooksPage />} />
                </Route>
              </Route>
            </Route>

            <Route path="*" element={<Navigate to={isAuthenticated ? '/wallet' : '/'} replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  );
}
