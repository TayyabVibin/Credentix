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
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import MenuRounded from '@mui/icons-material/MenuRounded';
import DashboardRounded from '@mui/icons-material/DashboardRounded';
import PaymentRounded from '@mui/icons-material/PaymentRounded';
import WebhookRounded from '@mui/icons-material/WebhookRounded';
import HomeRounded from '@mui/icons-material/HomeRounded';
import LogoutRounded from '@mui/icons-material/LogoutRounded';
import ThemeToggle from './ThemeToggle';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/authSlice';
import { gradients } from '../design-system/tokens';

const ADMIN_NAV = [
  { label: 'Dashboard', path: '/admin', icon: <DashboardRounded /> },
  { label: 'Payments', path: '/admin/payments', icon: <PaymentRounded /> },
  { label: 'Webhooks', path: '/admin/webhooks', icon: <WebhookRounded /> },
];

interface Props {
  themeMode: 'light' | 'dark';
  onThemeToggle: () => void;
}

export default function AdminLayout({ themeMode, onThemeToggle }: Props) {
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

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  const drawerContent = (
    <Box sx={{ width: 260, pt: 2 }}>
      <Box sx={{ px: 3, pb: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography
          variant="h6"
          fontWeight={700}
          sx={{
            background: gradients.hero,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Admin
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {user?.email}
        </Typography>
      </Box>
      <List sx={{ px: 1, pt: 1 }}>
        {ADMIN_NAV.map((item) => (
          <ListItemButton
            key={item.path}
            selected={isActive(item.path)}
            onClick={() => {
              navigate(item.path);
              setDrawerOpen(false);
            }}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              '&.Mui-selected': {
                bgcolor: 'rgba(0,229,255,0.12)',
                borderLeft: '3px solid',
                borderColor: 'primary.main',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
        <ListItemButton
          onClick={() => { navigate('/wallet'); setDrawerOpen(false); }}
          sx={{ borderRadius: 2, mt: 2 }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <HomeRounded />
          </ListItemIcon>
          <ListItemText primary="Back to App" />
        </ListItemButton>
        <ListItemButton onClick={handleLogout} sx={{ borderRadius: 2, mt: 0.5, color: 'error.main' }}>
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
          bgcolor: 'rgba(10,12,16,0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: 1,
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
              background: gradients.hero,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
            onClick={() => navigate('/admin')}
          >
            Credentix Admin
          </Typography>
          <Box sx={{ flex: 1 }} />

          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {ADMIN_NAV.map((item) => (
                <Button
                  key={item.path}
                  color={isActive(item.path) ? 'primary' : 'inherit'}
                  onClick={() => navigate(item.path)}
                  sx={{
                    fontWeight: isActive(item.path) ? 700 : 500,
                    borderRadius: 2,
                  }}
                >
                  {item.label}
                </Button>
              ))}
              <Button
                onClick={() => navigate('/wallet')}
                sx={{ ml: 1, borderRadius: 2 }}
                startIcon={<HomeRounded />}
              >
                App
              </Button>
            </Box>
          )}

          <ThemeToggle mode={themeMode} onToggle={onThemeToggle} />

          {!isMobile && (
            <IconButton onClick={handleLogout} color="inherit" aria-label="Logout" sx={{ ml: 1 }}>
              <LogoutRounded />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        {drawerContent}
      </Drawer>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
