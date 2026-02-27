import { motion } from 'framer-motion';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CommandModule from '../design-system/primitives/CommandModule';
import { AnimatedCounter, SkeletonShimmer } from '../motion';
import { typography } from '../design-system/tokens';

interface Props {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  loading?: boolean;
  format?: (n: number) => string;
}

export default function MetricCard({ title, value, subtitle, icon, loading, format }: Props) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <CommandModule>
        <Box sx={{ p: 3, display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'primary.main', color: 'white' }}>{icon}</Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" color="text.secondary">{title}</Typography>
            {loading ? (
              <SkeletonShimmer variant="text" width={80} height={40} />
            ) : typeof value === 'number' ? (
              <Typography variant="h4" fontWeight={800} sx={typography.scale.monetary}>
                <AnimatedCounter value={value} format={format} />
              </Typography>
            ) : (
              <Typography variant="h4" fontWeight={800} sx={typography.scale.monetary}>{value}</Typography>
            )}
            {subtitle && <Typography variant="caption" color="text.secondary">{subtitle}</Typography>}
          </Box>
        </Box>
      </CommandModule>
    </motion.div>
  );
}
