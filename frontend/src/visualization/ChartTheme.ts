/**
 * Credentix Chart Theme
 * Custom styling for Recharts with futuristic aesthetic.
 */

export const chartColors = {
  primary: '#00E5FF',
  secondary: '#8B5CF6',
  success: '#10B981',
  gradient: 'url(#chartGradient)',
};

export const chartTheme = {
  grid: {
    stroke: 'rgba(255,255,255,0.06)',
    strokeDasharray: '4 4',
  },
  axis: {
    stroke: 'rgba(255,255,255,0.2)',
    tick: { fill: '#94A3B8', fontSize: 11 },
  },
  tooltip: {
    contentStyle: {
      backgroundColor: 'rgba(20,23,31,0.95)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 8,
      backdropFilter: 'blur(12px)',
      padding: '12px 16px',
    },
    labelStyle: { color: '#F1F5F9' },
  },
};
