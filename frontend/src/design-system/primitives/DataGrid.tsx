/**
 * DataGrid - Layered data grid with sticky header and row hover glow
 * Fintech-grade table primitive.
 */

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Skeleton from '@mui/material/Skeleton';
import { useTheme } from '@mui/material/styles';

interface Column<T> {
  id: string;
  label: string;
  align?: 'left' | 'right' | 'center';
  render?: (row: T) => React.ReactNode;
  minWidth?: number;
}

interface Props<T> {
  columns: Column<T>[];
  rows: T[];
  getRowId: (row: T) => string;
  size?: 'small' | 'medium';
  loading?: boolean;
  loadingRows?: number;
  emptyMessage?: string;
}

export default function DataGrid<T>({
  columns,
  rows,
  getRowId,
  size = 'medium',
  loading = false,
  loadingRows = 5,
  emptyMessage = 'No data',
}: Props<T>) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const accentGlow = isDark ? 'rgba(5,150,105,0.1)' : 'rgba(4,120,87,0.06)';

  return (
    <TableContainer
      sx={{
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        overflow: 'auto',
        bgcolor: 'transparent',
      }}
    >
      <Table size={size} stickyHeader>
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell
                key={col.id}
                align={col.align}
                sx={{
                  position: 'sticky',
                  top: 0,
                  zIndex: 1,
                  backdropFilter: 'blur(12px)',
                  bgcolor: 'background.paper',
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'text.secondary',
                  minWidth: col.minWidth,
                  py: size === 'medium' ? 2 : 1.5,
                }}
              >
                {col.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            Array.from({ length: loadingRows }).map((_, i) => (
              <TableRow key={`skeleton-${i}`}>
                {columns.map((col) => (
                  <TableCell key={col.id} sx={{ borderColor: 'divider' }}>
                    <Skeleton variant="text" width={80} />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} sx={{ py: 6, textAlign: 'center', color: 'text.secondary', borderColor: 'divider' }}>
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
          rows.map((row) => (
            <TableRow
              key={getRowId(row)}
              sx={{
                transition: 'all 0.2s ease',
                borderLeft: '3px solid transparent',
                '&:hover': {
                  bgcolor: accentGlow,
                  borderLeftColor: isDark ? 'rgba(5,150,105,0.4)' : 'rgba(4,120,87,0.3)',
                },
                '&:nth-of-type(even)': {
                  bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
                },
                '&:nth-of-type(even):hover': {
                  bgcolor: accentGlow,
                  borderLeftColor: isDark ? 'rgba(5,150,105,0.4)' : 'rgba(4,120,87,0.3)',
                },
              }}
            >
              {columns.map((col) => (
                <TableCell
                  key={col.id}
                  align={col.align}
                  sx={{ borderColor: 'divider', py: size === 'medium' ? 2 : 1.5 }}
                >
                  {col.render ? col.render(row) : (row as Record<string, unknown>)[col.id] as React.ReactNode}
                </TableCell>
              ))}
            </TableRow>
          ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
