import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from 'lottie-react';
import PageTransition from '../components/PageTransition.tsx';
import AdyenDropin from '../components/AdyenDropin.tsx';
import { useAppDispatch, useAppSelector } from '../store/hooks.ts';
import { fetchWallet } from '../store/walletSlice.ts';
import { clearPurchase } from '../store/paymentsSlice.ts';
import successAnimation from '../assets/animations/gopay succesfull payment.json';
import failedAnimation from '../assets/animations/Failed.json';
import processingAnimation from '../assets/animations/Card payment in Process.json';

type PaymentStatus = 'checkout' | 'processing' | 'success' | 'failed' | 'error';

const SUCCESS_CODES = ['Authorised', 'Received'];

export default function PurchaseProcessingPage() {
  const [status, setStatus] = useState<PaymentStatus>('checkout');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentPurchase } = useAppSelector((s) => s.payments);

  const handlePaymentCompleted = useCallback(
    (resultCode: string) => {
      if (SUCCESS_CODES.includes(resultCode)) {
        setStatus('success');
        dispatch(fetchWallet());
      } else {
        setErrorMsg(`Payment ${resultCode.toLowerCase()}.`);
        setStatus('failed');
      }
    },
    [dispatch],
  );

  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (status !== 'success') return;
    let elapsed = 0;
    const POLL_MS = 2500;
    const MAX_POLL_MS = 15000;
    pollIntervalRef.current = setInterval(() => {
      elapsed += POLL_MS;
      dispatch(fetchWallet());
      if (elapsed >= MAX_POLL_MS && pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    }, POLL_MS);
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };
  }, [status, dispatch]);

  const handleError = useCallback((error: unknown) => {
    const msg =
      error instanceof Error
        ? error.message
        : typeof error === 'object' && error !== null && 'message' in error
          ? String((error as { message: unknown }).message)
          : String(error);
    const isFailedFetch = /failed to fetch|typeerror.*fetch/i.test(msg);
    const helpfulMsg = isFailedFetch
      ? 'Unable to connect to the payment provider. Add your origin (e.g. http://localhost:5173) to Adyen Customer Area > API credentials > Allowed origins. Also try disabling ad blockers.'
      : msg;
    setErrorMsg(helpfulMsg);
    setStatus('error');
  }, []);

  const handleRetry = () => {
    dispatch(clearPurchase());
    navigate('/purchase');
  };

  if (!currentPurchase) {
    return (
      <PageTransition>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
          <Card
            sx={{
              maxWidth: 520,
              width: '100%',
              textAlign: 'center',
              backdropFilter: 'blur(20px)',
              bgcolor: 'rgba(30,41,59,0.7)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <CardContent sx={{ py: 6 }}>
              <Typography variant="h5" gutterBottom>
                No Active Payment
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                Please select a credit bundle first.
              </Typography>
              <Button variant="contained" size="large" onClick={() => navigate('/purchase')}>
                Choose a Bundle
              </Button>
            </CardContent>
          </Card>
        </Box>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: { xs: 2, md: 6 } }}>
        <Card
          sx={{
            maxWidth: 560,
            width: '100%',
            backdropFilter: 'blur(20px)',
            bgcolor: 'rgba(30,41,59,0.7)',
            border: '1px solid rgba(255,255,255,0.08)',
            overflow: 'visible',
          }}
        >
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <AnimatePresence mode="wait">
              {status === 'checkout' && (
                <motion.div
                  key="checkout"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Typography variant="h5" fontWeight={700} gutterBottom>
                      Complete Payment
                    </Typography>
                    <Typography color="text.secondary" variant="body2">
                      Enter your card details to purchase credits
                    </Typography>
                  </Box>
                  <AdyenDropin
                    sessionId={currentPurchase.sessionId}
                    sessionData={currentPurchase.sessionData}
                    clientKey={currentPurchase.clientKey}
                    environment={currentPurchase.environment}
                    onPaymentCompleted={handlePaymentCompleted}
                    onError={handleError}
                  />
                </motion.div>
              )}

              {status === 'processing' && (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ textAlign: 'center' }}
                >
                  <Box sx={{ maxWidth: 200, mx: 'auto', mb: 2 }}>
                    <Lottie animationData={processingAnimation} loop />
                  </Box>
                  <Typography variant="h5" fontWeight={700} gutterBottom>
                    Processing Payment
                  </Typography>
                  <Typography color="text.secondary">
                    Please wait while we confirm your payment...
                  </Typography>
                </motion.div>
              )}

              {status === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  style={{ textAlign: 'center' }}
                >
                  <Box sx={{ maxWidth: 180, mx: 'auto', mb: 2 }}>
                    <Lottie animationData={successAnimation} loop={false} />
                  </Box>
                  <Typography variant="h5" fontWeight={700} gutterBottom color="success.main">
                    Payment Successful!
                  </Typography>
                  <Typography color="text.secondary" sx={{ mb: 2 }}>
                    Credits have been added to your wallet.
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    If your balance has not updated yet, we are still processing. Click Refresh or wait a moment.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => dispatch(fetchWallet())}
                    >
                      Refresh Balance
                    </Button>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => {
                        dispatch(clearPurchase());
                        navigate('/wallet');
                      }}
                      sx={{ px: 5, py: 1.5 }}
                    >
                      Go to Wallet
                    </Button>
                  </Box>
                </motion.div>
              )}

              {(status === 'failed' || status === 'error') && (
                <motion.div
                  key="failed"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  style={{ textAlign: 'center' }}
                >
                  <Box sx={{ maxWidth: 150, mx: 'auto', mb: 2 }}>
                    <Lottie animationData={failedAnimation} loop={false} />
                  </Box>
                  <Typography variant="h5" fontWeight={700} gutterBottom color="error.main">
                    Payment Failed
                  </Typography>
                  <Typography color="text.secondary" sx={{ mb: 4 }}>
                    {errorMsg || 'Your payment could not be completed. Please try again.'}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                    <Button variant="outlined" size="large" onClick={handleRetry}>
                      Try Again
                    </Button>
                    <Button
                      variant="text"
                      size="large"
                      onClick={() => {
                        dispatch(clearPurchase());
                        navigate('/wallet');
                      }}
                    >
                      Back to Wallet
                    </Button>
                  </Box>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </Box>
    </PageTransition>
  );
}
