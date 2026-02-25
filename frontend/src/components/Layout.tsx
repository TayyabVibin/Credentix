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
import AccountBalanceWalletRounded from '@mui/icons-material/AccountBalanceWalletRounded';
import ShoppingCartRounded from '@mui/icons-material/ShoppingCartRounded';
import ReceiptLongRounded from '@mui/icons-material/ReceiptLongRounded';
import PersonRounded from '@mui/icons-material/PersonRounded';
import LogoutRounded from '@mui/icons-material/LogoutRounded';
import ThemeToggle from './ThemeToggle.tsx';
import { useAppDispatch, useAppSelector } from '../store/hooks.ts';
import { logout } from '../store/authSlice.ts';

const NAV_ITEMS = [
  { label: 'Wallet', path: '/wallet', icon: <AccountBalanceWalletRounded /> },
  { label: 'Purchase', path: '/purchase', icon: <ShoppingCartRounded /> },
  { label: 'Transactions', path: '/transactions', icon: <ReceiptLongRounded /> },
  { label: 'Profile', path: '/profile', icon: <PersonRounded /> },
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

  const drawerContent = (
    <Box sx={{ width: 260, pt: 2 }}>
      <Box sx={{ px: 3, pb: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" fontWeight={700} color="primary">
          Credentix
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {user?.email}
        </Typography>
      </Box>
      <List sx={{ px: 1, pt: 1 }}>
        {NAV_ITEMS.map((item) => (
          <ListItemButton
            key={item.path}
            selected={location.pathname === item.path}
            onClick={() => {
              navigate(item.path);
              setDrawerOpen(false);
            }}
            sx={{ borderRadius: 2, mb: 0.5 }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
        <ListItemButton onClick={handleLogout} sx={{ borderRadius: 2, mt: 2, color: 'error.main' }}>
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
          bgcolor: 'background.paper',
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
            sx={{ cursor: 'pointer', color: 'primary.main' }}
            onClick={() => navigate('/wallet')}
          >
            Credentix
          </Typography>
          <Box sx={{ flex: 1 }} />

          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {NAV_ITEMS.map((item) => (
                <Button
                  key={item.path}
                  color={location.pathname === item.path ? 'primary' : 'inherit'}
                  onClick={() => navigate(item.path)}
                  sx={{
                    fontWeight: location.pathname === item.path ? 700 : 500,
                    borderRadius: 2,
                  }}
                >
                  {item.label}
                </Button>
              ))}
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

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
