/**
 * NavRail - Collapsible command center navigation rail
 * Desktop: 72px collapsed / 256px expanded. Icons always visible; labels on expand.
 */

import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import Icon from '../design-system/primitives/Icon';
import CredentixLogo from '../design-system/primitives/CredentixLogo';
import { layout } from '../design-system/tokens';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
}

interface Props {
  items: NavItem[];
  onNavigate: (path: string) => void;
  onLogout: () => void;
  currentPath: string;
  user: { fullName?: string | null; email?: string; avatarUrl?: string | null } | null;
  brand?: string;
  brandPath?: string;
  /** Extra items rendered before logout (e.g. "Back to App") */
  extraItems?: NavItem[];
  isActive?: (path: string) => boolean;
}

export default function NavRail({
  items,
  onNavigate,
  onLogout,
  currentPath,
  user,
  brand = 'Credentix',
  brandPath = '/wallet',
  extraItems = [],
  isActive: isActiveFn,
}: Props) {
  const isItemActive = (path: string) => (isActiveFn ? isActiveFn(path) : currentPath === path);
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const width = expanded ? layout.navRail.expanded : layout.navRail.collapsed;

  return (
    <Box
      sx={{
        width: isDesktop ? width : 0,
        minWidth: isDesktop ? width : 0,
        flexShrink: 0,
        borderRight: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        transition: 'width 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header with collapse toggle */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: expanded ? 'space-between' : 'center',
          p: expanded ? 2 : 1,
          borderBottom: 1,
          borderColor: 'divider',
          minHeight: 64,
        }}
      >
        {expanded ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer', color: 'primary.main' }} onClick={() => onNavigate(brandPath)}>
            <CredentixLogo size={28} color="currentColor" />
            <Typography variant="h6" fontWeight={800} sx={{ color: 'primary.main' }}>
              {brand}
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'primary.main', cursor: 'pointer' }} onClick={() => onNavigate(brandPath)}>
            <CredentixLogo size={24} color="currentColor" />
          </Box>
        )}
        <IconButton size="small" onClick={() => setExpanded((e) => !e)} aria-label={expanded ? 'Collapse' : 'Expand'}>
          {expanded ? <ChevronLeft fontSize="small" /> : <ChevronRight fontSize="small" />}
        </IconButton>
      </Box>

      {/* User avatar (when expanded) */}
      {expanded && user && (
        <Box sx={{ px: 2, py: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar
              src={user.avatarUrl ?? undefined}
              sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontSize: 14 }}
            >
              {user.fullName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
            </Avatar>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography variant="body2" fontWeight={600} noWrap sx={{ color: 'text.primary' }}>
                {user.fullName || user.email}
              </Typography>
              {user.fullName && (
                <Typography variant="caption" noWrap color="text.secondary">
                  {user.email}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      )}

      {/* Nav items */}
      <List sx={{ flex: 1, px: 1, pt: 1.5, overflowY: 'auto' }}>
        {items.map((item) => (
          <ListItemButton
            key={item.path}
            selected={isItemActive(item.path)}
            onClick={() => onNavigate(item.path)}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              justifyContent: expanded ? 'flex-start' : 'center',
              px: expanded ? 2 : 1,
              minHeight: 44,
              '&.Mui-selected': {
                bgcolor: 'action.selected',
                borderLeft: '3px solid',
                borderColor: 'primary.main',
                '&:hover': { bgcolor: 'action.hover' },
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: expanded ? 40 : 0,
                color: isItemActive(item.path) ? 'primary.main' : 'text.secondary',
              }}
            >
              {item.icon}
            </ListItemIcon>
            {expanded && (
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: isItemActive(item.path) ? 600 : 400,
                  color: isItemActive(item.path) ? 'text.primary' : 'text.secondary',
                  fontSize: '0.875rem',
                }}
              />
            )}
          </ListItemButton>
        ))}
        {extraItems.map((item) => (
          <ListItemButton
            key={item.path}
            onClick={() => onNavigate(item.path)}
            sx={{
              borderRadius: 2,
              mt: 2,
              justifyContent: expanded ? 'flex-start' : 'center',
              px: expanded ? 2 : 1,
              minHeight: 44,
            }}
          >
            <ListItemIcon sx={{ minWidth: expanded ? 40 : 0 }}>{item.icon}</ListItemIcon>
            {expanded && <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: '0.875rem' }} />}
          </ListItemButton>
        ))}
        <ListItemButton
          onClick={onLogout}
          sx={{
            borderRadius: 2,
            mt: 2,
            color: 'error.main',
            justifyContent: expanded ? 'flex-start' : 'center',
            px: expanded ? 2 : 1,
            minHeight: 44,
          }}
        >
          <ListItemIcon sx={{ minWidth: expanded ? 40 : 0, color: 'inherit' }}>
            <Icon name="logOut" size={20} />
          </ListItemIcon>
          {expanded && <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: '0.875rem' }} />}
        </ListItemButton>
      </List>
    </Box>
  );
}
