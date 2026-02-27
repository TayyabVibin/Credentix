import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import Chip from '@mui/material/Chip';
import Icon from '../../design-system/primitives/Icon';
import DataGrid from '../../design-system/primitives/DataGrid';
import { PageTransition } from '../../motion';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchAdminWebhooks } from '../../store/adminSlice';

export default function AdminWebhooksPage() {
  const [page, setPage] = useState(1);
  const dispatch = useAppDispatch();
  const { webhookLogs, webhookPage, webhookPages, loading } = useAppSelector((s) => s.admin);

  useEffect(() => {
    dispatch(fetchAdminWebhooks({ page, limit: 20 }));
  }, [dispatch, page]);

  const webhookColumns = [
    {
      id: 'pspReference',
      label: 'PSP Reference',
      render: (log: (typeof webhookLogs)[0]) => <Typography variant="body2" fontFamily="monospace">{log.pspReference ?? '—'}</Typography>,
    },
    {
      id: 'eventCode',
      label: 'Event Code',
      render: (log: (typeof webhookLogs)[0]) => <Chip label={log.eventCode} size="small" variant="outlined" />,
    },
    {
      id: 'success',
      label: 'Success',
      render: (log: (typeof webhookLogs)[0]) => (
        <Box sx={{ color: log.success ? 'success.main' : 'error.main' }}>
          {log.success ? <Icon name="checkCircle" size={18} /> : <Icon name="xCircle" size={18} />}
        </Box>
      ),
    },
    {
      id: 'processedAt',
      label: 'Processed',
      render: (log: (typeof webhookLogs)[0]) => <Typography variant="body2" color="text.secondary">{log.processedAt ? new Date(log.processedAt).toLocaleString() : '—'}</Typography>,
    },
    {
      id: 'createdAt',
      label: 'Created',
      render: (log: (typeof webhookLogs)[0]) => <Typography variant="body2" color="text.secondary">{new Date(log.createdAt).toLocaleString()}</Typography>,
    },
    {
      id: 'error',
      label: 'Error',
      render: (log: (typeof webhookLogs)[0]) => (log.errorMessage ? <Typography variant="caption" color="error" sx={{ maxWidth: 200, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis' }}>{log.errorMessage}</Typography> : '—'),
    },
  ];

  return (
    <PageTransition>
      <Box>
        <Typography variant="h4" sx={{ mb: 3, color: 'primary.main' }}>Webhook Logs</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Delivery logs from Adyen webhooks</Typography>
        <DataGrid
          columns={webhookColumns}
          rows={webhookLogs}
          getRowId={(log) => log.id}
          loading={loading}
          emptyMessage="No webhook logs yet"
        />
        {webhookPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination count={webhookPages} page={webhookPage} onChange={(_, p) => setPage(p)} color="primary" shape="rounded" />
          </Box>
        )}
      </Box>
    </PageTransition>
  );
}
