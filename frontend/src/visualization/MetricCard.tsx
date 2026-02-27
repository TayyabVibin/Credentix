import { motion } from 'framer-motion';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

interface Props {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  loading?: boolean;
}

export default function MetricCard({ title, value, subtitle, icon, loading }: Props) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Card>
        <CardContent sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'primary.main', color: 'white' }}>{icon}</Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" color="text.secondary">{title}</Typography>
            {loading ? (
              <Skeleton variant="text" width={80} height={40} />
            ) : (
              <Typography variant="h4" fontWeight={800} sx={{ fontVariantNumeric: 'tabular-nums' }}>{value}</Typography>
            )}
            {subtitle && <Typography variant="caption" color="text.secondary">{subtitle}</Typography>}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
}
