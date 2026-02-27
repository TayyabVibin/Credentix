import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
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
import Icon from '../design-system/primitives/Icon';
import NavRail from './NavRail';
import ThemeToggle from './ThemeToggle';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/authSlice';

const ADMIN_NAV = [
  { label: 'Dashboard', path: '/admin', icon: <Icon name="dashboard" size={20} /> },
  { label: 'Payments', path: '/admin/payments', icon: <Icon name="payment" size={20} /> },
  { label: 'Webhooks', path: '/admin/webhooks', icon: <Icon name="webhook" size={20} /> },
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
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  const drawerContent = (
    <Box sx={{ width: 260, pt: 2, height: '100%', bgcolor: 'background.paper' }}>
      <Box sx={{ px: 3, pb: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" fontWeight={700} sx={{ color: 'primary.main' }}>
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
                bgcolor: 'action.selected',
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
            <Icon name="home" size={20} />
          </ListItemIcon>
          <ListItemText primary="Back to App" />
        </ListItemButton>
        <ListItemButton onClick={handleLogout} sx={{ borderRadius: 2, mt: 0.5, color: 'error.main' }}>
          <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
            <Icon name="logOut" size={20} />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </Box>
  );

  const adminNavItems = ADMIN_NAV.map((item) => ({ ...item, adminOnly: undefined }));
  const adminExtraItems = [{ label: 'Back to App', path: '/wallet', icon: <Icon name="home" size={20} /> }];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex' }}>
      {isDesktop && (
        <NavRail
          items={adminNavItems}
          extraItems={adminExtraItems}
          onNavigate={(path) => navigate(path)}
          onLogout={handleLogout}
          currentPath={location.pathname}
          user={user}
          brand="Credentix Admin"
          brandPath="/admin"
          isActive={isActive}
        />
      )}
      {!isDesktop && (
        <Drawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          PaperProps={{
            sx: { bgcolor: 'background.paper', borderRight: 1, borderColor: 'divider' },
          }}
        >
          {drawerContent}
        </Drawer>
      )}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: themeMode === 'dark' ? 'rgba(13,15,18,0.9)' : 'rgba(250,250,249,0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: 1,
          borderColor: 'divider',
          color: 'text.primary',
        }}
      >
        <Toolbar>
          {!isDesktop && (
            <IconButton edge="start" onClick={() => setDrawerOpen(true)} sx={{ mr: 1 }}>
              <MenuRounded />
            </IconButton>
          )}
          <Typography variant="h6" fontWeight={800} sx={{ cursor: 'pointer', color: 'primary.main' }} onClick={() => navigate('/admin')}>
            Credentix Admin
          </Typography>
          <Box sx={{ flex: 1 }} />
          <ThemeToggle mode={themeMode} onToggle={onThemeToggle} />
          {!isDesktop && (
            <IconButton onClick={handleLogout} color="inherit" aria-label="Logout" sx={{ ml: 1 }}>
              <Icon name="logOut" size={20} />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4, flex: 1 }}>
        <Outlet />
      </Container>
      </Box>
    </Box>
  );
}
