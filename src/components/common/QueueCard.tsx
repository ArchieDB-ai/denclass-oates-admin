import { Card, CardContent, Chip, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';

interface QueueCardProps {
  title: string;
  count: number;
  description: string;
  icon: ReactNode;
  chipLabel?: string;
  tone?: 'default' | 'warning' | 'success';
}

const toneToColor: Record<
  NonNullable<QueueCardProps['tone']>,
  'primary' | 'warning' | 'success'
> = {
  default: 'primary',
  warning: 'warning',
  success: 'success',
};

const QueueCard = ({
  title,
  count,
  description,
  icon,
  chipLabel,
  tone = 'default',
}: QueueCardProps) => (
  <Card
    elevation={0}
    sx={{
      borderRadius: 3,
      border: '1px solid',
      borderColor: 'divider',
      background:
        tone === 'warning'
          ? 'linear-gradient(135deg, rgba(237, 108, 2, 0.1), rgba(237, 108, 2, 0.02))'
          : tone === 'success'
          ? 'linear-gradient(135deg, rgba(46, 125, 50, 0.1), rgba(46, 125, 50, 0.02))'
          : 'linear-gradient(135deg, rgba(0, 131, 143, 0.1), rgba(0, 131, 143, 0.02))',
    }}
  >
    <CardContent>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'center', sm: 'flex-start' }}
        spacing={2}
      >
        <Stack spacing={1} sx={{ textAlign: { xs: 'center', sm: 'left' }, flex: 1 }}>
          <Typography variant="overline" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="h3" fontWeight={700}>
            {count}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </Stack>
        <Stack spacing={1} alignItems={{ xs: 'center', sm: 'flex-end' }}>
          {chipLabel ? (
            <Chip
              label={chipLabel}
              color={toneToColor[tone]}
              variant="outlined"
              size="small"
            />
          ) : null}
          {icon}
        </Stack>
      </Stack>
    </CardContent>
  </Card>
);

export default QueueCard;
