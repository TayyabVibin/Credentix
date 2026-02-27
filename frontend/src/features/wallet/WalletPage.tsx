import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import ShoppingCartRounded from '@mui/icons-material/ShoppingCartRounded';
import TrendingUpRounded from '@mui/icons-material/TrendingUpRounded';
import ReceiptLongRounded from '@mui/icons-material/ReceiptLongRounded';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import WalletCard from './WalletCard';
import TransactionList from '../transactions/TransactionList';
import { PageTransition } from '../../motion';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchWallet } from '../../store/walletSlice';
import { gradients } from '../../design-system/tokens';
import coinAnim from '../../assets/animations/coin circling wallet.json';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.4, ease: 'easeOut' as const } }),
};

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
            <Typography variant="h4" sx={{ fontWeight: 800, background: gradients.hero, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 0.5 }}>
              {user?.fullName ? `Welcome back, ${user.fullName.split(' ')[0]}` : 'Dashboard'}
            </Typography>
            <Typography variant="body2" color="text.secondary">Overview of your account and recent activity</Typography>
          </Box>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button variant="contained" startIcon={<ShoppingCartRounded />} onClick={() => navigate('/purchase')}>
              Buy Credits
            </Button>
          </motion.div>
        </Box>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, md: 7 }}>
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
              <WalletCard balance={balance} loading={loading} />
            </motion.div>
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1} style={{ height: '100%' }}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', p: 3 }}>
                <Box sx={{ maxWidth: 160, mb: 2 }}><Lottie animationData={coinAnim} loop /></Box>
                <Grid container spacing={2} sx={{ width: '100%' }}>
                  <Grid size={6}>
                    <Box sx={{ textAlign: 'center', p: 2, borderRadius: 2, bgcolor: 'rgba(0,229,255,0.08)' }}>
                      <TrendingUpRounded sx={{ color: '#00E5FF', mb: 0.5 }} />
                      <Typography variant="h6" fontWeight={700}>{recentTransactions.length}</Typography>
                      <Typography variant="caption" color="text.secondary">Transactions</Typography>
                    </Box>
                  </Grid>
                  <Grid size={6}>
                    <Box sx={{ textAlign: 'center', p: 2, borderRadius: 2, bgcolor: 'rgba(139,92,246,0.08)' }}>
                      <ReceiptLongRounded sx={{ color: '#8B5CF6', mb: 0.5 }} />
                      <Typography variant="h6" fontWeight={700}>{recentTransactions.reduce((sum, t) => sum + t.credits, 0).toLocaleString()}</Typography>
                      <Typography variant="caption" color="text.secondary">Total Credits</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2}>
          <Card>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={700}>Recent Transactions</Typography>
                <Button size="small" onClick={() => navigate('/transactions')} sx={{ color: 'primary.main' }}>View All</Button>
              </Box>
              <TransactionList entries={recentTransactions} loading={loading} compact />
            </CardContent>
          </Card>
        </motion.div>
      </Box>
    </PageTransition>
  );
}
