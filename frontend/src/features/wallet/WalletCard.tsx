import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import AccountBalanceWalletRounded from '@mui/icons-material/AccountBalanceWalletRounded';
import { motion } from 'framer-motion';
interface Props {
  balance: number;
  loading?: boolean;
}

export default function WalletCard({ balance, loading }: Props) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.25 }}>
      <Card
        sx={{
          background: `linear-gradient(135deg, #0A0C10 0%, #1C2028 30%, #14171F 60%, #0A0C10 100%)`,
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(0,229,255,0.15)',
          boxShadow: '0 0 40px rgba(0,229,255,0.08)',
        }}
      >
        <CardContent sx={{ p: 4, position: 'relative', zIndex: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <Box sx={{ width: 44, height: 44, borderRadius: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(0,229,255,0.1)', backdropFilter: 'blur(10px)' }}>
              <AccountBalanceWalletRounded sx={{ fontSize: 24, color: '#00E5FF' }} />
            </Box>
            <Box>
              <Typography variant="body2" sx={{ opacity: 0.7, fontWeight: 500 }}>Available Balance</Typography>
            </Box>
          </Box>
          {loading ? (
            <Skeleton variant="text" width={180} height={64} sx={{ bgcolor: 'rgba(255,255,255,0.15)' }} />
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
              <Typography variant="h2" component={motion.div} key={balance} initial={{ scale: 1.05, opacity: 0.8 }} animate={{ scale: 1, opacity: 1 }} sx={{ fontWeight: 900, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                {balance.toLocaleString()}
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.6, fontWeight: 500 }}>credits</Typography>
            </Box>
          )}
        </CardContent>
        <Box sx={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,229,255,0.12) 0%, transparent 70%)' }} />
        <Box sx={{ position: 'absolute', bottom: -40, left: -40, width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)' }} />
      </Card>
    </motion.div>
  );
}
