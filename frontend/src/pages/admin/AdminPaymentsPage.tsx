import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Pagination from '@mui/material/Pagination';
import Skeleton from '@mui/material/Skeleton';
import IconButton from '@mui/material/IconButton';
import SearchRounded from '@mui/icons-material/SearchRounded';
import VisibilityRounded from '@mui/icons-material/VisibilityRounded';
import StatusBadge from '../../components/StatusBadge.tsx';
import PageTransition from '../../components/PageTransition.tsx';
import { useAppDispatch, useAppSelector } from '../../store/hooks.ts';
import { fetchAdminPayments } from '../../store/adminSlice.ts';

const STATUS_OPTIONS = [
  '',
  'INITIATED',
  'AUTHORIZED',
  'CAPTURED',
  'PENDING',
  'FAILED',
  'REFUSED',
  'CANCELED',
  'ERROR',
];

export default function AdminPaymentsPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    payments,
    paymentsPage,
    paymentsPages,
    loading,
  } = useAppSelector((s) => s.admin);

  useEffect(() => {
    dispatch(
      fetchAdminPayments({
        page,
        limit: 20,
        status: status || undefined,
        search: search || undefined,
      }),
    );
  }, [dispatch, page, status, search]);

  const handleSearch = () => setSearch(searchInput);
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const formatAmount = (minor: number) =>
    `$${(minor / 100).toFixed(2)}`;

  return (
    <PageTransition>
      <Box>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Payments
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            mb: 3,
            alignItems: 'center',
          }}
        >
          <TextField
            size="small"
            placeholder="Search ref, PSP, email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
            slotProps={{
              input: {
                startAdornment: (
                  <Box component="span" sx={{ mr: 1, display: 'flex' }}>
                    <SearchRounded fontSize="small" color="action" />
                  </Box>
                ),
              },
            }}
            sx={{ width: 280 }}
          />
          <Box
            component="button"
            onClick={handleSearch}
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              border: 'none',
              borderRadius: 2,
              px: 2,
              py: 1,
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Search
          </Box>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={status}
              label="Status"
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
            >
              <MenuItem value="">All</MenuItem>
              {STATUS_OPTIONS.filter(Boolean).map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <TableContainer component={Paper} elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Reference</TableCell>
                <TableCell>User</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton variant="text" width={120} /></TableCell>
                    <TableCell><Skeleton variant="text" width={100} /></TableCell>
                    <TableCell><Skeleton variant="text" width={60} /></TableCell>
                    <TableCell><Skeleton variant="text" width={80} /></TableCell>
                    <TableCell><Skeleton variant="text" width={100} /></TableCell>
                    <TableCell />
                  </TableRow>
                ))
              ) : payments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} sx={{ py: 6, textAlign: 'center', color: 'text.secondary' }}>
                    No payments found
                  </TableCell>
                </TableRow>
              ) : (
                payments.map((p) => (
                  <TableRow key={p.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {p.merchantReference}
                      </Typography>
                      {p.pspReference && (
                        <Typography variant="caption" color="text.secondary">
                          {p.pspReference}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>{p.userEmail}</TableCell>
                    <TableCell align="right">{formatAmount(p.amountMinor)}</TableCell>
                    <TableCell><StatusBadge status={p.status} /></TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(p.createdAt).toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/admin/payments/${p.id}`)}
                        aria-label="View detail"
                      >
                        <VisibilityRounded fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {paymentsPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination
              count={paymentsPages}
              page={paymentsPage}
              onChange={(_, p) => setPage(p)}
              color="primary"
              shape="rounded"
            />
          </Box>
        )}
      </Box>
    </PageTransition>
  );
}
