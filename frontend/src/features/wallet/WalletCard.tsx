import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import Icon from '../../design-system/primitives/Icon';
import { motion } from 'framer-motion';
import { typography } from '../../design-system/tokens';
import { AnimatedCounter, SkeletonShimmer } from '../../motion';
import CommandModule from '../../design-system/primitives/CommandModule';

interface Props {
  balance: number;
  loading?: boolean;
}

export default function WalletCard({ balance, loading }: Props) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <motion.div whileHover={{ y: -4, scale: 1.01 }} transition={{ duration: 0.25 }}>
      <CommandModule variant="hero" glowOnHover>
        <Box sx={{ position: 'relative', overflow: 'hidden', p: { xs: 4, md: 5 }, minHeight: 200 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4, position: 'relative', zIndex: 2 }}>
            <Box sx={{ width: 56, height: 56, borderRadius: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: isDark ? 'rgba(5,150,105,0.2)' : 'rgba(4,120,87,0.12)', border: '1px solid', borderColor: isDark ? 'rgba(5,150,105,0.3)' : 'rgba(4,120,87,0.2)' }}>
              <Icon name="wallet" size={28} />
            </Box>
            <Box>
              <Typography variant="body1" sx={{ opacity: 0.9, fontWeight: 600, letterSpacing: '0.04em', fontSize: '1rem' }}>Available Balance</Typography>
            </Box>
          </Box>
          {loading ? (
            <SkeletonShimmer variant="text" width={200} height={72} />
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, position: 'relative', zIndex: 2 }}>
              <Typography variant="h2" sx={{ ...typography.scale.monetary, fontWeight: 900, lineHeight: 1.1, fontSize: { xs: '2.75rem', md: '3.5rem' } }}>
                <AnimatedCounter value={balance} suffix=" " />
              </Typography>
              <Typography variant="h5" sx={{ opacity: 0.8, fontWeight: 500, fontSize: '1.25rem' }}>credits</Typography>
            </Box>
          )}
          <Box sx={{ position: 'absolute', top: -80, right: -80, width: 240, height: 240, borderRadius: '50%', background: isDark ? 'radial-gradient(circle, rgba(5,150,105,0.15) 0%, transparent 65%)' : 'radial-gradient(circle, rgba(4,120,87,0.1) 0%, transparent 65%)', pointerEvents: 'none' }} />
          <Box sx={{ position: 'absolute', bottom: -60, left: -60, width: 180, height: 180, borderRadius: '50%', background: isDark ? 'radial-gradient(circle, rgba(217,119,6,0.08) 0%, transparent 65%)' : 'radial-gradient(circle, rgba(180,83,9,0.05) 0%, transparent 65%)', pointerEvents: 'none' }} />
        </Box>
      </CommandModule>
    </motion.div>
  );
}
