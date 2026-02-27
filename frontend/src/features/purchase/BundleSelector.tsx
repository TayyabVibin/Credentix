import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Icon from '../../design-system/primitives/Icon';
import CommandModule from '../../design-system/primitives/CommandModule';
import { typography } from '../../design-system/tokens';
import { AnimatedCounter } from '../../motion';
import { motion } from 'framer-motion';

const BUNDLES = [
  { id: 'bundle_10', price: 10, credits: 100, popular: false, label: 'Starter', tagline: 'Perfect for testing & evaluation', features: ['100 API credits', 'Standard webhook delivery', 'Basic analytics', 'Community support'] },
  { id: 'bundle_25', price: 25, credits: 300, popular: true, label: 'Professional', tagline: 'Best value for growing projects', features: ['300 API credits', 'Priority webhook delivery', 'Advanced analytics', 'Email support', 'Higher rate limits'] },
  { id: 'bundle_50', price: 50, credits: 750, popular: false, label: 'Enterprise', tagline: 'Maximum power for production', features: ['750 API credits', 'Guaranteed webhook ordering', 'Full analytics suite', 'Priority support', 'Custom rate limits', 'Audit logs'] },
] as const;

interface Props {
  selected: string | null;
  onSelect: (bundleId: string) => void;
}

export default function BundleSelector({ selected, onSelect }: Props) {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3, alignItems: 'stretch' }}>
      {BUNDLES.map((bundle, i) => {
        const isSelected = selected === bundle.id;
        return (
          <motion.div
            key={bundle.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.12, type: 'spring', stiffness: 200, damping: 25 }}
            whileHover={{ y: -8, transition: { duration: 0.25 } }}
            whileTap={{ scale: 0.98 }}
            style={{ display: 'flex' }}
          >
            <CommandModule
              variant={isSelected ? 'hero' : 'default'}
              glowOnHover
              sx={{
                position: 'relative',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                border: 2,
                borderColor: isSelected ? 'primary.main' : 'divider',
                bgcolor: isSelected ? 'action.selected' : undefined,
                overflow: 'visible',
                '&:hover': {
                  borderColor: 'primary.main',
                },
              }}
              onClick={() => onSelect(bundle.id)}
            >
              {bundle.popular && (
                <Chip icon={<Icon name="trendingUp" size={14} />} label="Recommended" color="primary" size="small" sx={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', fontWeight: 700, px: 1 }} />
              )}
              <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', flex: 1 }}>
                <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 1.5, mb: 0.5 }}>{bundle.label}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, mb: 0.5 }}>
                  <Typography variant="h2" sx={{ ...typography.scale.monetary, fontWeight: 900, lineHeight: 1 }}>
                    <AnimatedCounter value={bundle.price} prefix="$" />
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>one-time</Typography>
                </Box>
                <Typography variant="h5" sx={{ ...typography.scale.monetary, color: 'primary.light', mb: 1 }}>
                  <AnimatedCounter value={bundle.credits} suffix=" credits" />
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>{(bundle.price / bundle.credits * 100).toFixed(1)}c per credit</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>{bundle.tagline}</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, flex: 1 }}>
                  {bundle.features.map((f) => (
                    <Box key={f} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'primary.main' }}>
                      <Icon name="checkCircle" size={18} />
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>{f}</Typography>
                    </Box>
                  ))}
                </Box>
                <Box sx={{ mt: 3, py: 1.5, textAlign: 'center', borderRadius: 2, border: '1px solid', borderColor: isSelected ? 'primary.main' : 'divider', bgcolor: isSelected ? 'primary.main' : 'transparent', color: isSelected ? '#fff' : 'text.secondary', fontWeight: 600, fontSize: '0.875rem', transition: 'all 0.25s ease' }}>
                  {isSelected ? 'Selected' : 'Select Plan'}
                </Box>
              </Box>
            </CommandModule>
          </motion.div>
        );
      })}
    </Box>
  );
}
