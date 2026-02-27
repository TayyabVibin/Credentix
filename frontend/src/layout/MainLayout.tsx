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
import Avatar from '@mui/material/Avatar';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import MenuRounded from '@mui/icons-material/MenuRounded';
import Icon from '../design-system/primitives/Icon';
import NavRail from './NavRail';
import ThemeToggle from './ThemeToggle';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/authSlice';

const NAV_ITEMS = [
  { label: 'Wallet', path: '/wallet', icon: <Icon name="wallet" size={20} /> },
  { label: 'Purchase', path: '/purchase', icon: <Icon name="shoppingCart" size={20} /> },
  { label: 'Transactions', path: '/transactions', icon: <Icon name="receipt" size={20} /> },
  { label: 'Profile', path: '/profile', icon: <Icon name="user" size={20} /> },
  { label: 'Admin', path: '/admin', icon: <Icon name="dashboard" size={20} />, adminOnly: true },
];

interface Props {
  themeMode: 'light' | 'dark';
  onThemeToggle: () => void;
}

export default function MainLayout({ themeMode, onThemeToggle }: Props) {
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

  const filteredItems = NAV_ITEMS.filter(
    (item) => !('adminOnly' in item && item.adminOnly) || user?.role === 'ADMIN',
  ).map(({ adminOnly: _, ...item }) => item);

  const drawerContent = (
    <Box sx={{ width: 270, pt: 2, height: '100%', bgcolor: 'background.paper' }}>
      <Box sx={{ px: 3, pb: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" fontWeight={800} sx={{ color: 'primary.main' }}>
          Credentix
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 2 }}>
          <Avatar
            src={user?.avatarUrl ?? undefined}
            sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontSize: 14 }}
          >
            {user?.fullName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight={600} sx={{ color: 'text.primary' }}>
              {user?.fullName || user?.email}
            </Typography>
            {user?.fullName && (
              <Typography variant="caption" color="text.secondary">
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
                bgcolor: 'action.selected',
                borderLeft: '3px solid',
                borderColor: 'primary.main',
                '&:hover': { bgcolor: 'action.hover' },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: location.pathname === item.path ? 'primary.main' : 'text.secondary' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                fontWeight: location.pathname === item.path ? 600 : 400,
                color: location.pathname === item.path ? 'text.primary' : 'text.secondary',
              }}
            />
          </ListItemButton>
        ))}
        <ListItemButton
          onClick={handleLogout}
          sx={{ borderRadius: 2, mt: 2, color: 'error.main' }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
            <Icon name="logOut" size={20} />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex' }}>
      {/* Desktop: NavRail */}
      {isDesktop && (
        <NavRail
          items={filteredItems}
          onNavigate={(path) => navigate(path)}
          onLogout={handleLogout}
          currentPath={location.pathname}
          user={user}
          brand="Credentix"
        />
      )}

      {/* Mobile/Tablet: Drawer */}
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

      {/* Main content area */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: themeMode === 'dark' ? 'rgba(13,15,18,0.9)' : 'rgba(250,250,249,0.95)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid',
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
            <Typography variant="h6" fontWeight={800} sx={{ cursor: 'pointer', color: 'primary.main' }} onClick={() => navigate('/wallet')}>
              Credentix
            </Typography>
            <Box sx={{ flex: 1 }} />
            <ThemeToggle mode={themeMode} onToggle={onThemeToggle} />
            {isDesktop && (
              <IconButton onClick={() => navigate('/profile')} sx={{ ml: 1 }}>
                <Avatar
                  src={user?.avatarUrl ?? undefined}
                  sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 14 }}
                >
                  {user?.fullName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                </Avatar>
              </IconButton>
            )}
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
}
