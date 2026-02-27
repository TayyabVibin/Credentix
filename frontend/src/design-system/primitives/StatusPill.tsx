import Chip from '@mui/material/Chip';
import Icon from './Icon';

const STATUS_CONFIG: Record<
  string,
  { color: 'success' | 'error' | 'warning' | 'info' | 'default'; label: string; icon: 'checkCircle' | 'xCircle' | 'clock' | 'trendingUp' }
> = {
  CAPTURED: { color: 'success', label: 'Captured', icon: 'checkCircle' },
  AUTHORIZED: { color: 'info', label: 'Authorized', icon: 'clock' },
  INITIATED: { color: 'info', label: 'Initiated', icon: 'clock' },
  PENDING: { color: 'warning', label: 'Pending', icon: 'clock' },
  FAILED: { color: 'error', label: 'Failed', icon: 'xCircle' },
  REFUSED: { color: 'error', label: 'Refused', icon: 'xCircle' },
  CANCELED: { color: 'default', label: 'Canceled', icon: 'xCircle' },
  ERROR: { color: 'error', label: 'Error', icon: 'xCircle' },
};

interface Props {
  status: string;
}

export default function StatusPill({ status }: Props) {
  const config = STATUS_CONFIG[status] ?? { color: 'default' as const, label: status, icon: 'clock' as const };
  return (
    <Chip
      icon={<Icon name={config.icon} size={14} />}
      label={config.label}
      color={config.color}
      size="small"
      variant="filled"
      sx={{
        fontWeight: 600,
        minWidth: 80,
        '& .MuiChip-icon': { color: 'inherit' },
        boxShadow:
          config.color === 'success'
            ? '0 0 12px rgba(5,150,105,0.3)'
            : config.color === 'error'
              ? '0 0 12px rgba(220,38,38,0.2)'
              : undefined,
      }}
    />
  );
}
