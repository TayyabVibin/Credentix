import { useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Pagination from '@mui/material/Pagination';
import TransactionList from '../components/TransactionList.tsx';
import PageTransition from '../components/PageTransition.tsx';
import { useAppDispatch, useAppSelector } from '../store/hooks.ts';
import { fetchTransactions } from '../store/walletSlice.ts';

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
        <Typography variant="h4" sx={{ mb: 3 }}>
          Transaction History
        </Typography>

        <TransactionList entries={transactions} loading={loading} />

        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              shape="rounded"
            />
          </Box>
        )}
      </Box>
    </PageTransition>
  );
}
