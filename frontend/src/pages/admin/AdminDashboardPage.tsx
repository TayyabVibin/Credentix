import { useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Skeleton from '@mui/material/Skeleton';
import TrendingUpRounded from '@mui/icons-material/TrendingUpRounded';
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded';
import ScheduleRounded from '@mui/icons-material/ScheduleRounded';
import CompareArrowsRounded from '@mui/icons-material/CompareArrowsRounded';
import { motion } from 'framer-motion';
import PageTransition from '../../components/PageTransition.tsx';
import { useAppDispatch, useAppSelector } from '../../store/hooks.ts';
import { fetchAdminMetrics } from '../../store/adminSlice.ts';

function MetricCard({
  title,
  value,
  subtitle,
  icon,
  loading,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  loading?: boolean;
}) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Card>
        <CardContent sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: 'primary.main',
              color: 'white',
            }}
          >
            {icon}
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
            {loading ? (
              <Skeleton variant="text" width={80} height={40} />
            ) : (
              <Typography variant="h4" fontWeight={800}>
                {value}
              </Typography>
            )}
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function AdminDashboardPage() {
  const dispatch = useAppDispatch();
  const { metrics, loading } = useAppSelector((s) => s.admin);

  useEffect(() => {
    dispatch(fetchAdminMetrics());
  }, [dispatch]);

  const formatVolume = (minor: number) =>
    `$${(minor / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  return (
    <PageTransition>
      <Box>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Dashboard
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: 3,
            mb: 4,
          }}
        >
          <MetricCard
            title="7-Day Volume"
            value={metrics ? formatVolume(metrics.totalVolume7d) : '—'}
            subtitle="CAPTURED payments"
            icon={<TrendingUpRounded sx={{ fontSize: 28 }} />}
            loading={loading}
          />
          <MetricCard
            title="Success Rate"
            value={metrics ? `${metrics.successRate.toFixed(1)}%` : '—'}
            subtitle="Excl. PENDING"
            icon={<CheckCircleRounded sx={{ fontSize: 28 }} />}
            loading={loading}
          />
          <MetricCard
            title="Pending"
            value={metrics?.pendingCount ?? '—'}
            subtitle="Awaiting completion"
            icon={<ScheduleRounded sx={{ fontSize: 28 }} />}
            loading={loading}
          />
          <MetricCard
            title="Auth vs Capture"
            value={
              metrics
                ? `${metrics.authorizedCount} / ${metrics.capturedCount}`
                : '—'
            }
            subtitle="Authorized / Captured"
            icon={<CompareArrowsRounded sx={{ fontSize: 28 }} />}
            loading={loading}
          />
        </Box>

        {metrics && metrics.dailyVolume.length > 0 && (
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Daily Volume (Last 7 Days)
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  gap: 1,
                  alignItems: 'flex-end',
                  height: 120,
                }}
              >
                {metrics.dailyVolume.map((d, i) => {
                  const max = Math.max(
                    ...metrics.dailyVolume.map((x) => x.amountMinor),
                    1,
                  );
                  const h = (d.amountMinor / max) * 100;
                  return (
                    <motion.div
                      key={d.date}
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ delay: i * 0.05, duration: 0.4 }}
                      style={{
                        flex: 1,
                        minHeight: 4,
                        borderRadius: 8,
                        backgroundColor: 'var(--mui-palette-primary-main)',
                      }}
                      title={`${d.date}: ${formatVolume(d.amountMinor)}`}
                    />
                  );
                })}
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mt: 1,
                  fontSize: '0.75rem',
                  color: 'text.secondary',
                }}
              >
                {metrics.dailyVolume.map((d) => (
                  <span key={d.date}>{d.date.slice(5)}</span>
                ))}
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>
    </PageTransition>
  );
}
