import { useState, useMemo, useEffect, lazy, Suspense } from 'react';
import { useSnackbar } from 'notistack';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { lightTheme, darkTheme } from './theme.ts';
import Layout from './components/Layout.tsx';
import AdminLayout from './components/AdminLayout.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import AdminRoute from './components/AdminRoute.tsx';
import { useAppDispatch, useAppSelector } from './store/hooks.ts';
import { fetchProfile } from './store/authSlice.ts';
import { API_ERROR_EVENT } from './utils/apiErrorEvent.ts';

const HomePage = lazy(() => import('./pages/HomePage.tsx'));
const LoginPage = lazy(() => import('./pages/LoginPage.tsx'));
const RegisterPage = lazy(() => import('./pages/RegisterPage.tsx'));
const WalletPage = lazy(() => import('./pages/WalletPage.tsx'));
const PurchasePage = lazy(() => import('./pages/PurchasePage.tsx'));
const PurchaseProcessingPage = lazy(() => import('./pages/PurchaseProcessingPage.tsx'));
const TransactionsPage = lazy(() => import('./pages/TransactionsPage.tsx'));
const ProfilePage = lazy(() => import('./pages/ProfilePage.tsx'));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage.tsx'));
const AdminPaymentsPage = lazy(() => import('./pages/admin/AdminPaymentsPage.tsx'));
const AdminPaymentDetailPage = lazy(() => import('./pages/admin/AdminPaymentDetailPage.tsx'));
const AdminWebhooksPage = lazy(() => import('./pages/admin/AdminWebhooksPage.tsx'));

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
              <Route element={<Layout themeMode={mode} onThemeToggle={toggleTheme} />}>
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
