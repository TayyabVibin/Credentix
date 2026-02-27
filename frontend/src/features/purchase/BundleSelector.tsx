import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded';
import StarRounded from '@mui/icons-material/StarRounded';
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
            <Card
              onClick={() => onSelect(bundle.id)}
              sx={{
                cursor: 'pointer',
                position: 'relative',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                border: 2,
                borderColor: isSelected ? 'primary.main' : 'rgba(255,255,255,0.08)',
                bgcolor: isSelected ? 'rgba(0,229,255,0.06)' : 'rgba(20,23,31,0.7)',
                backdropFilter: 'blur(16px)',
                transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                overflow: 'visible',
                '&:hover': {
                  borderColor: isSelected ? 'primary.main' : 'rgba(0,229,255,0.3)',
                  boxShadow: isSelected ? '0 0 40px rgba(0,229,255,0.15)' : '0 8px 32px rgba(0,0,0,0.2)',
                },
              }}
            >
              {bundle.popular && (
                <Chip icon={<StarRounded sx={{ fontSize: 16 }} />} label="Recommended" color="primary" size="small" sx={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', fontWeight: 700, px: 1 }} />
              )}
              <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', flex: 1 }}>
                <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 1.5, mb: 0.5 }}>{bundle.label}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, mb: 0.5 }}>
                  <Typography variant="h2" sx={{ fontWeight: 900, lineHeight: 1 }}>${bundle.price}</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>one-time</Typography>
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.light', mb: 1 }}>{bundle.credits.toLocaleString()} credits</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>{(bundle.price / bundle.credits * 100).toFixed(1)}c per credit</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>{bundle.tagline}</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, flex: 1 }}>
                  {bundle.features.map((f) => (
                    <Box key={f} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <CheckCircleRounded sx={{ fontSize: 18, color: 'primary.main' }} />
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>{f}</Typography>
                    </Box>
                  ))}
                </Box>
                <Box sx={{ mt: 3, py: 1.5, textAlign: 'center', borderRadius: 2, border: '1px solid', borderColor: isSelected ? 'primary.main' : 'rgba(255,255,255,0.1)', bgcolor: isSelected ? 'primary.main' : 'transparent', color: isSelected ? '#fff' : 'text.secondary', fontWeight: 600, fontSize: '0.875rem', transition: 'all 0.25s ease' }}>
                  {isSelected ? 'Selected' : 'Select Plan'}
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </Box>
  );
}
