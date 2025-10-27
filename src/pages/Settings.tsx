import {
  Box,
  Card,
  CardContent,
  CardHeader,
  FormControlLabel,
  Grid,
  Slider,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import type { ChangeEvent } from 'react';

const Settings = () => {
  const [autoReactivateThreshold, setAutoReactivateThreshold] = useState(90);
  const [notifyTeams, setNotifyTeams] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [lockoutDays, setLockoutDays] = useState(90);

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Automation &amp; Notification Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Configure how queues trigger alerts, auto-reactivate users, and enforce inactivity
          policies.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Certificate automation" />
            <CardContent>
              <Stack spacing={3}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={notifyTeams}
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        setNotifyTeams(event.target.checked)
                      }
                    />
                  }
                  label="Send Teams alert when updated certificate needs reinstatement"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={notifyEmail}
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        setNotifyEmail(event.target.checked)
                      }
                    />
                  }
                  label="Send email when HIPAA certificate is 30 days from expiring"
                />
                <Box>
                  <Typography gutterBottom>Auto-reactivate confidence threshold</Typography>
                  <Slider
                    value={autoReactivateThreshold}
                    onChange={(_event: Event, value: number | number[]) =>
                      setAutoReactivateThreshold(value as number)
                    }
                    valueLabelDisplay="auto"
                    step={5}
                    min={50}
                    max={100}
                  />
                  <Typography variant="caption" color="text.secondary">
                    Only certificates with OCR confidence above this percentage will auto-reactivate
                    (still audit logged).
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="User lifecycle" />
            <CardContent>
              <Stack spacing={3}>
                <TextField
                  label="Inactivity lockout (days)"
                  type="number"
                  value={lockoutDays}
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    setLockoutDays(Number(event.target.value))
                  }
                  helperText="Users inactive beyond this duration will be auto-disabled and enter the reinstatement queue."
                />
                <TextField
                  label="Delegation backup"
                  placeholder="Enter backup approver CAC/EDI"
                  helperText="Designate a backup 3C approver when you are out of office."
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Require auditor sign-off for retroactive plan edits"
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default Settings;
