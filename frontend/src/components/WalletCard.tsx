import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import AccountBalanceWalletRounded from '@mui/icons-material/AccountBalanceWalletRounded';
import ShoppingCartRounded from '@mui/icons-material/ShoppingCartRounded';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface Props {
  balance: number;
  loading?: boolean;
}

export default function WalletCard({ balance, loading }: Props) {
  const navigate = useNavigate();

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Card
        sx={{
          background: (t) =>
            `linear-gradient(135deg, ${t.palette.primary.main} 0%, ${t.palette.secondary.main} 100%)`,
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <AccountBalanceWalletRounded sx={{ fontSize: 32, opacity: 0.9 }} />
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Your Balance
            </Typography>
          </Box>

          {loading ? (
            <Skeleton variant="text" width={180} height={64} sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
          ) : (
            <Typography
              variant="h3"
              component={motion.div}
              key={balance}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              sx={{ fontWeight: 800, mb: 3 }}
            >
              {balance.toLocaleString()} <Typography component="span" variant="h5" sx={{ opacity: 0.8 }}>credits</Typography>
            </Typography>
          )}

          <Button
            variant="contained"
            size="large"
            startIcon={<ShoppingCartRounded />}
            onClick={() => navigate('/purchase')}
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              color: 'white',
              backdropFilter: 'blur(10px)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
            }}
          >
            Purchase Credits
          </Button>
        </CardContent>

        <Box
          sx={{
            position: 'absolute',
            top: -40,
            right: -40,
            width: 160,
            height: 160,
            borderRadius: '50%',
            bgcolor: 'rgba(255,255,255,0.06)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -60,
            right: 40,
            width: 200,
            height: 200,
            borderRadius: '50%',
            bgcolor: 'rgba(255,255,255,0.04)',
          }}
        />
      </Card>
    </motion.div>
  );
}
