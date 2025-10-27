import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import ShieldIcon from '@mui/icons-material/Shield';
import TimelineIcon from '@mui/icons-material/Timeline';
import { format } from 'date-fns';
import { useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';
import { useAppStore } from '../store/appStore';
import type { AuditEvent } from '../types';

const objectOptions: Array<{ value: AuditEvent['objectType'] | 'all'; label: string }> = [
  { value: 'all', label: 'All objects' },
  { value: 'certificate', label: 'Certificates' },
  { value: 'treatment-plan', label: 'Treatment plans' },
  { value: 'role', label: 'Roles & permissions' },
  { value: 'user', label: 'User records' },
];

const riskColorMap: Record<string, 'default' | 'success' | 'warning' | 'error'> = {
  low: 'success',
  medium: 'warning',
  high: 'error',
};

const AuditLog = () => {
  const auditEvents = useAppStore((state) => state.auditEvents);
  const [objectFilter, setObjectFilter] = useState<'all' | AuditEvent['objectType']>('all');
  const [search, setSearch] = useState('');

  const filteredEvents = useMemo(() => {
    return auditEvents
      .filter((event) => (objectFilter === 'all' ? true : event.objectType === objectFilter))
      .filter((event) => {
        if (!search) return true;
        const value = search.toLowerCase();
        return (
          event.action.toLowerCase().includes(value) ||
          event.objectId.toLowerCase().includes(value) ||
          event.details.toLowerCase().includes(value) ||
          event.actor.toLowerCase().includes(value)
        );
      })
      .sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
  }, [auditEvents, objectFilter, search]);

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Audit &amp; Change History
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Full traceability for certificate approvals, treatment plan modifications, and role
          changes.
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            alignItems={{ xs: 'flex-start', md: 'center' }}
            justifyContent="space-between"
          >
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel id="object-filter-label">Object type</InputLabel>
                <Select
                  labelId="object-filter-label"
                  value={objectFilter}
                  label="Object type"
                  onChange={(event) =>
                    setObjectFilter(event.target.value as AuditEvent['objectType'] | 'all')
                  }
                >
                  {objectOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                size="small"
                placeholder="Search by action, user, or ID"
                value={search}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  setSearch(event.target.value)
                }
              />
            </Stack>
            <Button variant="outlined" startIcon={<DownloadIcon />}>
              Export filtered log
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Stack spacing={2}>
        {filteredEvents.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <TimelineIcon color="disabled" fontSize="large" />
            <Typography variant="body2" color="text.secondary">
              No audit entries match the current filters.
            </Typography>
          </Paper>
        ) : (
          filteredEvents.map((event) => (
            <Paper key={event.id} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
              <Stack spacing={1.5}>
                <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <ShieldIcon color="primary" />
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {event.action.replace(/_/g, ' ')}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {format(new Date(event.timestamp), 'dd MMM yyyy HH:mm')} • {event.actor}
                      </Typography>
                    </Box>
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <Chip
                      size="small"
                      label={event.objectType}
                      color="primary"
                      variant="outlined"
                    />
                    {event.riskLevel ? (
                      <Chip
                        size="small"
                        label={`${event.riskLevel.toUpperCase()} risk`}
                        color={riskColorMap[event.riskLevel] ?? 'default'}
                      />
                    ) : null}
                  </Stack>
                </Stack>

                <Typography variant="body2">{event.details}</Typography>

                <Divider />

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="overline" color="text.secondary">
                      Object ID
                    </Typography>
                    <Typography variant="body2">{event.objectId}</Typography>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="overline" color="text.secondary">
                      Actor
                    </Typography>
                    <Typography variant="body2">{event.actor}</Typography>
                  </Box>
                </Stack>

                {event.diff ? (
                  <Box>
                    <Typography variant="overline" color="text.secondary">
                      Field-level changes
                    </Typography>
                    <Stack spacing={1} sx={{ mt: 1 }}>
                      {Object.entries(event.diff).map(([field, values]) => (
                        <Stack
                          key={field}
                          direction={{ xs: 'column', md: 'row' }}
                          spacing={2}
                          sx={{
                            p: 1.5,
                            borderRadius: 2,
                            backgroundColor: 'rgba(0,0,0,0.02)',
                          }}
                        >
                          <Typography variant="subtitle2" sx={{ minWidth: 160 }}>
                            {field}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Previous: {values.previous ?? '—'}
                          </Typography>
                          <Typography variant="body2" color="success.main">
                            Current: {values.current ?? '—'}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </Box>
                ) : null}
              </Stack>
            </Paper>
          ))
        )}
      </Stack>
    </Stack>
  );
};

export default AuditLog;
