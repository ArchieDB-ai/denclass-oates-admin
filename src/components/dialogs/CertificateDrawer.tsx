import {
  Box,
  Button,
  Chip,
  Divider,
  Drawer,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { format } from 'date-fns';
import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { useAppStore } from '../../store/appStore';
import type { CertificateRecord } from '../../types';
import ConfidenceIndicator from '../common/ConfidenceIndicator';
import StatusChip from '../common/StatusChip';

interface CertificateDrawerProps {
  certificate: CertificateRecord | null;
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

const CertificateDrawer = ({ certificate, open, onClose }: CertificateDrawerProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const approveCertificate = useAppStore((state) => state.approveCertificate);
  const rejectCertificate = useAppStore((state) => state.rejectCertificate);
  const updateCertificateStatus = useAppStore(
    (state) => state.updateCertificateStatus,
  );
  const [notes, setNotes] = useState('');
  const [noteError, setNoteError] = useState<string | null>(null);

  if (!certificate) {
    return null;
  }

  const handleApprove = () => {
    setNoteError(null);
    approveCertificate(certificate.id, 'COL Oates', notes.trim() || undefined);
    setNotes('');
    onClose();
  };

  const handleReject = () => {
    if (!notes.trim()) {
      setNoteError('Add rationale before rejecting the certificate.');
      return;
    }
    setNoteError(null);
    rejectCertificate(certificate.id, 'COL Oates', notes.trim());
    setNotes('');
    onClose();
  };

  const handleSetUpdated = () => {
    setNoteError(null);
    updateCertificateStatus(certificate.id, 'updated', 'COL Oates', notes.trim() || undefined);
    setNotes('');
    onClose();
  };

  const isActionable = ['pending', 'updated', 'expired'].includes(certificate.status);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 480, md: 520 },
          maxWidth: '100vw',
        },
      }}
    >
      <Box sx={{ p: { xs: 2, sm: 3 }, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
          <Box>
            <Typography variant="h6" fontWeight={700}>
              {certificate.userName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {certificate.rank} • {certificate.unit}
            </Typography>
          </Box>
          <StatusChip value={certificate.status} kind="certificate" />
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Stack spacing={2} sx={{ flexGrow: 1, overflowY: 'auto' }}>
          <Box>
            <Typography variant="overline" color="text.secondary">
              Role requested
            </Typography>
            <Typography variant="body1">{certificate.roleRequested}</Typography>
          </Box>

          <Box>
            <Typography variant="overline" color="text.secondary">
              Certificate type
            </Typography>
            <Chip size="small" label={certificate.type} color="secondary" variant="outlined" />
          </Box>

          <Box>
            <Typography variant="overline" color="text.secondary">
              Uploaded
            </Typography>
            <Typography variant="body2">{formatDisplayDate(certificate.uploadedAt)}</Typography>
          </Box>

          <Box>
            <Typography variant="overline" color="text.secondary">
              Current expiration
            </Typography>
            <Typography variant="body2">{formatDisplayDate(certificate.expiresAt)}</Typography>
          </Box>

          <Box>
            <Typography variant="overline" color="text.secondary">
              OCR extraction
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="body2">
                Suggested expiry:{' '}
                <strong>{formatDisplayDate(certificate.ocrExtractedExpiry)}</strong>
              </Typography>
              <ConfidenceIndicator value={certificate.ocrConfidence} />
            </Stack>
          </Box>

          <TextField
            label="Admin notes"
            multiline
            minRows={3}
            value={notes}
            onChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
              setNotes(event.target.value);
              if (noteError) {
                setNoteError(null);
              }
            }}
            placeholder="Add rationale, requested corrections, or manual verification notes."
            error={Boolean(noteError)}
            helperText={noteError}
          />

          <Box>
            <Typography variant="caption" color="text.secondary">
              Last reviewed: {formatDisplayDate(certificate.lastReviewedAt)} by{' '}
              {certificate.reviewer ?? '—'}
            </Typography>
          </Box>
        </Stack>

        {isActionable ? (
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.5}
            sx={{ mt: 2 }}
          >
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleSetUpdated}
              fullWidth={isMobile}
            >
              Mark updated
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={handleApprove}
              fullWidth={isMobile}
            >
              Approve &amp; Reinstate
            </Button>
            <Button
              variant="outlined"
              color="warning"
              onClick={handleReject}
              fullWidth={isMobile}
            >
              Reject
            </Button>
          </Stack>
        ) : (
          <Button sx={{ mt: 2 }} variant="outlined" onClick={onClose} fullWidth={isMobile}>
            Close
          </Button>
        )}
      </Box>
    </Drawer>
  );
};

export default CertificateDrawer;
