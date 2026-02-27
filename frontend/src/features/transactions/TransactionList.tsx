import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import AddCircleRounded from '@mui/icons-material/AddCircleRounded';
import { motion } from 'framer-motion';

interface Entry {
  id: string;
  credits: number;
  balanceAfter: number;
  paymentId: string;
  createdAt: string;
}

interface Props {
  entries: Entry[];
  loading?: boolean;
  compact?: boolean;
}

export default function TransactionList({ entries, loading, compact }: Props) {
  if (loading) {
    return (
      <Box>
        {Array.from({ length: compact ? 3 : 5 }).map((_, i) => (
          <Skeleton key={i} variant="rectangular" height={48} sx={{ mb: 1, borderRadius: 1 }} />
        ))}
      </Box>
    );
  }
  if (entries.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
        <Typography>No transactions yet. Purchase credits to get started!</Typography>
      </Box>
    );
  }
  return (
    <TableContainer component={Paper} elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
      <Table size={compact ? 'small' : 'medium'}>
        <TableHead>
          <TableRow>
            <TableCell>Credits</TableCell>
            <TableCell align="right">Balance After</TableCell>
            <TableCell align="right">Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {entries.map((entry, i) => (
            <motion.tr
              key={entry.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              style={{ display: 'table-row' }}
            >
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AddCircleRounded color="success" fontSize="small" />
                  <Typography fontWeight={600} color="success.main">+{entry.credits}</Typography>
                </Box>
              </TableCell>
              <TableCell align="right">
                <Typography fontWeight={500}>{entry.balanceAfter.toLocaleString()}</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="body2" color="text.secondary">
                  {new Date(entry.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </Typography>
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
