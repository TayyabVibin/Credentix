import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import LogoutRounded from '@mui/icons-material/LogoutRounded';
import PersonRounded from '@mui/icons-material/PersonRounded';
import PageTransition from '../components/PageTransition.tsx';
import { useAppDispatch, useAppSelector } from '../store/hooks.ts';
import { logout, fetchProfile } from '../store/authSlice.ts';

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((s) => s.auth);
  const { balance } = useAppSelector((s) => s.wallet);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <PageTransition>
      <Box>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Profile
        </Typography>

        <Card sx={{ maxWidth: 520 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mb: 3 }}>
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  bgcolor: 'primary.main',
                  fontSize: 28,
                }}
              >
                <PersonRounded fontSize="large" />
              </Avatar>
              <Box>
                <Typography variant="h6">{user?.email}</Typography>
                <Chip
                  label={user?.role}
                  color={user?.role === 'ADMIN' ? 'secondary' : 'default'}
                  size="small"
                  sx={{ mt: 0.5 }}
                />
              </Box>
            </Box>

            <Divider sx={{ my: 2.5 }} />

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Credit Balance
                </Typography>
                <Typography variant="h6" fontWeight={700}>
                  {balance.toLocaleString()}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Member Since
                </Typography>
                <Typography variant="h6" fontWeight={700}>
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        year: 'numeric',
                      })
                    : '—'}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2.5 }} />

            <Button
              variant="outlined"
              color="error"
              startIcon={<LogoutRounded />}
              onClick={handleLogout}
              fullWidth
            >
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </Box>
    </PageTransition>
  );
}
