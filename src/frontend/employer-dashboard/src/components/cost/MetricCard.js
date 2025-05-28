import React from 'react';
import { Box, Typography } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { useTheme } from '@mui/material/styles';

export const safeFormatPercentage = (value) => {
  const num = typeof value === 'number' ? value : 0;
  return `${num > 0 ? '+' : ''}${num}%`;
};

const MetricCard = ({ title, value, subtitle, trend, isCostMetric }) => {
  const theme = useTheme();
  const trendColor = trend > 0 ? theme.palette.success.main : trend < 0 ? theme.palette.error.main : theme.palette.text.secondary;
  const trendIcon = trend > 0 ? <TrendingUpIcon fontSize="small" /> : trend < 0 ? <TrendingDownIcon fontSize="small" /> : null;

  return (
    <Box p={2} bgcolor={theme.palette.grey[50]} borderRadius={1}>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h4" color={isCostMetric ? theme.palette.success.main : theme.palette.primary.main} fontWeight="bold">
        {value}
      </Typography>
      <Box display="flex" alignItems="center" mt={1}>
        {trendIcon}
        <Typography variant="body2" sx={{ color: trendColor, ml: 0.5 }}>
          {safeFormatPercentage(trend)}
        </Typography>
      </Box>
      <Typography variant="caption" color="textSecondary">
        {subtitle}
      </Typography>
    </Box>
  );
};

export default MetricCard; 