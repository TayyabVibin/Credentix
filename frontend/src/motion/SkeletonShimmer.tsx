import { motion } from 'framer-motion';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';

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
        sx={{
          bgcolor: 'rgba(255,255,255,0.06)',
        }}
      />
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(90deg, transparent 0%, rgba(0,229,255,0.1) 50%, transparent 100%)`,
          width: '60%',
          pointerEvents: 'none',
        }}
        animate={{ x: ['-100%', '200%'] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      />
    </Box>
  );
}
