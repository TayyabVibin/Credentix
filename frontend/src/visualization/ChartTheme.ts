/**
 * Credentix Chart Theme
 * Theme-aware styling for Recharts with emerald palette and premium feel.
 */

export function getChartTheme(mode: 'light' | 'dark') {
  const isDark = mode === 'dark';
  return {
    colors: {
      primary: isDark ? '#059669' : '#047857',
      primaryGlow: isDark ? 'rgba(5,150,105,0.4)' : 'rgba(4,120,87,0.3)',
    },
    grid: {
      stroke: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
      strokeDasharray: '4 4',
    },
    axis: {
      stroke: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
      tick: { fill: isDark ? '#A8A29E' : '#57534E', fontSize: 11 },
    },
    tooltip: {
      contentStyle: {
        backgroundColor: isDark ? 'rgba(26,29,36,0.95)' : 'rgba(255,255,255,0.95)',
        border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
        borderRadius: 8,
        backdropFilter: 'blur(12px)',
        padding: '12px 16px',
      },
      labelStyle: { color: isDark ? '#F5F5F4' : '#1C1917' },
    },
  };
}

/** @deprecated Use getChartTheme(mode) for theme-aware styling */
export const chartColors = {
  primary: '#059669',
  secondary: '#8B5CF6',
  success: '#10B981',
  gradient: 'url(#chartGradient)',
};

/** @deprecated Use getChartTheme(mode) for theme-aware styling */
export const chartTheme = {
  grid: { stroke: 'rgba(255,255,255,0.06)', strokeDasharray: '4 4' },
  axis: { stroke: 'rgba(255,255,255,0.2)', tick: { fill: '#94A3B8', fontSize: 11 } },
  tooltip: {
    contentStyle: {
      backgroundColor: 'rgba(26,29,36,0.95)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 8,
      backdropFilter: 'blur(12px)',
      padding: '12px 16px',
    },
    labelStyle: { color: '#F5F5F4' },
  },
};
