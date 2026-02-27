import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import WalletCard from './WalletCard';
import TransactionList from '../transactions/TransactionList';
import CommandModule from '../../design-system/primitives/CommandModule';
import Icon from '../../design-system/primitives/Icon';
import { PageTransition, AnimatedCounter } from '../../motion';
import { typography } from '../../design-system/tokens';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchWallet } from '../../store/walletSlice';
import coinAnim from '../../assets/animations/coin circling wallet.json';

export default function WalletPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { balance, recentTransactions, loading } = useAppSelector((s) => s.wallet);
  const { user } = useAppSelector((s) => s.auth);

  useEffect(() => {
    dispatch(fetchWallet());
  }, [dispatch]);

  return (
    <PageTransition>
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main', mb: 0.5 }}>
              {user?.fullName ? `Welcome back, ${user.fullName.split(' ')[0]}` : 'Dashboard'}
            </Typography>
            <Typography variant="body2" color="text.secondary">Overview of your account and recent activity</Typography>
          </Box>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button variant="contained" startIcon={<Icon name="shoppingCart" size={20} />} onClick={() => navigate('/purchase')}>
              Buy Credits
            </Button>
          </motion.div>
        </Box>
        <Grid container spacing={4} sx={{ mb: 5 }}>
          <Grid size={{ xs: 12, md: 7 }}>
            <WalletCard balance={balance} loading={loading} />
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <CommandModule sx={{ height: '100%', minHeight: 280, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', p: 4 }}>
              <Box sx={{ maxWidth: 180, mb: 3 }}><Lottie animationData={coinAnim} loop /></Box>
              <Grid container spacing={3} sx={{ width: '100%' }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ textAlign: 'center', p: 3, borderRadius: 2, bgcolor: 'rgba(5,150,105,0.1)', border: '1px solid', borderColor: 'rgba(5,150,105,0.2)', transition: 'all 0.2s ease', '&:hover': { bgcolor: 'rgba(5,150,105,0.14)' } }}>
                    <Box sx={{ color: 'primary.main', mb: 1 }}><Icon name="trendingUp" size={28} /></Box>
                    <Typography variant="h5" fontWeight={700} sx={{ ...typography.scale.monetary, fontSize: '1.5rem' }}>
                      <AnimatedCounter value={recentTransactions.length} />
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>Transactions</Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ textAlign: 'center', p: 3, borderRadius: 2, bgcolor: 'rgba(217,119,6,0.08)', border: '1px solid', borderColor: 'rgba(217,119,6,0.15)', transition: 'all 0.2s ease', '&:hover': { bgcolor: 'rgba(217,119,6,0.12)' } }}>
                    <Box sx={{ color: 'secondary.main', mb: 1 }}><Icon name="receipt" size={28} /></Box>
                    <Typography variant="h5" fontWeight={700} sx={{ ...typography.scale.monetary, fontSize: '1.5rem' }}>
                      <AnimatedCounter value={recentTransactions.reduce((sum, t) => sum + t.credits, 0)} />
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>Total Credits</Typography>
                  </Box>
                </Grid>
              </Grid>
            </CommandModule>
          </Grid>
        </Grid>
        <CommandModule sx={{ overflow: 'hidden' }}>
          <Box sx={{ p: { xs: 3, md: 4 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" fontWeight={700}>Recent Transactions</Typography>
              <Button size="medium" onClick={() => navigate('/transactions')} sx={{ color: 'primary.main', fontWeight: 600 }}>View All</Button>
            </Box>
            <TransactionList entries={recentTransactions} loading={loading} compact noCard />
          </Box>
        </CommandModule>
      </Box>
    </PageTransition>
  );
}
