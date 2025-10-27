import {
  Box,
  Card,
  CardContent,
  Grid,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import InputAdornment from '@mui/material/InputAdornment';
import { format } from 'date-fns';
import { useMemo, useState } from 'react';
import type { ChangeEvent, SyntheticEvent } from 'react';
import CertificateDrawer from '../components/dialogs/CertificateDrawer';
import StatusChip from '../components/common/StatusChip';
import { useAppStore } from '../store/appStore';
import type { CertificateRecord } from '../types';

type CertificateTab = 'all' | 'pending' | 'updated' | 'expired' | 'approved' | 'rejected';

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

const columns: GridColDef<CertificateRecord>[] = [
  { field: 'userName', headerName: 'User', flex: 1.2, minWidth: 180 },
  { field: 'unit', headerName: 'Unit', flex: 1, minWidth: 160 },
  { field: 'roleRequested', headerName: 'Role requested', flex: 1.4, minWidth: 220 },
  {
    field: 'status',
    headerName: 'Status',
    width: 130,
    renderCell: ({ value }) => <StatusChip value={value} kind="certificate" />,
  },
  {
    field: 'expiresAt',
    headerName: 'Expires',
    width: 150,
    valueFormatter: ({ value }) =>
      formatDate(typeof value === 'string' ? value : undefined),
  },
  {
    field: 'ocrConfidence',
    headerName: 'OCR confidence',
    width: 140,
    valueFormatter: ({ value }) =>
      value === undefined ? 'Manual review' : `${Math.round((value as number) * 100)}%`,
  },
];

const tabOptions: { value: CertificateTab; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'updated', label: 'Updated' },
  { value: 'expired', label: 'Expired' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
];

const CertificateCenter = () => {
  const certificates = useAppStore((state) => state.certificates);
  const [activeTab, setActiveTab] = useState<CertificateTab>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCertificate, setSelectedCertificate] = useState<CertificateRecord | null>(null);

  const filteredCertificates = useMemo(() => {
    return certificates
      .filter((certificate) =>
        activeTab === 'all' ? true : certificate.status === activeTab,
      )
      .filter((certificate) => {
        if (!searchTerm) return true;
        const value = searchTerm.toLowerCase();
        return (
          certificate.userName.toLowerCase().includes(value) ||
          certificate.unit.toLowerCase().includes(value) ||
          certificate.roleRequested.toLowerCase().includes(value) ||
          certificate.id.toLowerCase().includes(value)
        );
      });
  }, [activeTab, certificates, searchTerm]);

  const metrics = useMemo(() => {
    const pending = certificates.filter((certificate) => certificate.status === 'pending').length;
    const updated = certificates.filter((certificate) => certificate.status === 'updated').length;
    const expired = certificates.filter((certificate) => certificate.status === 'expired').length;
    const approved = certificates.filter((certificate) => certificate.status === 'approved').length;
    return { pending, updated, expired, approved };
  }, [certificates]);

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Certificate &amp; Access Control Center
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Validate HIPAA and licensure documentation, reinstate access, and surface users needing
          follow-up.
        </Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">{metrics.pending}</Typography>
              <Typography variant="body2" color="text.secondary">
                Pending registration approvals
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">{metrics.updated}</Typography>
              <Typography variant="body2" color="text.secondary">
                Updated certificates awaiting reinstatement
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">{metrics.expired}</Typography>
              <Typography variant="body2" color="text.secondary">
                Expired / disallowed users
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">{metrics.approved}</Typography>
              <Typography variant="body2" color="text.secondary">
                Active validated users
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <Tabs
          value={activeTab}
          onChange={(_event: SyntheticEvent, value: CertificateTab) => setActiveTab(value)}
          variant="scrollable"
          scrollButtons="auto"
        >
          {tabOptions.map((tab) => (
            <Tab key={tab.value} value={tab.value} label={tab.label} />
          ))}
        </Tabs>
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 2 }}>
            <TextField
              fullWidth
              placeholder="Search by name, unit, or ID"
              value={searchTerm}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setSearchTerm(event.target.value)
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              placeholder="OCR confidence filter (min %)"
              type="number"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <RefreshIcon color="disabled" />
                  </InputAdornment>
                ),
              }}
              disabled
              helperText="Auto-validation thresholds will be configurable."
            />
          </Stack>
          <DataGrid
            autoHeight
            rows={filteredCertificates}
            columns={columns}
            disableRowSelectionOnClick
            initialState={{
              sorting: {
                sortModel: [{ field: 'uploadedAt', sort: 'desc' }],
              },
            }}
            getRowId={(row) => row.id}
            onRowClick={({ row }) => setSelectedCertificate(row)}
            pageSizeOptions={[10, 25, 50]}
            sx={{
              '& .MuiDataGrid-row': { cursor: 'pointer' },
            }}
          />
        </CardContent>
      </Card>

      <CertificateDrawer
        certificate={selectedCertificate}
        open={Boolean(selectedCertificate)}
        onClose={() => setSelectedCertificate(null)}
      />
    </Stack>
  );
};

export default CertificateCenter;
