import Chip from '@mui/material/Chip';

const STATUS_CONFIG: Record<string, { color: 'success' | 'error' | 'warning' | 'info' | 'default'; label: string }> = {
  CAPTURED: { color: 'success', label: 'Captured' },
  AUTHORIZED: { color: 'info', label: 'Authorized' },
  INITIATED: { color: 'info', label: 'Initiated' },
  PENDING: { color: 'warning', label: 'Pending' },
  FAILED: { color: 'error', label: 'Failed' },
  REFUSED: { color: 'error', label: 'Refused' },
  CANCELED: { color: 'default', label: 'Canceled' },
  ERROR: { color: 'error', label: 'Error' },
};

interface Props {
  status: string;
}

export default function StatusPill({ status }: Props) {
  const config = STATUS_CONFIG[status] ?? { color: 'default' as const, label: status };
  return (
    <Chip
      label={config.label}
      color={config.color}
      size="small"
      variant="filled"
      sx={{
        fontWeight: 600,
        minWidth: 80,
        boxShadow:
          config.color === 'success'
            ? '0 0 12px rgba(16,185,129,0.3)'
            : config.color === 'error'
              ? '0 0 12px rgba(248,113,113,0.2)'
              : undefined,
      }}
    />
  );
}
