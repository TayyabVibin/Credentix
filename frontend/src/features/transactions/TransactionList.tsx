import CommandModule from '../../design-system/primitives/CommandModule';
import DataGrid from '../../design-system/primitives/DataGrid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Icon from '../../design-system/primitives/Icon';
import { typography } from '../../design-system/tokens';
import { SkeletonShimmer } from '../../motion';

interface Entry {
  id: string;
  credits: number;
  balanceAfter: number;
  paymentId: string;
  createdAt: string;
}

interface Props {
  entries: Entry[];
  loading?: boolean;
  compact?: boolean;
  /** When true, render table only (no CommandModule wrapper). Use when parent provides the card. */
  noCard?: boolean;
}

const COLUMNS = [
  {
    id: 'credits',
    label: 'Credits',
    render: (row: Entry) => (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'success.main' }}>
        <Icon name="plusCircle" size={20} />
        <Typography variant="body1" fontWeight={600} sx={{ ...typography.scale.monetary, fontSize: '1rem' }}>+{row.credits}</Typography>
      </Box>
    ),
  },
  {
    id: 'balanceAfter',
    label: 'Balance After',
    align: 'right' as const,
    render: (row: Entry) => <Typography variant="body1" fontWeight={600} sx={{ ...typography.scale.monetary, fontSize: '1rem' }}>{row.balanceAfter.toLocaleString()}</Typography>,
  },
  {
    id: 'createdAt',
    label: 'Date',
    align: 'right' as const,
    render: (row: Entry) => (
      <Typography variant="body1" color="text.secondary" sx={{ fontSize: '0.9rem' }}>
        {new Date(row.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
      </Typography>
    ),
  },
];

export default function TransactionList({ entries, loading, compact, noCard }: Props) {
  const tableContent = loading ? (
    <Box>
      {Array.from({ length: compact ? 3 : 5 }).map((_, i) => (
        <SkeletonShimmer key={i} variant="rectangular" width="100%" height={56} sx={{ mb: 1.5, borderRadius: 1 }} />
      ))}
    </Box>
  ) : entries.length === 0 ? (
    <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
      <Typography>No transactions yet. Purchase credits to get started!</Typography>
    </Box>
  ) : (
    <DataGrid
      columns={COLUMNS}
      rows={entries}
      getRowId={(r) => r.id}
      size="medium"
    />
  );

  if (noCard) return tableContent;

  return (
    <CommandModule glowOnHover={false} sx={{ overflow: 'hidden', p: 0 }}>
      {tableContent}
    </CommandModule>
  );
}
