import { useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TrendingUpRounded from '@mui/icons-material/TrendingUpRounded';
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded';
import ScheduleRounded from '@mui/icons-material/ScheduleRounded';
import CompareArrowsRounded from '@mui/icons-material/CompareArrowsRounded';
import { PageTransition } from '../../motion';
import { MetricCard, VolumeChart } from '../../visualization';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchAdminMetrics } from '../../store/adminSlice';
import { gradients } from '../../design-system/tokens';

export default function AdminDashboardPage() {
  const dispatch = useAppDispatch();
  const { metrics, loading } = useAppSelector((s) => s.admin);

  useEffect(() => {
    dispatch(fetchAdminMetrics());
  }, [dispatch]);

  const formatVolume = (minor: number) => `$${(minor / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  return (
    <PageTransition>
      <Box>
        <Typography variant="h4" sx={{ mb: 3, background: gradients.hero, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Dashboard</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
          <MetricCard title="7-Day Volume" value={metrics ? formatVolume(metrics.totalVolume7d) : '—'} subtitle="CAPTURED payments" icon={<TrendingUpRounded sx={{ fontSize: 28 }} />} loading={loading} />
          <MetricCard title="Success Rate" value={metrics ? `${metrics.successRate.toFixed(1)}%` : '—'} subtitle="Excl. PENDING" icon={<CheckCircleRounded sx={{ fontSize: 28 }} />} loading={loading} />
          <MetricCard title="Pending" value={metrics?.pendingCount ?? '—'} subtitle="Awaiting completion" icon={<ScheduleRounded sx={{ fontSize: 28 }} />} loading={loading} />
          <MetricCard title="Auth vs Capture" value={metrics ? `${metrics.authorizedCount} / ${metrics.capturedCount}` : '—'} subtitle="Authorized / Captured" icon={<CompareArrowsRounded sx={{ fontSize: 28 }} />} loading={loading} />
        </Box>
        {metrics && metrics.dailyVolume.length > 0 && (
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Daily Volume (Last 7 Days)</Typography>
              <VolumeChart data={metrics.dailyVolume} formatAmount={formatVolume} />
            </CardContent>
          </Card>
        )}
      </Box>
    </PageTransition>
  );
}
