import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition.tsx';
import { useAppDispatch } from '../store/hooks.ts';
import { fetchWallet } from '../store/walletSlice.ts';

export default function PurchaseProcessingPage() {
  const [status, setStatus] = useState<'processing' | 'success'>('processing');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus('success');
      dispatch(fetchWallet());
    }, 3000);
    return () => clearTimeout(timer);
  }, [dispatch]);

  return (
    <PageTransition>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <Card sx={{ maxWidth: 480, width: '100%', textAlign: 'center' }}>
          <CardContent sx={{ py: 6 }}>
            {status === 'processing' ? (
              <>
                <CircularProgress size={64} thickness={3} sx={{ mb: 3 }} />
                <Typography variant="h5" gutterBottom>
                  Processing Payment
                </Typography>
                <Typography color="text.secondary">
                  Please wait while we confirm your payment...
                </Typography>
              </>
            ) : (
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                <CheckCircleRounded color="success" sx={{ fontSize: 72, mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  Payment Successful!
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 4 }}>
                  Credits have been added to your wallet
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/wallet')}
                >
                  Go to Wallet
                </Button>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </Box>
    </PageTransition>
  );
}
