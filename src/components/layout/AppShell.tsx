import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Chip,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import HistoryIcon from '@mui/icons-material/History';
import SecurityIcon from '@mui/icons-material/Security';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useMemo, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/appStore';

const drawerWidthDesktop = 280;
const drawerWidthTablet = 240;

const navItems = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: <DashboardIcon />,
  },
  {
    label: 'Certificates',
    path: '/certificates',
    icon: <AssignmentIndIcon />,
  },
  {
    label: 'Treatment Plans',
    path: '/treatment-plans',
    icon: <AssignmentTurnedInIcon />,
  },
  {
    label: 'Audit Log',
    path: '/audit-log',
    icon: <HistoryIcon />,
  },
  {
    label: 'Role Management',
    path: '/role-management',
    icon: <SecurityIcon />,
  },
  {
    label: 'Settings',
    path: '/settings',
    icon: <SettingsIcon />,
  },
];

const AppShell = ({ children }: PropsWithChildren) => {
  const location = useLocation();
  const navigate = useNavigate();
  const certificates = useAppStore((state) => state.certificates);
  const treatmentPlans = useAppStore((state) => state.treatmentPlans);
  const auditEvents = useAppStore((state) => state.auditEvents);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const metrics = useMemo(() => {
    const pendingRegistrations = certificates.filter(
      (certificate) => certificate.status === 'pending',
    ).length;
    const updatedCertificates = certificates.filter(
      (certificate) => certificate.status === 'updated',
    ).length;
    const expiredCertificates = certificates.filter(
      (certificate) => certificate.status === 'expired',
    ).length;
    const treatmentPlansAwaiting = treatmentPlans.filter(
      (plan) => plan.requiresReapproval && plan.status !== 'approved',
    ).length;
    const highRiskAlerts =
      auditEvents.filter((event) => event.riskLevel === 'high').length +
      treatmentPlans.filter((plan) => plan.riskNotes).length;

    return {
      pendingRegistrations,
      updatedCertificates,
      expiredCertificates,
      treatmentPlansAwaiting,
      highRiskAlerts,
    };
  }, [auditEvents, certificates, treatmentPlans]);

  const renderNavList = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 3,
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight={700}>
            DenClass Admin
          </Typography>
          <Typography variant="caption" color="text.secondary">
            COL Oates workspace
          </Typography>
        </Box>
        <IconButton
          edge="end"
          color="inherit"
          sx={{ display: { md: 'none' } }}
          onClick={() => setDrawerOpen(false)}
        >
          <CloseIcon />
        </IconButton>
      </Toolbar>
      <Divider />
      <List sx={{ flexGrow: 1, py: 1 }}>
        {navItems.map((item) => {
          const selected = location.pathname.startsWith(item.path);
          return (
            <ListItemButton
              key={item.path}
              selected={selected}
              onClick={() => {
                navigate(item.path);
                setDrawerOpen(false);
              }}
              sx={{
                mx: 2,
                my: 0.5,
                borderRadius: 2,
                '&.Mui-selected': {
                  backgroundColor: 'rgba(27, 94, 32, 0.12)',
                  '&:hover': {
                    backgroundColor: 'rgba(27, 94, 32, 0.18)',
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: selected ? 'primary.main' : 'text.secondary',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontWeight: selected ? 600 : 500 }}
              />
            </ListItemButton>
          );
        })}
      </List>
      <Box
        sx={{
          px: 3,
          pb: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        <Typography variant="overline" color="text.secondary">
          Quick Stats
        </Typography>
        <Chip
          label={`${metrics.treatmentPlansAwaiting} Plans awaiting 3C approval`}
          color="primary"
          variant="outlined"
        />
        <Chip
          label={`${metrics.updatedCertificates} Updated certificates`}
          color="secondary"
          variant="outlined"
        />
        <Chip
          label={`${metrics.expiredCertificates} Expired certificates`}
          color={metrics.expiredCertificates > 0 ? 'warning' : 'default'}
          variant="outlined"
        />
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'background.default' }}>
      <AppBar
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          borderBottom: '1px solid',
          borderColor: 'divider',
          ml: { md: `${drawerWidthTablet}px`, lg: `${drawerWidthDesktop}px` },
        }}
      >
        <Toolbar sx={{ gap: 2 }}>
          <IconButton
            color="inherit"
            edge="start"
            sx={{ display: { md: 'none' } }}
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" fontWeight={600} sx={{ flexGrow: 1 }}>
            Mission Control
          </Typography>
          <Chip
            color="success"
            icon={<NotificationsActiveIcon />}
            label={`${metrics.pendingRegistrations} pending registrations`}
            variant="outlined"
            sx={{ display: { xs: 'none', md: 'flex' } }}
          />
          <Chip
            color={metrics.highRiskAlerts > 0 ? 'warning' : 'default'}
            label={`${metrics.highRiskAlerts} risk alerts`}
            variant={metrics.highRiskAlerts > 0 ? 'filled' : 'outlined'}
            sx={{ display: { xs: 'none', sm: 'flex' } }}
          />
          <IconButton color="inherit">
            <Badge
              color="error"
              badgeContent={metrics.updatedCertificates + metrics.pendingRegistrations}
              overlap="circular"
              max={99}
            >
              <Avatar sx={{ bgcolor: 'primary.main' }}>CO</Avatar>
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{
          width: { md: drawerWidthTablet, lg: drawerWidthDesktop },
          flexShrink: { md: 0 },
        }}
      >
        <Drawer
          variant="temporary"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              width: drawerWidthDesktop,
              boxSizing: 'border-box',
            },
          }}
        >
          {renderNavList()}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              width: { md: drawerWidthTablet, lg: drawerWidthDesktop },
              boxSizing: 'border-box',
            },
          }}
          open
        >
          {renderNavList()}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3, md: 4 },
          mt: 8,
          width: {
            md: `calc(100% - ${drawerWidthTablet}px)`,
            lg: `calc(100% - ${drawerWidthDesktop}px)`,
          },
          backgroundColor: 'background.default',
        }}
      >
        <Container maxWidth="xl">{children}</Container>
      </Box>
    </Box>
  );
};

export default AppShell;
