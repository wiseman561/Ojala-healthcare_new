import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Tooltip,
  IconButton,
  LinearProgress,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  MoreVert as MoreVertIcon,
  GetApp as DownloadIcon,
} from '@mui/icons-material';
import theme from '../../theme';  // default import

// ——— Helper functions —————————————————————————————

// Determine trend color & icon
const getTrendDisplay = (trend) => {
  if (typeof trend !== 'number') {
    return { color: theme.palette.text.secondary, icon: null };
  }
  if (trend > 0) {
    return { color: theme.palette.success.main, icon: <TrendingUpIcon fontSize="small" /> };
  }
  if (trend < 0) {
    return { color: theme.palette.error.main, icon: <TrendingDownIcon fontSize="small" /> };
  }
  return { color: theme.palette.text.secondary, icon: null };
};

// Determine risk-level color
const getRiskLevelColor = (riskLevel) => {
  if (typeof riskLevel !== 'string') {
    return theme.palette.grey[500];
  }
  switch (riskLevel.toLowerCase()) {
    case 'high': return theme.palette.error.main;
    case 'moderate': return theme.palette.warning.main;
    case 'low': return theme.palette.success.main;
    default: return theme.palette.grey[500];
  }
};

// Determine overall score color
const getScoreColor = (score) => {
  if (typeof score !== 'number') {
    return theme.palette.text.secondary;
  }
  if (score >= 80) return theme.palette.success.main;
  if (score >= 60) return theme.palette.warning.main;
  return theme.palette.error.main;
};

// Styled circular progress placeholder
const CircularProgressStyled = styled('div')(({ value, color }) => ({
  position: 'relative',
  width: 120,
  height: 120,
  borderRadius: '50%',
  background: `conic-gradient(${color} ${value}%, ${theme.palette.grey[200]} 0%)`,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    height: '80%',
    borderRadius: '50%',
    background: theme.palette.background.paper,
  },
}));

// ——— Main component ——————————————————————————————

const HealthScoreOverviewCard = ({ healthScoreData, onDownloadClick, onMoreClick }) => {
  // Loading or no data state
  if (!healthScoreData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  // Format dates nicely
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return '-';
    }
  };

  // Safely get entries
  const riskDist = healthScoreData.riskDistribution || {};

  return (
    <Card>
      <CardContent>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Population Health Score</Typography>
          <Box>
            <Tooltip title="Download Data">
              <IconButton size="small" onClick={onDownloadClick} sx={{ mr: 1 }}>
                <DownloadIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="More Options">
              <IconButton size="small" onClick={onMoreClick}>
                <MoreVertIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Meta Info */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="body2" color="textSecondary">
            Last updated: {formatDate(healthScoreData.lastUpdated)}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Total employees: {healthScoreData.totalEmployees ?? '-'}
          </Typography>
        </Box>

        {/* Grid of charts */}
        <Grid container spacing={3}>
          {/* Average Score */}
          <Grid item xs={12} md={4}>
            <Box display="flex" flexDirection="column" alignItems="center" p={2}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Average Health Score
              </Typography>
              <Box position="relative" display="inline-flex">
                <CircularProgressStyled
                  value={healthScoreData.averageScore ?? 0}
                  color={getScoreColor(healthScoreData.averageScore)}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography
                    variant="h3"
                    component="div"
                    fontWeight="bold"
                    sx={{ color: getScoreColor(healthScoreData.averageScore) }}
                  >
                    {healthScoreData.averageScore ?? '-'}
                  </Typography>
                </Box>
              </Box>
              <Box display="flex" alignItems="center" mt={1}>
                {getTrendDisplay(healthScoreData.trend).icon}
                <Typography
                  variant="body2"
                  sx={{ color: getTrendDisplay(healthScoreData.trend).color, ml: 0.5 }}
                >
                  {healthScoreData.trend > 0 ? '+' : ''}{healthScoreData.trend ?? '0'}%
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Risk Distribution */}
          <Grid item xs={12} md={4}>
            <Box p={2}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Risk Level Distribution
              </Typography>
              {Object.entries(riskDist).map(([level, pct]) => (
                <Box key={level} mb={1.5}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                    <Typography variant="body2">
                      {level.charAt(0).toUpperCase() + level.slice(1)} Risk
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {pct ?? 0}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={pct ?? 0}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: theme.palette.grey[200],
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                        backgroundColor: getRiskLevelColor(level),
                      },
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Key Metrics */}
          <Grid item xs={12} md={4}>
            <Box p={2}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Key Metrics
              </Typography>
              <MetricItem label="Participation Rate" value={`${healthScoreData.participationRate ?? 0}%`} trend={healthScoreData.participationTrend} />
              <MetricItem label="Engagement Score" value={healthScoreData.engagementScore ?? '-'} trend={healthScoreData.engagementTrend} />
              <MetricItem label="Avg. Daily Check-ins" value={healthScoreData.avgDailyCheckins ?? '-'} trend={healthScoreData.checkinsTrend} />
              <MetricItem label="Preventive Care Compliance" value={`${healthScoreData.preventiveCareCompliance ?? 0}%`} trend={healthScoreData.preventiveCareTrend} />
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

// ——— MetricItem subcomponent ————————————————————————

const MetricItem = ({ label, value, trend }) => {
  const { color, icon } = getTrendDisplay(trend);

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
      <Typography variant="body2">{label}</Typography>
      <Box display="flex" alignItems="center">
        <Typography variant="body1" fontWeight="medium" mr={1}>
          {value}
        </Typography>
        {icon && (
          <Box display="flex" alignItems="center" sx={{ color }}>
            {icon}
            <Typography variant="caption" sx={{ ml: 0.5 }}>
              {Math.abs(trend)}%
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default HealthScoreOverviewCard;
