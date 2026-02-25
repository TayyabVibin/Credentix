import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import PaymentRounded from '@mui/icons-material/PaymentRounded';
import BundleSelector from '../components/BundleSelector.tsx';
import PageTransition from '../components/PageTransition.tsx';
import { useAppDispatch, useAppSelector } from '../store/hooks.ts';
import { initiatePurchase } from '../store/paymentsSlice.ts';

export default function PurchasePage() {
  const [selected, setSelected] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((s) => s.payments);

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
        <Typography variant="h4" sx={{ mb: 1 }}>
          Purchase Credits
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          Select a credit bundle to add to your wallet
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <BundleSelector selected={selected} onSelect={setSelected} />

        <Card sx={{ mt: 4 }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                {selected ? 'Ready to purchase' : 'Select a bundle above'}
              </Typography>
              {selected && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  You will be redirected to the secure payment page
                </Typography>
              )}
            </Box>
            <Button
              variant="contained"
              size="large"
              disabled={!selected || loading}
              onClick={handlePurchase}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PaymentRounded />}
              sx={{ minWidth: 180 }}
            >
              {loading ? 'Processing...' : 'Pay Now'}
            </Button>
          </CardContent>
        </Card>
      </Box>
    </PageTransition>
  );
}
