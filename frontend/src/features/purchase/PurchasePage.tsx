import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import PaymentRounded from '@mui/icons-material/PaymentRounded';
import SecurityRounded from '@mui/icons-material/SecurityRounded';
import SpeedRounded from '@mui/icons-material/SpeedRounded';
import VerifiedUserRounded from '@mui/icons-material/VerifiedUserRounded';
import Lottie from 'lottie-react';
import { motion } from 'framer-motion';
import BundleSelector from './BundleSelector';
import { PageTransition } from '../../motion';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { initiatePurchase, clearPurchase } from '../../store/paymentsSlice';
import { gradients } from '../../design-system/tokens';
import coinAnim from '../../assets/animations/Turning Coin.json';

const trustPoints = [
  { icon: <SecurityRounded />, label: 'PCI DSS Compliant' },
  { icon: <SpeedRounded />, label: 'Instant Delivery' },
  { icon: <VerifiedUserRounded />, label: 'Secure Checkout' },
];

export default function PurchasePage() {
  const [selected, setSelected] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((s) => s.payments);

  const handleRetry = () => {
    dispatch(clearPurchase());
  };

  const handlePurchase = async () => {
    if (!selected) return;
    const returnUrl = `${window.location.origin}/purchase/return`;
    const result = await dispatch(initiatePurchase({ bundleId: selected, returnUrl }));
    if (initiatePurchase.fulfilled.match(result)) {
      navigate('/purchase/processing');
    }
  };

  return (
    <PageTransition>
      <Box>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ maxWidth: 100, mx: 'auto', mb: 2 }}><Lottie animationData={coinAnim} loop /></Box>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, background: gradients.hero, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Purchase Credits</Typography>
            <Typography color="text.secondary" variant="h6" sx={{ fontWeight: 400, maxWidth: 480, mx: 'auto' }}>Choose the plan that fits your needs. Credits never expire and can be used across all platform features.</Typography>
          </motion.div>
        </Box>
        {error && <Alert severity="error" sx={{ mb: 3 }} action={<Button color="inherit" size="small" onClick={handleRetry}>Retry</Button>}>{error}</Alert>}
        <BundleSelector selected={selected} onSelect={setSelected} />
        <Card sx={{ mt: 5, backdropFilter: 'blur(16px)', bgcolor: 'rgba(20,23,31,0.7)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Grid container spacing={3} alignItems="center">
              <Grid size={{ xs: 12, md: 7 }}>
                <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: { xs: 2, md: 0 } }}>
                  {trustPoints.map((t) => (
                    <Box key={t.label} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ color: 'primary.main' }}>{t.icon}</Box>
                      <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>{t.label}</Typography>
                    </Box>
                  ))}
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 5 }} sx={{ display: 'flex', justifyContent: { md: 'flex-end' } }}>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button variant="contained" size="large" disabled={!selected || loading} onClick={handlePurchase} startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PaymentRounded />} sx={{ minWidth: 200, py: 1.5, px: 4, fontSize: '1rem' }}>
                    {loading ? 'Processing...' : 'Pay Now'}
                  </Button>
                </motion.div>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </PageTransition>
  );
}
