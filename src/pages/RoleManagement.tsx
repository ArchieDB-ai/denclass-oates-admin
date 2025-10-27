import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Grid,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SecurityUpdateGoodIcon from '@mui/icons-material/SecurityUpdateGood';
import { useState } from 'react';
import { useAppStore } from '../store/appStore';
import type { RoleDefinition } from '../types';

const RoleManagement = () => {
  const roles = useAppStore((state) => state.roles);
  const addNotification = useAppStore((state) => state.addNotification);
  const [selectedRole, setSelectedRole] = useState<RoleDefinition>(roles[0]);

  const handleImpersonate = () => {
    addNotification({
      message: `Impersonation mode launched for ${selectedRole.name} (read-only).`,
      severity: 'info',
    });
  };

  const handleCredentialChecklist = () => {
    addNotification({
      message: `Credential checklist exported for ${selectedRole.name}.`,
      severity: 'success',
    });
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Card sx={{ height: '100%' }}>
          <CardHeader title="Roles &amp; Approval Authorities" />
          <CardContent>
            <List>
              {roles.map((role) => (
                <ListItemButton
                  key={role.id}
                  selected={role.id === selectedRole.id}
                  onClick={() => setSelectedRole(role)}
                  sx={{ borderRadius: 2, mb: 1 }}
                >
                  <ListItemText
                    primary={role.name}
                    secondary={role.description}
                    primaryTypographyProps={{ fontWeight: role.id === selectedRole.id ? 600 : 500 }}
                  />
                </ListItemButton>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={8}>
        <Card>
          <CardHeader
            title={selectedRole.name}
            subheader={selectedRole.description}
            action={
              <Stack direction="row" spacing={1}>
                <Button variant="outlined" startIcon={<SecurityUpdateGoodIcon />} onClick={handleCredentialChecklist}>
                  Export checklist
                </Button>
                <Button variant="contained" startIcon={<VisibilityIcon />} onClick={handleImpersonate}>
                  Impersonate
                </Button>
              </Stack>
            }
          />
          <CardContent>
            <Stack spacing={3}>
              <Box>
                <Typography variant="overline" color="text.secondary">
                  Required credentials
                </Typography>
                <Stack direction="row" flexWrap="wrap" spacing={1}>
                  {selectedRole.requiredCredentials.map((credential) => (
                    <Chip
                      key={credential}
                      icon={<VerifiedUserIcon />}
                      label={credential}
                      color="secondary"
                      variant="outlined"
                    />
                  ))}
                </Stack>
              </Box>

              <Box>
                <Typography variant="overline" color="text.secondary">
                  Permissions
                </Typography>
                <Grid container spacing={2}>
                  {selectedRole.permissions.map((permission) => (
                    <Grid item xs={12} md={6} key={permission.id}>
                      <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {permission.label}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {permission.description}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              <Box>
                <Typography variant="overline" color="text.secondary">
                  Default reports
                </Typography>
                <Stack spacing={1}>
                  {selectedRole.defaultReports.map((report) => (
                    <Typography key={report} variant="body2">
                      • {report}
                    </Typography>
                  ))}
                </Stack>
              </Box>

              <Box>
                <Typography variant="overline" color="text.secondary">
                  Sensitive actions
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {selectedRole.sensitiveActions.map((action) => (
                    <Chip key={action} label={action} color="warning" variant="outlined" />
                  ))}
                </Stack>
              </Box>

              {selectedRole.impersonationNotes ? (
                <Box>
                  <Typography variant="overline" color="text.secondary">
                    Impersonation guidance
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedRole.impersonationNotes}
                  </Typography>
                </Box>
              ) : null}
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default RoleManagement;
