import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Skeleton from '@mui/material/Skeleton';
import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import StatusBadge from '../../components/StatusBadge.tsx';
import PageTransition from '../../components/PageTransition.tsx';
import { useAppDispatch, useAppSelector } from '../../store/hooks.ts';
import { fetchPaymentDetail, clearPaymentDetail } from '../../store/adminSlice.ts';

export default function AdminPaymentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { paymentDetail, loading } = useAppSelector((s) => s.admin);

  useEffect(() => {
    if (id) dispatch(fetchPaymentDetail(id));
    return () => {
      dispatch(clearPaymentDetail());
    };
  }, [dispatch, id]);

  const formatAmount = (minor: number) =>
    `$${(minor / 100).toFixed(2)}`;

  if (!id) return null;

  return (
    <PageTransition>
      <Box>
        <Button
          startIcon={<ArrowBackRounded />}
          onClick={() => navigate('/admin/payments')}
          sx={{ mb: 2 }}
        >
          Back to Payments
        </Button>

        {loading && !paymentDetail ? (
          <Card>
            <CardContent>
              <Skeleton variant="text" width={200} height={40} />
              <Skeleton variant="text" width={300} height={24} sx={{ mt: 2 }} />
            </CardContent>
          </Card>
        ) : !paymentDetail ? (
          <Typography color="text.secondary">Payment not found</Typography>
        ) : (
          <>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', mb: 2 }}>
                  <Typography variant="h5" fontWeight={700}>
                    {paymentDetail.merchantReference}
                  </Typography>
                  <StatusBadge status={paymentDetail.status} />
                  {paymentDetail.pspReference && (
                    <Chip label={`PSP: ${paymentDetail.pspReference}`} size="small" variant="outlined" />
                  )}
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">User</Typography>
                    <Typography>{paymentDetail.userEmail}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Amount</Typography>
                    <Typography fontWeight={600}>{formatAmount(paymentDetail.amountMinor)} {paymentDetail.currency}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Created</Typography>
                    <Typography>{new Date(paymentDetail.createdAt).toLocaleString()}</Typography>
                  </Box>
                  {paymentDetail.authorizedAt && (
                    <Box>
                      <Typography variant="caption" color="text.secondary">Authorized</Typography>
                      <Typography>{new Date(paymentDetail.authorizedAt).toLocaleString()}</Typography>
                    </Box>
                  )}
                  {paymentDetail.capturedAt && (
                    <Box>
                      <Typography variant="caption" color="text.secondary">Captured</Typography>
                      <Typography>{new Date(paymentDetail.capturedAt).toLocaleString()}</Typography>
                    </Box>
                  )}
                  {paymentDetail.failureReason && (
                    <Box sx={{ gridColumn: '1 / -1' }}>
                      <Typography variant="caption" color="text.secondary">Failure Reason</Typography>
                      <Typography color="error">{paymentDetail.failureReason}</Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Event Timeline
                </Typography>
                {paymentDetail.events.length === 0 ? (
                  <Typography color="text.secondary">No events recorded</Typography>
                ) : (
                  <Timeline position="right">
                    {paymentDetail.events.map((e, i) => (
                      <TimelineItem key={e.id}>
                        <TimelineSeparator>
                          <TimelineDot color={e.toStatus === 'CAPTURED' ? 'success' : e.toStatus === 'FAILED' || e.toStatus === 'REFUSED' ? 'error' : 'primary'} />
                          {i < paymentDetail.events.length - 1 && <TimelineConnector />}
                        </TimelineSeparator>
                        <TimelineContent>
                          <Typography variant="body2" fontWeight={600}>
                            {e.fromStatus ?? '—'} → {e.toStatus}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {e.eventSource} · {new Date(e.createdAt).toLocaleString()}
                          </Typography>
                        </TimelineContent>
                      </TimelineItem>
                    ))}
                  </Timeline>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </Box>
    </PageTransition>
  );
}
