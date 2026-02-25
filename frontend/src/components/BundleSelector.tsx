import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { motion } from 'framer-motion';

const BUNDLES = [
  { id: 'bundle_10', price: 10, credits: 100, popular: false },
  { id: 'bundle_25', price: 25, credits: 300, popular: true },
  { id: 'bundle_50', price: 50, credits: 750, popular: false },
] as const;

interface Props {
  selected: string | null;
  onSelect: (bundleId: string) => void;
}

export default function BundleSelector({ selected, onSelect }: Props) {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2.5 }}>
      {BUNDLES.map((bundle, i) => (
        <motion.div
          key={bundle.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          whileHover={{ y: -6 }}
          whileTap={{ scale: 0.97 }}
        >
          <Card
            onClick={() => onSelect(bundle.id)}
            sx={{
              cursor: 'pointer',
              position: 'relative',
              border: 2,
              borderColor: selected === bundle.id ? 'primary.main' : 'divider',
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: selected === bundle.id ? 'primary.main' : 'primary.light',
                boxShadow: (t) => `0 8px 24px ${t.palette.primary.main}20`,
              },
            }}
          >
            {bundle.popular && (
              <Chip
                label="Most Popular"
                color="primary"
                size="small"
                sx={{
                  position: 'absolute',
                  top: -12,
                  left: '50%',
                  transform: 'translateX(-50%)',
                }}
              />
            )}
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h3" color="primary" sx={{ fontWeight: 800 }}>
                ${bundle.price}
              </Typography>
              <Typography
                variant="h5"
                sx={{ mt: 1, fontWeight: 700, color: 'text.primary' }}
              >
                {bundle.credits.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                credits
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block', mt: 1.5 }}
              >
                ${(bundle.price / bundle.credits * 100).toFixed(1)}c per credit
              </Typography>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </Box>
  );
}
