import {
  Box,
  Card,
  CardContent,
  Grid,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import HistoryToggleOffIcon from '@mui/icons-material/HistoryToggleOff';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { format } from 'date-fns';
import { useMemo, useState } from 'react';
import type { SyntheticEvent } from 'react';
import TreatmentPlanDrawer from '../components/dialogs/TreatmentPlanDrawer';
import StatusChip from '../components/common/StatusChip';
import { useAppStore } from '../store/appStore';
import type { TreatmentPlanRecord } from '../types';

const formatDate = (value?: string, pattern = 'dd MMM yyyy') => {
  if (!value) {
    return '—';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '—';
  }
  return format(date, pattern);
};

const columns: GridColDef<TreatmentPlanRecord>[] = [
  { field: 'id', headerName: 'Plan ID', width: 110, hideable: true },
  { field: 'soldierName', headerName: 'Soldier', flex: 1.1, minWidth: 150 },
  { field: 'unit', headerName: 'Unit', flex: 1, minWidth: 120, hideable: true },
  {
    field: 'currentCategory',
    headerName: 'Current',
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
    width: 150,
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

type FilterOption = 'all' | 'requiresReapproval' | 'categoryEscalation';

const TreatmentPlans = () => {
  const treatmentPlans = useAppStore((state) => state.treatmentPlans);
  const [filter, setFilter] = useState<FilterOption>('requiresReapproval');
  const [selectedPlan, setSelectedPlan] = useState<TreatmentPlanRecord | null>(null);

  const filteredPlans = useMemo(() => {
    return treatmentPlans.filter((plan) => {
      if (filter === 'all') return true;
      if (filter === 'requiresReapproval') {
        return plan.requiresReapproval && plan.status !== 'approved';
      }
      if (filter === 'categoryEscalation') {
        return Boolean(plan.previousCategory && plan.previousCategory !== plan.currentCategory);
      }
      return true;
    });
  }, [filter, treatmentPlans]);

  const metrics = useMemo(() => {
    const requiresReapproval = treatmentPlans.filter(
      (plan) => plan.requiresReapproval && plan.status !== 'approved',
    );
    const escalated = treatmentPlans.filter(
      (plan) => plan.previousCategory && plan.previousCategory !== plan.currentCategory,
    );
    const billingRisk = treatmentPlans.filter((plan) => plan.riskNotes);
    return { requiresReapproval, escalated, billingRisk };
  }, [treatmentPlans]);

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Treatment Plan Oversight
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Review DRC 3C treatment plans, confirm change history, and protect billing integrity before
          approvals are finalized.
        </Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent sx={{ py: { xs: 1.5, sm: 2 } }}>
              <Typography variant="h3" fontWeight={700}>
                {metrics.requiresReapproval.length}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                Plans awaiting senior approval
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent sx={{ display: 'flex', gap: 2, py: { xs: 1.5, sm: 2 } }}>
              <WarningAmberIcon color="warning" sx={{ fontSize: { xs: '2rem', sm: '2.5rem' } }} />
              <Box>
                <Typography variant="h6">{metrics.escalated.length}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                  Category escalations (3A/3B → 3C)
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <Card>
            <CardContent sx={{ display: 'flex', gap: 2, py: { xs: 1.5, sm: 2 } }}>
              <HistoryToggleOffIcon color="info" sx={{ fontSize: { xs: '2rem', sm: '2.5rem' } }} />
              <Box>
                <Typography variant="h6">{metrics.billingRisk.length}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                  Plans needing billing reconciliation review
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', md: 'center' }}
            spacing={2}
            sx={{ mb: 2 }}
          >
            <ToggleButtonGroup
              value={filter}
              exclusive
              onChange={(_event: SyntheticEvent, value: FilterOption | null) => {
                if (value) {
                  setFilter(value);
                }
              }}
              size="small"
              sx={{
                flexWrap: 'wrap',
                '& .MuiToggleButton-root': {
                  px: { xs: 1.5, sm: 2 },
                  py: { xs: 0.5, sm: 1 },
                },
              }}
            >
              <ToggleButton value="requiresReapproval">
                <FilterAltIcon fontSize="small" sx={{ mr: { xs: 0.5, sm: 1 } }} />
                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                  Needs approval
                </Box>
                <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
                  Needs
                </Box>
              </ToggleButton>
              <ToggleButton value="categoryEscalation">
                <WarningAmberIcon fontSize="small" sx={{ mr: { xs: 0.5, sm: 1 } }} />
                <Box component="span">Escalated</Box>
              </ToggleButton>
              <ToggleButton value="all">
                <Box component="span">Show all</Box>
              </ToggleButton>
            </ToggleButtonGroup>
            <Typography variant="body2" color="text.secondary">
              Click a plan to view its full modification history.
            </Typography>
          </Stack>
          <DataGrid
            autoHeight
            rows={filteredPlans}
            columns={columns}
            disableRowSelectionOnClick
            getRowId={(row) => row.id}
            onRowClick={({ row }) => setSelectedPlan(row)}
            pageSizeOptions={[10, 25, 50]}
            initialState={{
              sorting: {
                sortModel: [{ field: 'lastUpdatedAt', sort: 'desc' }],
              },
            }}
            sx={{ '& .MuiDataGrid-row': { cursor: 'pointer' } }}
          />
        </CardContent>
      </Card>

      <TreatmentPlanDrawer
        plan={selectedPlan}
        open={Boolean(selectedPlan)}
        onClose={() => setSelectedPlan(null)}
      />
    </Stack>
  );
};

export default TreatmentPlans;
