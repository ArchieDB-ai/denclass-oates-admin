import { Box, LinearProgress, Tooltip, Typography } from '@mui/material';

interface ConfidenceIndicatorProps {
  value?: number;
}

const ConfidenceIndicator = ({ value }: ConfidenceIndicatorProps) => {
  if (value === undefined) {
    return (
      <Typography variant="body2" color="text.secondary">
        Manual review required
      </Typography>
    );
  }

  const percentage = Math.round(value * 100);
  const color: 'success' | 'info' | 'warning' | 'error' =
    percentage >= 90
      ? 'success'
      : percentage >= 75
      ? 'info'
      : percentage >= 60
      ? 'warning'
      : 'error';

  return (
    <Tooltip title={`OCR confidence ${percentage}%`}>
      <Box sx={{ width: 160 }}>
        <LinearProgress
          variant="determinate"
          value={percentage}
          color={color}
          sx={{ borderRadius: 4, height: 8, mb: 0.5 }}
        />
        <Typography variant="caption" color="text.secondary">
          {percentage}% confidence
        </Typography>
      </Box>
    </Tooltip>
  );
};

export default ConfidenceIndicator;
