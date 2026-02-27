import { createTheme, type ThemeOptions } from '@mui/material/styles';
import { dark, light, typography, motion, radius } from './tokens';

const smoothEase = 'cubic-bezier(0.22, 1, 0.36, 1)';

// Base component styles (no mode-specific colors)
const baseComponents: ThemeOptions['components'] = {
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        fontFamily: typography.fontFamily.body,
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

// Dark theme
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: dark.accent.primary,
      light: '#10B981',
      dark: dark.accent.primaryHover,
    },
    secondary: {
      main: dark.accent.secondary,
      light: '#F59E0B',
      dark: dark.accent.secondaryHover,
    },
    background: {
      default: dark.surface.base,
      paper: dark.surface.elevated,
    },
    text: {
      primary: dark.text.primary,
      secondary: dark.text.secondary,
    },
    success: { main: dark.dataState.profit },
    error: { main: dark.dataState.loss },
    warning: { main: dark.accent.secondary },
    info: { main: dark.accent.primary },
    divider: dark.surface.border,
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
    ...baseComponents,
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
          position: 'relative',
          boxShadow: 'none',
          background: dark.accent.primary,
          color: '#fff',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            padding: 1,
            background: 'linear-gradient(135deg, #059669 0%, #0D9488 100%)',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            pointerEvents: 'none',
          },
          '&:hover': {
            background: dark.accent.primaryHover,
            boxShadow: dark.elevation.glow,
            transform: 'translateY(-2px) scale(1.02)',
          },
        },
        outlined: {
          borderColor: dark.surface.borderHover,
          color: dark.text.primary,
          '&:hover': {
            borderColor: dark.accent.primary,
            backgroundColor: dark.accent.primaryMuted,
            boxShadow: `0 0 20px rgba(5,150,105,0.2)`,
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(26,29,36,0.8)',
          backdropFilter: 'blur(24px)',
          border: `1px solid ${dark.surface.border}`,
          borderRadius: radius.lg,
          boxShadow: dark.elevation.card,
          transition: `all ${motion.duration.standard}s ${smoothEase}`,
          '&:hover': {
            borderColor: dark.surface.borderHover,
            boxShadow: dark.elevation.cardHover,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: dark.surface.elevated,
          backdropFilter: 'blur(24px)',
          border: `1px solid ${dark.surface.border}`,
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
              borderColor: dark.surface.borderHover,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: dark.accent.primary,
              boxShadow: `0 0 0 2px rgba(5,150,105,0.25)`,
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'rgba(13,15,18,0.9)',
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${dark.surface.border}`,
        },
      },
    },
  },
});

// Light theme
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: light.accent.primary,
      light: '#059669',
      dark: light.accent.primaryHover,
    },
    secondary: {
      main: light.accent.secondary,
      light: '#D97706',
      dark: light.accent.secondaryHover,
    },
    background: {
      default: light.surface.base,
      paper: light.surface.overlay,
    },
    text: {
      primary: light.text.primary,
      secondary: light.text.secondary,
    },
    success: { main: light.dataState.profit },
    error: { main: light.dataState.loss },
    warning: { main: light.accent.secondary },
    info: { main: light.accent.primary },
    divider: light.surface.border,
  },
  typography: {
    fontFamily: typography.fontFamily.body,
    h1: {
      fontFamily: typography.fontFamily.heading,
      fontWeight: 800,
      letterSpacing: typography.letterSpacing.heading,
      color: light.text.primary,
    },
    h2: {
      fontFamily: typography.fontFamily.heading,
      fontWeight: 800,
      letterSpacing: typography.letterSpacing.heading,
      color: light.text.primary,
    },
    h3: {
      fontFamily: typography.fontFamily.heading,
      fontWeight: 700,
      letterSpacing: typography.letterSpacing.heading,
      color: light.text.primary,
    },
    h4: {
      fontFamily: typography.fontFamily.heading,
      fontWeight: 700,
      letterSpacing: typography.letterSpacing.heading,
      color: light.text.primary,
    },
    h5: {
      fontFamily: typography.fontFamily.heading,
      fontWeight: 600,
      color: light.text.primary,
    },
    h6: {
      fontFamily: typography.fontFamily.heading,
      fontWeight: 600,
      color: light.text.primary,
    },
    button: { textTransform: 'none' as const, fontWeight: 600 },
    body1: { lineHeight: 1.6, fontSize: 16, color: light.text.primary },
    body2: { lineHeight: 1.6, fontSize: 14, color: light.text.secondary },
    caption: {
      fontSize: 12,
      letterSpacing: typography.letterSpacing.label,
      fontWeight: 500,
      color: light.text.secondary,
    },
  },
  shape: { borderRadius: radius.lg },
  components: {
    ...baseComponents,
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
          position: 'relative',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          background: light.accent.primary,
          color: '#fff',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            padding: 1,
            background: 'linear-gradient(135deg, #047857 0%, #0D9488 100%)',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            pointerEvents: 'none',
          },
          '&:hover': {
            background: light.accent.primaryHover,
            boxShadow: '0 4px 12px rgba(4,120,87,0.35), 0 0 20px rgba(4,120,87,0.2)',
            transform: 'translateY(-2px) scale(1.02)',
          },
        },
        outlined: {
          borderColor: light.surface.borderHover,
          color: light.text.primary,
          '&:hover': {
            borderColor: light.accent.primary,
            backgroundColor: light.accent.primaryMuted,
            boxShadow: `0 0 0 1px ${light.accent.primary}`,
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: light.surface.overlay,
          border: `1px solid ${light.surface.border}`,
          borderRadius: radius.lg,
          boxShadow: light.elevation.card,
          transition: `all ${motion.duration.standard}s ${smoothEase}`,
          '&:hover': {
            borderColor: light.surface.borderHover,
            boxShadow: light.elevation.cardHover,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: light.surface.overlay,
          border: `1px solid ${light.surface.border}`,
          boxShadow: light.elevation.card,
        },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined' as const, fullWidth: true },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: radius.md,
            backgroundColor: light.surface.base,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: light.surface.borderHover,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: light.accent.primary,
              borderWidth: 2,
              boxShadow: `0 0 0 2px rgba(4,120,87,0.15)`,
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'rgba(250,250,249,0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${light.surface.border}`,
          color: light.text.primary,
        },
      },
    },
  },
});
