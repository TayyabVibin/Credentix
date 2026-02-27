/**
 * CommandModule - Floating glass cards with theme-aware styling
 * Fintech-grade card primitive with optional hover glow.
 */

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

interface Props {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'hero';
  glowOnHover?: boolean;
  sx?: object;
  onClick?: () => void;
}

export default function CommandModule({ children, variant = 'default', glowOnHover = true, sx = {}, onClick }: Props) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const baseStyles = {
    borderRadius: 3,
    transition: 'all 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
    ...(isDark
      ? {
          backdropFilter: 'blur(24px)',
          bgcolor: 'rgba(26,29,36,0.8)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
        }
      : {
          bgcolor: 'rgba(255,255,255,0.9)',
          border: '1px solid rgba(0,0,0,0.06)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)',
        }),
  };

  const variantStyles = {
    default: {},
    elevated: isDark
      ? { boxShadow: '0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.04)' }
      : { boxShadow: '0 4px 20px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)' },
    hero: isDark
      ? {
          border: '1px solid rgba(5,150,105,0.2)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.3), 0 0 40px rgba(5,150,105,0.06)',
        }
      : {
          border: '1px solid rgba(4,120,87,0.15)',
          boxShadow: '0 4px 24px rgba(4,120,87,0.08), 0 0 0 1px rgba(4,120,87,0.05)',
        },
  };

  const hoverStyles = glowOnHover
    ? {
        '&:hover': {
          borderColor: isDark ? 'rgba(5,150,105,0.35)' : 'rgba(4,120,87,0.25)',
          transform: 'translateY(-2px)',
          boxShadow: isDark
            ? '0 12px 48px rgba(0,0,0,0.4), 0 0 48px rgba(5,150,105,0.12)'
            : '0 12px 40px rgba(0,0,0,0.12), 0 0 0 1px rgba(4,120,87,0.15)',
        },
      }
    : {};

  return (
    <Box
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
      sx={{
        ...baseStyles,
        ...variantStyles[variant],
        ...hoverStyles,
        ...(onClick && { cursor: 'pointer' }),
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}
