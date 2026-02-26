import { createTheme, type ThemeOptions } from '@mui/material/styles';

const shared: ThemeOptions = {
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica Neue", Arial, sans-serif',
    h1: { fontWeight: 900, letterSpacing: '-0.02em' },
    h2: { fontWeight: 800, letterSpacing: '-0.02em' },
    h3: { fontWeight: 800, letterSpacing: '-0.01em' },
    h4: { fontWeight: 700, letterSpacing: '-0.01em' },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none' as const, fontWeight: 600 },
    body1: { lineHeight: 1.7 },
    body2: { lineHeight: 1.6 },
  },
  shape: { borderRadius: 14 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          fontSize: '0.938rem',
          transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': { boxShadow: '0 4px 20px 0 rgba(99,102,241,0.25)', transform: 'translateY(-1px)' },
        },
        outlined: {
          '&:hover': { transform: 'translateY(-1px)' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
        },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined' as const, fullWidth: true },
    },
    MuiChip: {
      styleOverrides: { root: { fontWeight: 600, borderRadius: 8 } },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { borderRadius: 4 },
      },
    },
  },
};

export const lightTheme = createTheme({
  ...shared,
  palette: {
    mode: 'light',
    primary: { main: '#4F46E5', light: '#818CF8', dark: '#3730A3' },
    secondary: { main: '#0EA5E9', light: '#38BDF8', dark: '#0284C7' },
    background: { default: '#F8FAFC', paper: '#FFFFFF' },
    text: { primary: '#1E293B', secondary: '#64748B' },
    success: { main: '#10B981' },
    error: { main: '#EF4444' },
    warning: { main: '#F59E0B' },
    info: { main: '#3B82F6' },
    divider: 'rgba(0,0,0,0.06)',
  },
});

export const darkTheme = createTheme({
  ...shared,
  palette: {
    mode: 'dark',
    primary: { main: '#818CF8', light: '#A5B4FC', dark: '#6366F1' },
    secondary: { main: '#38BDF8', light: '#7DD3FC', dark: '#0EA5E9' },
    background: { default: '#0B0F1A', paper: '#1E293B' },
    text: { primary: '#F1F5F9', secondary: '#94A3B8' },
    success: { main: '#34D399' },
    error: { main: '#F87171' },
    warning: { main: '#FBBF24' },
    info: { main: '#60A5FA' },
    divider: 'rgba(255,255,255,0.08)',
  },
  components: {
    ...shared.components,
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
          backdropFilter: 'blur(16px)',
          backgroundColor: 'rgba(30,41,59,0.55)',
          border: '1px solid rgba(255,255,255,0.08)',
          transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});
