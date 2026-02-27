import { motion } from 'framer-motion';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

interface Props {
  variant?: 'text' | 'rectangular' | 'circular';
  width?: number | string;
  height?: number | string;
  sx?: object;
}

export default function SkeletonShimmer({
  variant = 'rectangular',
  width,
  height,
  sx = {},
}: Props) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const shimmerColor = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(5,150,105,0.15)';
  const baseColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';

  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 1,
        ...sx,
      }}
    >
      <Skeleton
        variant={variant}
        width={width}
        height={height}
        sx={{ bgcolor: baseColor }}
      />
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(90deg, transparent 0%, ${shimmerColor} 50%, transparent 100%)`,
          width: '60%',
          pointerEvents: 'none',
        }}
        animate={{ x: ['-100%', '200%'] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      />
    </Box>
  );
}
