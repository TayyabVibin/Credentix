import { useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TrendingUpRounded from '@mui/icons-material/TrendingUpRounded';
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded';
import ScheduleRounded from '@mui/icons-material/ScheduleRounded';
import CompareArrowsRounded from '@mui/icons-material/CompareArrowsRounded';
import { PageTransition, StaggeredReveal } from '../../motion';
import { MetricCard, VolumeChart } from '../../visualization';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchAdminMetrics } from '../../store/adminSlice';

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
        <Typography variant="h4" sx={{ mb: 3, color: 'primary.main' }}>Dashboard</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
          <StaggeredReveal staggerDelay={0.06}>
            <MetricCard title="7-Day Volume" value={metrics?.totalVolume7d ?? 0} format={(n) => formatVolume(n)} subtitle="CAPTURED payments" icon={<TrendingUpRounded sx={{ fontSize: 28 }} />} loading={loading} />
            <MetricCard title="Success Rate" value={metrics?.successRate ?? 0} format={(n) => `${n.toFixed(1)}%`} subtitle="Excl. PENDING" icon={<CheckCircleRounded sx={{ fontSize: 28 }} />} loading={loading} />
            <MetricCard title="Pending" value={metrics?.pendingCount ?? 0} subtitle="Awaiting completion" icon={<ScheduleRounded sx={{ fontSize: 28 }} />} loading={loading} />
            <MetricCard title="Auth vs Capture" value={metrics ? `${metrics.authorizedCount} / ${metrics.capturedCount}` : '—'} subtitle="Authorized / Captured" icon={<CompareArrowsRounded sx={{ fontSize: 28 }} />} loading={loading} />
          </StaggeredReveal>
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
