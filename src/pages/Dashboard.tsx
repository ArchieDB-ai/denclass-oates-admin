import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import { format } from 'date-fns';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import QueueCard from '../components/common/QueueCard';
import StatusChip from '../components/common/StatusChip';
import { useAppStore } from '../store/appStore';
import type { CertificateRecord, TreatmentPlanRecord } from '../types';

const formatDate = (value?: string) => {
  if (!value) {
    return '—';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '—';
  }
  return format(date, 'dd MMM yyyy');
};

const formatDateTime = (value?: string) => {
  if (!value) {
    return '—';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '—';
  }
  return format(date, 'dd MMM yyyy HH:mm');
};

const certificateColumns: GridColDef<CertificateRecord>[] = [
  { field: 'userName', headerName: 'User', flex: 1, minWidth: 150 },
  {
    field: 'roleRequested',
    headerName: 'Role requested',
    flex: 1,
    minWidth: 180,
    hideable: true,
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 120,
    renderCell: ({ value }) => <StatusChip value={value} kind="certificate" />,
  },
  {
    field: 'expiresAt',
    headerName: 'Expires',
    width: 140,
    valueFormatter: ({ value }) =>
      formatDate(typeof value === 'string' ? value : undefined),
  },
];

const treatmentPlanColumns: GridColDef<TreatmentPlanRecord>[] = [
  { field: 'soldierName', headerName: 'Soldier', flex: 1, minWidth: 150 },
  {
    field: 'currentCategory',
    headerName: 'Category',
    width: 100,
    valueFormatter: ({ value }) => `DRC ${value as string}`,
  },
  {
    field: 'previousCategory',
    headerName: 'Previous',
    width: 100,
    hideable: true,
    valueFormatter: ({ value }) => (value ? `DRC ${value as string}` : '—'),
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 140,
    renderCell: ({ value }) => <StatusChip value={value} kind="treatment" />,
  },
  {
    field: 'lastUpdatedAt',
    headerName: 'Modified',
    width: 130,
    hideable: true,
    valueFormatter: ({ value }) =>
      formatDate(typeof value === 'string' ? value : undefined),
  },
];

const Dashboard = () => {
  const certificates = useAppStore((state) => state.certificates);
  const treatmentPlans = useAppStore((state) => state.treatmentPlans);
  const auditEvents = useAppStore((state) => state.auditEvents);
  const navigate = useNavigate();

  const metrics = useMemo(() => {
    const pending = certificates.filter((certificate) => certificate.status === 'pending');
    const updated = certificates.filter((certificate) => certificate.status === 'updated');
    const expired = certificates.filter((certificate) => certificate.status === 'expired');
    const awaitingPlans = treatmentPlans.filter(
      (plan) => plan.requiresReapproval && plan.status !== 'approved',
    );
    const highRisk = auditEvents.filter((event) => event.riskLevel === 'high');

    return {
      pending,
      updated,
      expired,
      awaitingPlans,
      highRisk,
    };
  }, [auditEvents, certificates, treatmentPlans]);

  return (
    <Stack spacing={4}>
      <Box>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Welcome back, Colonel Oates
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Monitor registrations, certificates, and high-risk 3C treatment plans from a single command
          center.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <QueueCard
            title="Pending registrations"
            count={metrics.pending.length}
            description="Awaiting initial HIPAA validation."
            chipLabel="Go to certificates"
            icon={<PendingActionsIcon fontSize="large" color="primary" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <QueueCard
            title="Updated certificates"
            count={metrics.updated.length}
            description="Users ready for reinstatement."
            tone="success"
            chipLabel="Needs action"
            icon={<AssignmentIcon fontSize="large" color="success" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <QueueCard
            title="Expired certificates"
            count={metrics.expired.length}
            description="Users currently disallowed."
            tone="warning"
            chipLabel="Review queue"
            icon={<ReportProblemIcon fontSize="large" color="warning" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={12} lg={3}>
          <QueueCard
            title="3C treatment plans"
            count={metrics.awaitingPlans.length}
            description="Needs senior approval."
            tone="default"
            chipLabel="Escalated"
            icon={<AssignmentTurnedInIcon fontSize="large" color="primary" />}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <Card>
            <CardHeader
              title="Updated certificates"
              subheader="Reinstate access once documents are validated."
              action={
                <Button onClick={() => navigate('/certificates')} variant="text">
                  Open queue
                </Button>
              }
            />
            <CardContent sx={{ height: 360 }}>
              <DataGrid
                rows={metrics.updated.slice(0, 5)}
                columns={certificateColumns}
                disableColumnMenu
                disableRowSelectionOnClick
                hideFooter
                getRowId={(row) => row.id}
                localeText={{ noRowsLabel: 'Queue is clear — no updated certificates.' }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Card>
            <CardHeader
              title="Treatment plans awaiting 3C approval"
              subheader="Review modifications before billing proceeds."
              action={
                <Button onClick={() => navigate('/treatment-plans')} variant="text">
                  Open queue
                </Button>
              }
            />
            <CardContent sx={{ height: 360 }}>
              <DataGrid
                rows={metrics.awaitingPlans.slice(0, 5)}
                columns={treatmentPlanColumns}
                disableColumnMenu
                disableRowSelectionOnClick
                hideFooter
                getRowId={(row) => row.id}
                localeText={{ noRowsLabel: 'No treatment plans require attention.' }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardHeader
          avatar={<NotificationsActiveIcon color="warning" />}
          title="High-risk activity feed"
          subheader="Escalations, manual overrides, and audit flags."
          action={
            <Button variant="outlined" onClick={() => navigate('/audit-log')}>
              View audit log
            </Button>
          }
        />
        <CardContent>
          <Stack spacing={2}>
            {metrics.highRisk.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No critical audit items. Continue monitoring certificate updates and plan
                modifications.
              </Typography>
            ) : (
              metrics.highRisk.slice(0, 4).map((event) => (
                <Stack
                  key={event.id}
                  direction="row"
                  alignItems="center"
                  spacing={2}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    backgroundColor: 'rgba(237, 108, 2, 0.08)',
                  }}
                >
                  <ReportProblemIcon color="warning" />
                  <Box>
                    <Typography variant="subtitle2">{event.action}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {event.details}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDateTime(event.timestamp)} • {event.actor}
                    </Typography>
                  </Box>
                </Stack>
              ))
            )}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default Dashboard;
