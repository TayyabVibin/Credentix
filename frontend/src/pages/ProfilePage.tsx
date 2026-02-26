import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import LogoutRounded from '@mui/icons-material/LogoutRounded';
import PersonRounded from '@mui/icons-material/PersonRounded';
import EditRounded from '@mui/icons-material/EditRounded';
import SaveRounded from '@mui/icons-material/SaveRounded';
import CancelRounded from '@mui/icons-material/CancelRounded';
import PhotoCameraRounded from '@mui/icons-material/PhotoCameraRounded';
import BusinessRounded from '@mui/icons-material/BusinessRounded';
import WorkRounded from '@mui/icons-material/WorkRounded';
import PublicRounded from '@mui/icons-material/PublicRounded';
import AccountBalanceWalletRounded from '@mui/icons-material/AccountBalanceWalletRounded';
import VerifiedRounded from '@mui/icons-material/VerifiedRounded';
import { motion } from 'framer-motion';
import { useSnackbar } from 'notistack';
import PageTransition from '../components/PageTransition.tsx';
import { useAppDispatch, useAppSelector } from '../store/hooks.ts';
import { logout, fetchProfile, updateProfile } from '../store/authSlice.ts';

const ROLES = ['Developer', 'Designer', 'Product Manager', 'Engineering Manager', 'CTO / VP Engineering', 'Founder / CEO', 'Student', 'Other'];
const BUSINESS_TYPES = ['SaaS', 'E-commerce', 'Fintech', 'Healthcare', 'Education', 'Media', 'Consulting', 'Other'];
const COUNTRIES = ['United States', 'United Kingdom', 'Canada', 'Germany', 'France', 'Australia', 'India', 'Japan', 'Brazil', 'Netherlands', 'United Arab Emirates', 'Other'];

const GLASS = {
  backdropFilter: 'blur(16px)',
  bgcolor: 'rgba(30,41,59,0.55)',
  border: '1px solid rgba(255,255,255,0.08)',
};

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((s) => s.auth);
  const { balance } = useAppSelector((s) => s.wallet);
  const { enqueueSnackbar } = useSnackbar();

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    company: '',
    userTitle: '',
    useCase: '',
    country: '',
    businessType: '',
    avatarUrl: '',
  });

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName ?? '',
        company: user.company ?? '',
        userTitle: user.userTitle ?? '',
        useCase: user.useCase ?? '',
        country: user.country ?? '',
        businessType: user.businessType ?? '',
        avatarUrl: user.avatarUrl ?? '',
      });
    }
  }, [user]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      enqueueSnackbar('Image must be under 2MB', { variant: 'error' });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, avatarUrl: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await dispatch(updateProfile(form)).unwrap();
      enqueueSnackbar('Profile updated successfully', { variant: 'success' });
      setEditing(false);
    } catch {
      enqueueSnackbar('Failed to update profile', { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setForm({
        fullName: user.fullName ?? '',
        company: user.company ?? '',
        userTitle: user.userTitle ?? '',
        useCase: user.useCase ?? '',
        country: user.country ?? '',
        businessType: user.businessType ?? '',
        avatarUrl: user.avatarUrl ?? '',
      });
    }
    setEditing(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const displayName = user?.fullName || user?.email || '';

  return (
    <PageTransition>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              background: 'linear-gradient(135deg, #F1F5F9, #818CF8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Profile
          </Typography>
          {!editing ? (
            <Button
              variant="outlined"
              startIcon={<EditRounded />}
              onClick={() => setEditing(true)}
              sx={{ borderColor: 'rgba(255,255,255,0.15)', color: '#94A3B8' }}
            >
              Edit Profile
            </Button>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<CancelRounded />}
                onClick={handleCancel}
                sx={{ borderColor: 'rgba(255,255,255,0.15)', color: '#94A3B8' }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <SaveRounded />}
                onClick={handleSave}
                disabled={saving}
                sx={{ background: 'linear-gradient(135deg, #6366F1, #818CF8)' }}
              >
                Save
              </Button>
            </Box>
          )}
        </Box>

        <Grid container spacing={3}>
          {/* Profile Card */}
          <Grid size={{ xs: 12, md: 4 }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
              <Card sx={{ ...GLASS, textAlign: 'center' }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ position: 'relative', display: 'inline-block', mb: 3 }}>
                    <Avatar
                      src={form.avatarUrl || undefined}
                      sx={{
                        width: 100,
                        height: 100,
                        bgcolor: 'primary.dark',
                        fontSize: 40,
                        border: '3px solid rgba(129,140,248,0.3)',
                      }}
                    >
                      {form.avatarUrl ? null : <PersonRounded sx={{ fontSize: 48 }} />}
                    </Avatar>
                    {editing && (
                      <IconButton
                        component="label"
                        sx={{
                          position: 'absolute',
                          bottom: -4,
                          right: -4,
                          bgcolor: 'primary.main',
                          color: '#fff',
                          width: 36,
                          height: 36,
                          '&:hover': { bgcolor: 'primary.dark' },
                        }}
                      >
                        <PhotoCameraRounded sx={{ fontSize: 18 }} />
                        <input type="file" hidden accept="image/*" onChange={handleAvatarChange} />
                      </IconButton>
                    )}
                  </Box>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
                    {displayName}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#94A3B8', mb: 2 }}>
                    {user?.email}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 3 }}>
                    <Chip
                      label={user?.role}
                      color={user?.role === 'ADMIN' ? 'secondary' : 'default'}
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                    <Chip
                      icon={<VerifiedRounded sx={{ fontSize: 16 }} />}
                      label="Active"
                      color="success"
                      size="small"
                      variant="outlined"
                    />
                  </Box>

                  <Box
                    sx={{
                      p: 2.5,
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(56,189,248,0.1))',
                      border: '1px solid rgba(129,140,248,0.15)',
                      mb: 3,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 0.5 }}>
                      <AccountBalanceWalletRounded sx={{ color: '#818CF8', fontSize: 20 }} />
                      <Typography variant="caption" sx={{ color: '#94A3B8' }}>Credit Balance</Typography>
                    </Box>
                    <Typography variant="h4" fontWeight={800} sx={{ color: '#F1F5F9' }}>
                      {balance.toLocaleString()}
                    </Typography>
                  </Box>

                  <Typography variant="caption" sx={{ color: '#64748B' }}>
                    Member since{' '}
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
                      : '—'}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Button
                variant="outlined"
                color="error"
                startIcon={<LogoutRounded />}
                onClick={handleLogout}
                fullWidth
                sx={{ mt: 2 }}
              >
                Sign Out
              </Button>
            </motion.div>
          </Grid>

          {/* Details Card */}
          <Grid size={{ xs: 12, md: 8 }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
              <Card sx={{ ...GLASS }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
                    Personal Information
                  </Typography>
                  <Grid container spacing={2.5}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        label="Full Name"
                        value={form.fullName}
                        onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                        disabled={!editing}
                        slotProps={{ input: { startAdornment: <InputAdornment position="start"><PersonRounded sx={{ color: '#64748B' }} /></InputAdornment> } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        label="Email"
                        value={user?.email ?? ''}
                        disabled
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        label="Company"
                        value={form.company}
                        onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                        disabled={!editing}
                        slotProps={{ input: { startAdornment: <InputAdornment position="start"><BusinessRounded sx={{ color: '#64748B' }} /></InputAdornment> } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        select
                        label="Role"
                        value={form.userTitle}
                        onChange={(e) => setForm((f) => ({ ...f, userTitle: e.target.value }))}
                        disabled={!editing}
                        slotProps={{ input: { startAdornment: <InputAdornment position="start"><WorkRounded sx={{ color: '#64748B' }} /></InputAdornment> } }}
                      >
                        <MenuItem value="">—</MenuItem>
                        {ROLES.map((r) => (
                          <MenuItem key={r} value={r}>{r}</MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  </Grid>

                  <Typography variant="h6" fontWeight={700} sx={{ mt: 4, mb: 3 }}>
                    Additional Details
                  </Typography>
                  <Grid container spacing={2.5}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        select
                        label="Country"
                        value={form.country}
                        onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                        disabled={!editing}
                        slotProps={{ input: { startAdornment: <InputAdornment position="start"><PublicRounded sx={{ color: '#64748B' }} /></InputAdornment> } }}
                      >
                        <MenuItem value="">—</MenuItem>
                        {COUNTRIES.map((c) => (
                          <MenuItem key={c} value={c}>{c}</MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        select
                        label="Business Type"
                        value={form.businessType}
                        onChange={(e) => setForm((f) => ({ ...f, businessType: e.target.value }))}
                        disabled={!editing}
                        slotProps={{ input: { startAdornment: <InputAdornment position="start"><BusinessRounded sx={{ color: '#64748B' }} /></InputAdornment> } }}
                      >
                        <MenuItem value="">—</MenuItem>
                        {BUSINESS_TYPES.map((b) => (
                          <MenuItem key={b} value={b}>{b}</MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid size={12}>
                      <TextField
                        label="Use Case"
                        value={form.useCase}
                        onChange={(e) => setForm((f) => ({ ...f, useCase: e.target.value }))}
                        disabled={!editing}
                        multiline
                        minRows={2}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Box>
    </PageTransition>
  );
}
