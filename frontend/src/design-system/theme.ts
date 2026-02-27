import { createTheme, type ThemeOptions } from '@mui/material/styles';
import { colors, gradients, typography, motion, elevation, radius } from './tokens';

const smoothEase = 'cubic-bezier(0.22, 1, 0.36, 1)';

const sharedComponents: ThemeOptions['components'] = {
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        fontFamily: typography.fontFamily.body,
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: radius.md,
        padding: '10px 24px',
        fontSize: '0.938rem',
        fontWeight: 600,
        textTransform: 'none',
        transition: `all ${motion.duration.standard}s ${smoothEase}`,
      },
      contained: {
        boxShadow: 'none',
        background: gradients.hero,
        '&:hover': {
          boxShadow: elevation.glow,
          transform: 'translateY(-2px)',
        },
      },
      outlined: {
        borderColor: colors.surface.borderHover,
        '&:hover': {
          borderColor: colors.accent.electricCyan,
          boxShadow: `0 0 20px rgba(0,229,255,0.2)`,
          transform: 'translateY(-2px)',
        },
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: radius.lg,
        backdropFilter: 'blur(24px)',
        border: `1px solid ${colors.surface.border}`,
        boxShadow: elevation.card,
        transition: `all ${motion.duration.standard}s ${smoothEase}`,
        '&:hover': {
          borderColor: colors.surface.borderHover,
          boxShadow: elevation.cardHover,
        },
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundImage: 'none',
        backdropFilter: 'blur(24px)',
        border: `1px solid ${colors.surface.border}`,
      },
    },
  },
  MuiTextField: {
    defaultProps: { variant: 'outlined' as const, fullWidth: true },
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: radius.md,
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.surface.borderHover,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.accent.electricCyan,
            boxShadow: `0 0 0 2px rgba(0,229,255,0.2)`,
          },
        },
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        fontWeight: 600,
        borderRadius: radius.sm,
      },
    },
  },
  MuiLinearProgress: {
    styleOverrides: {
      root: { borderRadius: 4 },
    },
  },
};

// Dark theme (default, luxury mode)
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: colors.accent.electricCyan,
      light: '#33EBFF',
      dark: '#00B8CC',
    },
    secondary: {
      main: colors.accent.digitalViolet,
      light: '#A78BFA',
      dark: '#7C3AED',
    },
    background: {
      default: colors.surface.obsidian,
      paper: colors.surface.graphite,
    },
    text: {
      primary: '#F1F5F9',
      secondary: '#94A3B8',
    },
    success: { main: colors.accent.emeraldPulse },
    error: { main: colors.accent.mutedRed },
    warning: { main: '#FBBF24' },
    info: { main: colors.accent.electricCyan },
    divider: colors.surface.border,
  },
  typography: {
    fontFamily: typography.fontFamily.body,
    h1: {
      fontFamily: typography.fontFamily.heading,
      fontWeight: 800,
      letterSpacing: typography.letterSpacing.heading,
      fontSize: typography.scale.h1.fontSize,
      lineHeight: typography.scale.h1.lineHeight,
    },
    h2: {
      fontFamily: typography.fontFamily.heading,
      fontWeight: 800,
      letterSpacing: typography.letterSpacing.heading,
      fontSize: typography.scale.h2.fontSize,
      lineHeight: typography.scale.h2.lineHeight,
    },
    h3: {
      fontFamily: typography.fontFamily.heading,
      fontWeight: 700,
      letterSpacing: typography.letterSpacing.heading,
      fontSize: typography.scale.h3.fontSize,
      lineHeight: typography.scale.h3.lineHeight,
    },
    h4: {
      fontFamily: typography.fontFamily.heading,
      fontWeight: 700,
      letterSpacing: typography.letterSpacing.heading,
      fontSize: typography.scale.h4.fontSize,
      lineHeight: typography.scale.h4.lineHeight,
    },
    h5: {
      fontFamily: typography.fontFamily.heading,
      fontWeight: 600,
      fontSize: typography.scale.h5.fontSize,
      lineHeight: typography.scale.h5.lineHeight,
    },
    h6: {
      fontFamily: typography.fontFamily.heading,
      fontWeight: 600,
      fontSize: typography.scale.h6.fontSize,
      lineHeight: typography.scale.h6.lineHeight,
    },
    button: { textTransform: 'none' as const, fontWeight: 600 },
    body1: { lineHeight: 1.6, fontSize: 16 },
    body2: { lineHeight: 1.6, fontSize: 14 },
    caption: {
      fontSize: 12,
      letterSpacing: typography.letterSpacing.label,
      fontWeight: 500,
    },
  },
  shape: { borderRadius: radius.lg },
  components: {
    ...sharedComponents,
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(20,23,31,0.7)',
          backdropFilter: 'blur(24px)',
          border: `1px solid ${colors.surface.border}`,
          borderRadius: radius.lg,
          boxShadow: elevation.card,
          transition: `all ${motion.duration.standard}s ${smoothEase}`,
          '&:hover': {
            borderColor: colors.surface.borderHover,
            boxShadow: elevation.cardHover,
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'rgba(10,12,16,0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${colors.surface.border}`,
        },
      },
    },
  },
});

// Light theme (secondary)
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: colors.accent.indigo,
      light: colors.accent.digitalViolet,
      dark: '#4F46E5',
    },
    secondary: {
      main: colors.accent.electricCyan,
      light: '#33EBFF',
      dark: '#00B8CC',
    },
    background: {
      default: colors.light.background,
      paper: colors.light.paper,
    },
    text: {
      primary: colors.light.textPrimary,
      secondary: colors.light.textSecondary,
    },
    success: { main: colors.accent.emeraldPulse },
    error: { main: colors.accent.mutedRed },
    warning: { main: '#F59E0B' },
    info: { main: colors.accent.indigo },
    divider: colors.light.border,
  },
  typography: {
    fontFamily: typography.fontFamily.body,
    h1: {
      fontFamily: typography.fontFamily.heading,
      fontWeight: 800,
      letterSpacing: typography.letterSpacing.heading,
      color: colors.light.textPrimary,
    },
    h2: {
      fontFamily: typography.fontFamily.heading,
      fontWeight: 800,
      letterSpacing: typography.letterSpacing.heading,
    },
    h3: {
      fontFamily: typography.fontFamily.heading,
      fontWeight: 700,
      letterSpacing: typography.letterSpacing.heading,
    },
    h4: {
      fontFamily: typography.fontFamily.heading,
      fontWeight: 700,
      letterSpacing: typography.letterSpacing.heading,
    },
    h5: {
      fontFamily: typography.fontFamily.heading,
      fontWeight: 600,
    },
    h6: {
      fontFamily: typography.fontFamily.heading,
      fontWeight: 600,
    },
    button: { textTransform: 'none' as const, fontWeight: 600 },
    body1: { lineHeight: 1.6, fontSize: 16 },
    body2: { lineHeight: 1.6, fontSize: 14 },
    caption: {
      fontSize: 12,
      letterSpacing: typography.letterSpacing.label,
      fontWeight: 500,
    },
  },
  shape: { borderRadius: radius.lg },
  components: {
    ...sharedComponents,
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: colors.light.paper,
          border: `1px solid ${colors.light.border}`,
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
          },
        },
      },
    },
  },
});
