import { useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Pagination from '@mui/material/Pagination';
import { motion } from 'framer-motion';
import TransactionList from './TransactionList';
import { PageTransition } from '../../motion';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchTransactions } from '../../store/walletSlice';

export default function TransactionsPage() {
  const dispatch = useAppDispatch();
  const { transactions, totalPages, currentPage, loading } = useAppSelector((s) => s.wallet);

  useEffect(() => {
    dispatch(fetchTransactions({ page: 1, limit: 20 }));
  }, [dispatch]);

  const handlePageChange = (_: unknown, page: number) => {
    dispatch(fetchTransactions({ page, limit: 20 }));
  };

  return (
    <PageTransition>
      <Box>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main', mb: 0.5 }}>
            Transaction History
          </Typography>
          <Typography variant="body2" color="text.secondary">Complete record of all credit transactions in your account</Typography>
        </Box>
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <TransactionList entries={transactions} loading={loading} />
            </CardContent>
          </Card>
        </motion.div>
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} color="primary" shape="rounded" />
          </Box>
        )}
      </Box>
    </PageTransition>
  );
}
