import { useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import WalletCard from '../components/WalletCard.tsx';
import TransactionList from '../components/TransactionList.tsx';
import PageTransition from '../components/PageTransition.tsx';
import { useAppDispatch, useAppSelector } from '../store/hooks.ts';
import { fetchWallet } from '../store/walletSlice.ts';

export default function WalletPage() {
  const dispatch = useAppDispatch();
  const { balance, recentTransactions, loading } = useAppSelector((s) => s.wallet);

  useEffect(() => {
    dispatch(fetchWallet());
  }, [dispatch]);

  return (
    <PageTransition>
      <Box>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Dashboard
        </Typography>

        <Box sx={{ mb: 4 }}>
          <WalletCard balance={balance} loading={loading} />
        </Box>

        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Recent Transactions
            </Typography>
            <TransactionList entries={recentTransactions} loading={loading} compact />
          </CardContent>
        </Card>
      </Box>
    </PageTransition>
  );
}
