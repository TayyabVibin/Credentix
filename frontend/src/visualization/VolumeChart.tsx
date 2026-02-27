import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useTheme } from '@mui/material/styles';
import { getChartTheme } from './ChartTheme';

interface DataPoint {
  date: string;
  amountMinor: number;
}

interface Props {
  data: DataPoint[];
  formatAmount: (minor: number) => string;
}

export default function VolumeChart({ data, formatAmount }: Props) {
  const theme = useTheme();
  const chartTheme = getChartTheme(theme.palette.mode);
  const { colors } = chartTheme;

  const chartData = data.map((d) => ({
    ...d,
    amount: d.amountMinor / 100,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ width: '100%', height: 200 }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colors.primary} stopOpacity={0.5} />
              <stop offset="100%" stopColor={colors.primary} stopOpacity={0} />
            </linearGradient>
            <filter id="volumeGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <CartesianGrid strokeDasharray="4 4" stroke={chartTheme.grid.stroke} vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={(v) => v?.slice(5) ?? ''}
            stroke={chartTheme.axis.stroke}
            tick={chartTheme.axis.tick}
          />
          <YAxis
            tickFormatter={(v) => `$${v}`}
            stroke={chartTheme.axis.stroke}
            tick={chartTheme.axis.tick}
          />
          <Tooltip
            contentStyle={chartTheme.tooltip.contentStyle}
            labelStyle={chartTheme.tooltip.labelStyle}
            formatter={(value) => [value != null ? formatAmount(Number(value) * 100) : '—', 'Volume']}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Area
            type="monotone"
            dataKey="amount"
            stroke={colors.primary}
            strokeWidth={2}
            fill="url(#volumeGradient)"
            filter="url(#volumeGlow)"
            isAnimationActive
            animationDuration={800}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
