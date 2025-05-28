import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Tooltip,
  IconButton,
  Divider,
  LinearProgress,
  CircularProgress,
  TableContainer as MuiTableContainer,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  GetApp as DownloadIcon,
  MoreVert as MoreVertIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import theme from '../../theme';
import PropTypes from 'prop-types';

// Styled container for program comparison section
const TableContainer = styled(MuiTableContainer)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

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

// Calculate progress % from value and target strings
const calculateProgressValue = (value, target) => {
  const v = parseFloat(String(value).replace(/[^0-9.-]+/g, '')) || 0;
  const t = parseFloat(String(target).replace(/[^0-9.-]+/g, '')) || 0;
  return t === 0 ? 0 : Math.min((v / t) * 100, 100);
};

// Progress bar color based on completion
const getProgressColor = (progress) => {
  if (progress >= 100) return theme.palette.success.main;
  if (progress >= 75) return theme.palette.success.light;
  if (progress >= 50) return theme.palette.warning.main;
  return theme.palette.error.light;
};

// Format date safely
const formatDate = (dateString) => {
  try {
    return new Date(dateString).toLocaleDateString(undefined, {
      month: 'short', day: 'numeric', year: 'numeric',
    });
  } catch {
    return '-';
  }
};

// Subcomponents
const MetricItem = ({ label, value, target, trend }) => {
  const { color, icon } = getTrendDisplay(trend);
  const progress = calculateProgressValue(value, target);
  return (
    <Box mb={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
        <Typography variant="body2">{label}</Typography>
        <Box display="flex" alignItems="center">
          <Typography variant="body1" fontWeight="medium" mr={1}>{value}</Typography>
          {icon && (
            <Box display="flex" alignItems="center" sx={{ color }}>
              {icon}
              <Typography variant="caption" sx={{ ml: 0.5 }}>{trend > 0 ? '+' : ''}{trend}%</Typography>
            </Box>
          )}
        </Box>
      </Box>
      <Box display="flex" alignItems="center">
        <Box flex={1} mr={1}>
          <LinearProgress variant="determinate" value={progress} sx={{
            height: 8, borderRadius: 4, backgroundColor: theme.palette.grey[200],
            '& .MuiLinearProgress-bar': { borderRadius: 4, backgroundColor: getProgressColor(progress) }
          }} />
        </Box>
        <Typography variant="caption" color="textSecondary">Target: {target}</Typography>
      </Box>
    </Box>
  );
};

const RankBadge = ({ rank }) => {
  let color;
  if (rank === 1) color = theme.palette.success.main;
  else if (rank === 2) color = theme.palette.success.light;
  else if (rank === 3) color = theme.palette.warning.light;
  else color = theme.palette.grey[400];
  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 16, height: 16, borderRadius: '50%', backgroundColor: color, color: '#fff', fontSize: '0.6rem', fontWeight: 'bold' }}>
      {rank}
    </Box>
  );
};

const ComparisonMetric = ({ label, value, rank }) => {
  return (
    <Box>
      <Typography variant="caption" color="textSecondary">{label}</Typography>
      <Box display="flex" alignItems="baseline">
        <Typography variant="body2" fontWeight="medium" mr={1}>{value}</Typography>
        <RankBadge rank={rank} />
      </Box>
    </Box>
  );
};

const ProgramComparisonRow = ({ program }) => {
  if (!program) return null;
  return (
    <Box p={2} mb={2} bgcolor={theme.palette.background.paper} borderRadius={1} boxShadow={1}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={3}>
          <Typography variant="subtitle2">{program.name}</Typography>
          <Typography variant="caption" color="textSecondary">{program.participants ?? 0} participants</Typography>
        </Grid>
        <Grid item xs={12} sm={9}>
          <Grid container spacing={2}>
            {['enrollment','engagement','healthImpact','roi'].map((key) => (
              <Grid item xs={6} sm={3} key={key}>
                <ComparisonMetric label={key.charAt(0).toUpperCase() + key.slice(1)} value={program[key + 'Rate'] ?? ''} rank={program[key + 'Rank']} />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

const ProgramEffectivenessCard = ({ programData, onDownloadClick, onMoreClick }) => {
  // Show loader if data not yet provided
  if (!programData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  // Safely extract arrays
  const comparisonList = Array.isArray(programData.programComparison) ? programData.programComparison : [];
  const recList = Array.isArray(programData.recommendations) ? programData.recommendations : [];

  return (
    <Card>
      <CardContent>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Wellness Program Effectiveness</Typography>
          <Box>
            <Tooltip title="Download Report">
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
            Analysis period: {formatDate(programData.periodStart)} - {formatDate(programData.periodEnd)}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Last updated: {formatDate(programData.lastUpdated)}
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={3}>
          {/* Enrollment & Engagement */}
          <Grid item xs={12} md={6}>
            <Box p={2} bgcolor={theme.palette.grey[50]} borderRadius={1}>
              <Typography variant="subtitle1" gutterBottom>Enrollment & Engagement</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <MetricItem
                    label="Enrollment Rate"
                    value={`${programData.enrollmentRate ?? 0}%`}
                    target={`${programData.enrollmentTarget ?? 0}%`}
                    trend={programData.enrollmentTrend}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MetricItem
                    label="Active Participation"
                    value={`${programData.activeParticipationRate ?? 0}%`}
                    target={`${programData.participationTarget ?? 0}%`}
                    trend={programData.participationTrend}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MetricItem
                    label="Avg. Weekly Engagement"
                    value={`${programData.avgWeeklyEngagement ?? 0} days`}
                    target={`${programData.engagementTarget ?? 0} days`}
                    trend={programData.engagementTrend}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MetricItem
                    label="Completion Rate"
                    value={`${programData.completionRate ?? 0}%`}
                    target={`${programData.completionTarget ?? 0}%`}
                    trend={programData.completionTrend}
                  />
                </Grid>
              </Grid>
            </Box>
          </Grid>

          {/* Health Outcomes */}
          <Grid item xs={12} md={6}>
            <Box p={2} bgcolor={theme.palette.grey[50]} borderRadius={1}>
              <Typography variant="subtitle1" gutterBottom>Health Outcomes</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <MetricItem
                    label="Avg. Health Score Improvement"
                    value={`+${programData.avgHealthScoreImprovement ?? 0} pts`}
                    target={`+${programData.healthScoreTarget ?? 0} pts`}
                    trend={programData.healthScoreTrend}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MetricItem
                    label="Risk Level Reduction"
                    value={`${programData.riskReductionRate ?? 0}%`}
                    target={`${programData.riskReductionTarget ?? 0}%`}
                    trend={programData.riskReductionTrend}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MetricItem
                    label="Biometric Improvements"
                    value={`${programData.biometricImprovementRate ?? 0}%`}
                    target={`${programData.biometricTarget ?? 0}%`}
                    trend={programData.biometricTrend}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MetricItem
                    label="Preventive Care Compliance"
                    value={`${programData.preventiveCareRate ?? 0}%`}
                    target={`${programData.preventiveCareTarget ?? 0}%`}
                    trend={programData.preventiveCareTrend}
                  />
                </Grid>
              </Grid>
            </Box>
          </Grid>

          {/* Program Comparison */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>Program Comparison</Typography>
            <TableContainer>
              {comparisonList.map((program, idx) => (
                <ProgramComparisonRow key={idx} program={program} />
              ))}
            </TableContainer>
          </Grid>

          {/* Recommendations */}
          <Grid item xs={12}>
            <Box p={2} bgcolor={theme.palette.info.light + '20'} borderRadius={1} mt={2}>
              <Typography variant="subtitle1" gutterBottom>Recommendations</Typography>
              <Grid container spacing={2}>
                {recList.map((r, idx) => (
                  <Grid item xs={12} sm={6} md={4} key={idx}>
                    <Box display="flex" p={1.5} bgcolor={theme.palette.background.paper} borderRadius={1} boxShadow={1}>
                      <CheckCircleIcon sx={{ color: theme.palette.success.main, mr: 1.5, mt: 0.5 }} />
                      <Box>
                        <Typography variant="subtitle2" gutterBottom>{r.title}</Typography>
                        <Typography variant="body2">{r.description}</Typography>
                        <Typography variant="caption" color="primary" sx={{ mt: 1, display: 'block' }}>
                          Expected impact: {r.impact}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

// PropTypes
ProgramEffectivenessCard.propTypes = {
  programData: PropTypes.shape({
    periodStart: PropTypes.string,
    periodEnd: PropTypes.string,
    lastUpdated: PropTypes.string,
    enrollmentRate: PropTypes.number,
    enrollmentTarget: PropTypes.number,
    enrollmentTrend: PropTypes.number,
    activeParticipationRate: PropTypes.number,
    participationTarget: PropTypes.number,
    participationTrend: PropTypes.number,
    avgWeeklyEngagement: PropTypes.number,
    engagementTarget: PropTypes.number,
    engagementTrend: PropTypes.number,
    completionRate: PropTypes.number,
    completionTarget: PropTypes.number,
    completionTrend: PropTypes.number,
    avgHealthScoreImprovement: PropTypes.number,
    healthScoreTarget: PropTypes.number,
    healthScoreTrend: PropTypes.number,
    riskReductionRate: PropTypes.number,
    riskReductionTarget: PropTypes.number,
    riskReductionTrend: PropTypes.number,
    biometricImprovementRate: PropTypes.number,
    biometricTarget: PropTypes.number,
    biometricTrend: PropTypes.number,
    preventiveCareRate: PropTypes.number,
    preventiveCareTarget: PropTypes.number,
    preventiveCareTrend: PropTypes.number,
    programComparison: PropTypes.array,
    recommendations: PropTypes.array
  }),
  onDownloadClick: PropTypes.func,
  onMoreClick: PropTypes.func
};

MetricItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  target: PropTypes.string.isRequired,
  trend: PropTypes.number
};

ProgramComparisonRow.propTypes = {
  program: PropTypes.shape({
    name: PropTypes.string.isRequired,
    participants: PropTypes.number,
    enrollmentRate: PropTypes.number,
    engagementRate: PropTypes.number,
    healthImpactRate: PropTypes.number,
    roiRate: PropTypes.number,
    enrollmentRank: PropTypes.number,
    engagementRank: PropTypes.number,
    healthImpactRank: PropTypes.number,
    roiRank: PropTypes.number
  })
};

ComparisonMetric.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  rank: PropTypes.number
};

RankBadge.propTypes = {
  rank: PropTypes.number
};

export default ProgramEffectivenessCard;
