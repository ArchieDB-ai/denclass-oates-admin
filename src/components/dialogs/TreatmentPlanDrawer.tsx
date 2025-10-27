import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  Drawer,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import InfoIcon from '@mui/icons-material/Info';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import { format } from 'date-fns';
import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { useAppStore } from '../../store/appStore';
import type { TreatmentPlanRecord } from '../../types';
import StatusChip from '../common/StatusChip';

interface TreatmentPlanDrawerProps {
  plan: TreatmentPlanRecord | null;
  open: boolean;
  onClose: () => void;
}

const formatDisplayDate = (value?: string) => {
  if (!value) {
    return '—';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '—';
  }
  return format(date, 'dd MMM yyyy HH:mm');
};

const TreatmentPlanDrawer = ({ plan, open, onClose }: TreatmentPlanDrawerProps) => {
  const [notes, setNotes] = useState('');
  const markTreatmentPlanReviewed = useAppStore(
    (state) => state.markTreatmentPlanReviewed,
  );

  if (!plan) {
    return null;
  }

  const handleDecision = (decision: 'approved' | 'returned') => {
    markTreatmentPlanReviewed(plan.id, 'COL Oates', decision, notes.trim() || undefined);
    setNotes('');
    onClose();
  };

  const showRiskAlert = Boolean(plan.previousCategory && plan.previousCategory !== plan.currentCategory);

  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: 520 } }}>
      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Stack direction="row" justifyContent="space-between" spacing={2}>
          <Box>
            <Typography variant="h6" fontWeight={700}>
              {plan.soldierName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              DoD ID: {plan.dodId} • {plan.unit}
            </Typography>
          </Box>
          <StatusChip value={plan.status} kind="treatment" />
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Stack spacing={2} sx={{ flexGrow: 1, overflowY: 'auto' }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="overline" color="text.secondary">
                Current category
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip color="primary" label={`DRC ${plan.currentCategory}`} />
                {plan.requiresReapproval ? (
                  <Chip
                    color="warning"
                    variant="outlined"
                    label="Needs reapproval"
                    size="small"
                  />
                ) : null}
              </Stack>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="overline" color="text.secondary">
                Previous category
              </Typography>
              <Typography variant="body1">
                {plan.previousCategory ? `DRC ${plan.previousCategory}` : '—'}
              </Typography>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="overline" color="text.secondary">
                Provider
              </Typography>
              <Typography variant="body1">{plan.provider}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="overline" color="text.secondary">
                Original approver
              </Typography>
              <Typography variant="body1">
                {plan.originalApprover ?? 'Not recorded'}
              </Typography>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="overline" color="text.secondary">
                Submitted
              </Typography>
              <Typography variant="body2">{formatDisplayDate(plan.submittedAt)}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="overline" color="text.secondary">
                Last updated
              </Typography>
              <Typography variant="body2">{formatDisplayDate(plan.lastUpdatedAt)}</Typography>
            </Grid>
          </Grid>

          {showRiskAlert ? (
            <Alert icon={<InfoIcon />} severity="warning" variant="outlined">
              Treatment plan escalated from {plan.previousCategory} to {plan.currentCategory}. Confirm
              that previously approved procedures remain intact and billing is reconciled.
            </Alert>
          ) : null}

          <Box>
            <Typography variant="overline" color="text.secondary">
              Change summary
            </Typography>
            <Typography variant="body1">{plan.changeSummary}</Typography>
          </Box>

          <Box>
            <Typography variant="overline" color="text.secondary">
              Financial impact
            </Typography>
            <Typography variant="body1">{plan.delta.financialImpact}</Typography>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="overline" color="text.secondary">
                Procedures added
              </Typography>
              <List dense>
                {plan.delta.addedProcedures.length === 0 ? (
                  <ListItem>
                    <ListItemText primary="None" />
                  </ListItem>
                ) : (
                  plan.delta.addedProcedures.map((procedure) => (
                    <ListItem key={procedure}>
                      <ListItemIcon sx={{ color: 'success.main' }}>
                        <AddCircleIcon />
                      </ListItemIcon>
                      <ListItemText primary={procedure} />
                    </ListItem>
                  ))
                )}
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="overline" color="text.secondary">
                Procedures removed
              </Typography>
              <List dense>
                {plan.delta.removedProcedures.length === 0 ? (
                  <ListItem>
                    <ListItemText primary="None" />
                  </ListItem>
                ) : (
                  plan.delta.removedProcedures.map((procedure) => (
                    <ListItem key={procedure}>
                      <ListItemIcon sx={{ color: 'warning.main' }}>
                        <RemoveCircleIcon />
                      </ListItemIcon>
                      <ListItemText primary={procedure} />
                    </ListItem>
                  ))
                )}
              </List>
            </Grid>
          </Grid>

          {plan.riskNotes ? (
            <Alert icon={<FactCheckIcon />} severity="info" variant="outlined">
              {plan.riskNotes}
            </Alert>
          ) : null}

          <TextField
            label="Approval notes"
            placeholder="Add conditions, billing guidance, or required follow-up."
            multiline
            minRows={3}
            value={notes}
            onChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
              setNotes(event.target.value)
            }
          />
        </Stack>

        <Stack direction="row" spacing={1.5} sx={{ mt: 3 }}>
          <Button variant="outlined" color="secondary" onClick={() => handleDecision('returned')}>
            Return for edits
          </Button>
          <Button variant="contained" color="success" onClick={() => handleDecision('approved')}>
            Approve 3C Plan
          </Button>
        </Stack>
      </Box>
    </Drawer>
  );
};

export default TreatmentPlanDrawer;
