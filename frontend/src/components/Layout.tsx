import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import MenuRounded from '@mui/icons-material/MenuRounded';
import AccountBalanceWalletRounded from '@mui/icons-material/AccountBalanceWalletRounded';
import ShoppingCartRounded from '@mui/icons-material/ShoppingCartRounded';
import ReceiptLongRounded from '@mui/icons-material/ReceiptLongRounded';
import PersonRounded from '@mui/icons-material/PersonRounded';
import LogoutRounded from '@mui/icons-material/LogoutRounded';
import AdminPanelSettingsRounded from '@mui/icons-material/AdminPanelSettingsRounded';
import ThemeToggle from './ThemeToggle.tsx';
import { useAppDispatch, useAppSelector } from '../store/hooks.ts';
import { logout } from '../store/authSlice.ts';

const NAV_ITEMS = [
  { label: 'Wallet', path: '/wallet', icon: <AccountBalanceWalletRounded /> },
  { label: 'Purchase', path: '/purchase', icon: <ShoppingCartRounded /> },
  { label: 'Transactions', path: '/transactions', icon: <ReceiptLongRounded /> },
  { label: 'Profile', path: '/profile', icon: <PersonRounded /> },
  { label: 'Admin', path: '/admin', icon: <AdminPanelSettingsRounded />, adminOnly: true },
];

interface Props {
  themeMode: 'light' | 'dark';
  onThemeToggle: () => void;
}

export default function Layout({ themeMode, onThemeToggle }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const filteredItems = NAV_ITEMS.filter(
    (item) => !('adminOnly' in item && item.adminOnly) || user?.role === 'ADMIN',
  );

  const drawerContent = (
    <Box sx={{ width: 270, pt: 2 }}>
      <Box sx={{ px: 3, pb: 2, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Typography
          variant="h6"
          fontWeight={800}
          sx={{
            background: 'linear-gradient(135deg, #818CF8, #38BDF8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Credentix
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 2 }}>
          <Avatar
            src={user?.avatarUrl ?? undefined}
            sx={{ width: 36, height: 36, bgcolor: 'primary.dark', fontSize: 14 }}
          >
            {user?.fullName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight={600} sx={{ color: '#F1F5F9' }}>
              {user?.fullName || user?.email}
            </Typography>
            {user?.fullName && (
              <Typography variant="caption" sx={{ color: '#64748B' }}>
                {user.email}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
      <List sx={{ px: 1, pt: 1.5 }}>
        {filteredItems.map((item) => (
          <ListItemButton
            key={item.path}
            selected={location.pathname === item.path}
            onClick={() => {
              navigate(item.path);
              setDrawerOpen(false);
            }}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              '&.Mui-selected': {
                bgcolor: 'rgba(99,102,241,0.12)',
                '&:hover': { bgcolor: 'rgba(99,102,241,0.18)' },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: location.pathname === item.path ? '#818CF8' : '#94A3B8' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                fontWeight: location.pathname === item.path ? 600 : 400,
                color: location.pathname === item.path ? '#F1F5F9' : '#94A3B8',
              }}
            />
          </ListItemButton>
        ))}
        <ListItemButton
          onClick={handleLogout}
          sx={{ borderRadius: 2, mt: 2, color: 'error.main' }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
            <LogoutRounded />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: themeMode === 'dark' ? 'rgba(11,15,26,0.8)' : 'rgba(248,250,252,0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid',
          borderColor: 'divider',
          color: 'text.primary',
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton edge="start" onClick={() => setDrawerOpen(true)} sx={{ mr: 1 }}>
              <MenuRounded />
            </IconButton>
          )}
          <Typography
            variant="h6"
            fontWeight={800}
            sx={{
              cursor: 'pointer',
              background: 'linear-gradient(135deg, #818CF8, #38BDF8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
            onClick={() => navigate('/wallet')}
          >
            Credentix
          </Typography>
          <Box sx={{ flex: 1 }} />

          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 0.5, mr: 1 }}>
              {filteredItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    sx={{
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? 'primary.main' : 'text.secondary',
                      borderRadius: 2,
                      position: 'relative',
                      '&::after': isActive
                        ? {
                            content: '""',
                            position: 'absolute',
                            bottom: 4,
                            left: '25%',
                            width: '50%',
                            height: 2,
                            borderRadius: 1,
                            background: 'linear-gradient(90deg, #818CF8, #38BDF8)',
                          }
                        : {},
                      '&:hover': {
                        bgcolor: themeMode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </Box>
          )}

          <ThemeToggle mode={themeMode} onToggle={onThemeToggle} />

          {!isMobile && (
            <IconButton
              onClick={() => navigate('/profile')}
              sx={{ ml: 1 }}
            >
              <Avatar
                src={user?.avatarUrl ?? undefined}
                sx={{ width: 32, height: 32, bgcolor: 'primary.dark', fontSize: 14 }}
              >
                {user?.fullName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
              </Avatar>
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        {drawerContent}
      </Drawer>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
