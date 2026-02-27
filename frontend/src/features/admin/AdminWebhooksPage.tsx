import { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Pagination from '@mui/material/Pagination';
import Skeleton from '@mui/material/Skeleton';
import Chip from '@mui/material/Chip';
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded';
import ErrorRounded from '@mui/icons-material/ErrorRounded';
import { PageTransition } from '../../motion';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchAdminWebhooks } from '../../store/adminSlice';
import { gradients } from '../../design-system/tokens';

export default function AdminWebhooksPage() {
  const [page, setPage] = useState(1);
  const dispatch = useAppDispatch();
  const { webhookLogs, webhookPage, webhookPages, loading } = useAppSelector((s) => s.admin);

  useEffect(() => {
    dispatch(fetchAdminWebhooks({ page, limit: 20 }));
  }, [dispatch, page]);

  return (
    <PageTransition>
      <Box>
        <Typography variant="h4" sx={{ mb: 3, background: gradients.hero, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Webhook Logs</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Delivery logs from Adyen webhooks</Typography>
        <TableContainer component={Paper} elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>PSP Reference</TableCell>
                <TableCell>Event Code</TableCell>
                <TableCell>Success</TableCell>
                <TableCell>Processed</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Error</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton variant="text" width={100} /></TableCell>
                    <TableCell><Skeleton variant="text" width={80} /></TableCell>
                    <TableCell><Skeleton variant="text" width={60} /></TableCell>
                    <TableCell><Skeleton variant="text" width={100} /></TableCell>
                    <TableCell><Skeleton variant="text" width={100} /></TableCell>
                    <TableCell />
                  </TableRow>
                ))
              ) : webhookLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} sx={{ py: 6, textAlign: 'center', color: 'text.secondary' }}>No webhook logs yet</TableCell>
                </TableRow>
              ) : (
                webhookLogs.map((log) => (
                  <TableRow key={log.id} hover sx={{ '&:hover': { bgcolor: 'rgba(0,229,255,0.04)' } }}>
                    <TableCell><Typography variant="body2" fontFamily="monospace">{log.pspReference ?? '—'}</Typography></TableCell>
                    <TableCell><Chip label={log.eventCode} size="small" variant="outlined" /></TableCell>
                    <TableCell>{log.success ? <CheckCircleRounded color="success" fontSize="small" /> : <ErrorRounded color="error" fontSize="small" />}</TableCell>
                    <TableCell><Typography variant="body2" color="text.secondary">{log.processedAt ? new Date(log.processedAt).toLocaleString() : '—'}</Typography></TableCell>
                    <TableCell><Typography variant="body2" color="text.secondary">{new Date(log.createdAt).toLocaleString()}</Typography></TableCell>
                    <TableCell>{log.errorMessage ? <Typography variant="caption" color="error" sx={{ maxWidth: 200, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis' }}>{log.errorMessage}</Typography> : '—'}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {webhookPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination count={webhookPages} page={webhookPage} onChange={(_, p) => setPage(p)} color="primary" shape="rounded" />
          </Box>
        )}
      </Box>
    </PageTransition>
  );
}
