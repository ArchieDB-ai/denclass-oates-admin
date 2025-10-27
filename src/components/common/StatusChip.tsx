import { Chip } from '@mui/material';
import type { CertificateStatus } from '../../types';

type StatusKind = 'certificate' | 'treatment';

interface StatusChipProps {
  value: CertificateStatus | 'awaiting-approval' | 'in-review' | 'approved' | 'returned';
  kind: StatusKind;
}

const labelMap: Record<string, string> = {
  pending: 'Pending',
  updated: 'Updated',
  expired: 'Expired',
  approved: 'Approved',
  rejected: 'Rejected',
  'awaiting-approval': 'Awaiting Approval',
  'in-review': 'In Review',
  returned: 'Returned',
};

const colorMap: Record<string, 'default' | 'primary' | 'info' | 'success' | 'warning' | 'error'> = {
  pending: 'primary',
  updated: 'info',
  expired: 'warning',
  approved: 'success',
  rejected: 'error',
  'awaiting-approval': 'primary',
  'in-review': 'info',
  returned: 'warning',
};

const StatusChip = ({ value, kind }: StatusChipProps) => {
  const label = labelMap[value] ?? value;
  const color = colorMap[value] ?? 'default';

  return (
    <Chip
      label={label}
      color={color}
      size="small"
      variant={kind === 'certificate' && value === 'pending' ? 'outlined' : 'filled'}
    />
  );
};

export default StatusChip;
