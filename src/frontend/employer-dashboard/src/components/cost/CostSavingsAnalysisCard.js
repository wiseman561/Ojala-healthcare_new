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
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AttachMoney as AttachMoneyIcon,
  GetApp as DownloadIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import theme from '../../theme';
import MetricCard, { safeFormatPercentage } from './MetricCard';

// Styled TableContainer for breakdown section
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const CostSavingsAnalysisCard = ({ costData, onDownloadClick, onMoreClick }) => {
  // Loading state
  if (!costData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  // Safe formatters
  const safeFormatCurrency = (amount) => {
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0,
      }).format(amount);
    } catch {
      return '-';
    }
  };

  const safeFormatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        month: 'short', day: 'numeric', year: 'numeric',
      });
    } catch {
      return '-';
    }
  };

  // Data defaults
  const breakdown = Array.isArray(costData.costBreakdown) ? costData.costBreakdown : [];
  const projections = costData.projections || {};
  const totalEmployees = costData.totalEmployees ?? '-';
  const savingsPercentage = typeof costData.savingsPercentage === 'number' ? costData.savingsPercentage : 0;

  return (
    <Card>
      <CardContent>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box display="flex" alignItems="center">
            <AttachMoneyIcon sx={{ color: theme.palette.success.main, mr: 1 }} />
            <Typography variant="h6">Healthcare Cost Savings Analysis</Typography>
          </Box>
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

        {/* Period Info */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="body2" color="textSecondary">
            Analysis period: {safeFormatDate(costData.periodStart)} – {safeFormatDate(costData.periodEnd)}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Last updated: {safeFormatDate(costData.lastUpdated)}
          </Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Key Metrics */}
        <Grid container spacing={3} mb={2}>
          <Grid item xs={12} md={4}>
            <MetricCard
              title="Program ROI"
              value={`${costData.programROI ?? 0}x`}
              subtitle={`For every $1 invested, ${safeFormatCurrency(costData.programROI ?? 0)} returned`}
              trend={costData.roiTrend}
              isCostMetric={false}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <MetricCard
              title="Total Cost Savings"
              value={safeFormatCurrency(costData.totalSavings)}
              subtitle={`${safeFormatPercentage(savingsPercentage)} vs. previous period`}
              trend={savingsPercentage}
              isCostMetric={true}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <MetricCard
              title="Per Employee Savings"
              value={safeFormatCurrency(costData.perEmployeeSavings)}
              subtitle={`Across ${totalEmployees} employees`}
              trend={costData.perEmployeeSavingsTrend}
              isCostMetric={true}
            />
          </Grid>
        </Grid>

        {/* Cost Breakdown Table */}
        <Typography variant="subtitle1" gutterBottom>
          Cost Breakdown by Category
        </Typography>
        <StyledTableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: theme.palette.grey[100] }}>
                <TableCell>Category</TableCell>
                <TableCell align="right">Previous Period</TableCell>
                <TableCell align="right">Current Period</TableCell>
                <TableCell align="right">Savings</TableCell>
                <TableCell align="right">Change</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {breakdown.map((cat) => (
                <TableRow key={cat.name}>
                  <TableCell>{cat.name}</TableCell>
                  <TableCell align="right">{safeFormatCurrency(cat.previousCost)}</TableCell>
                  <TableCell align="right">{safeFormatCurrency(cat.currentCost)}</TableCell>
                  <TableCell align="right">{safeFormatCurrency(cat.savings)}</TableCell>
                  <TableCell align="right">
                    <Box display="flex" justifyContent="flex-end" alignItems="center">
                      {cat.percentChange < 0 ? (
                        <TrendingDownIcon fontSize="small" sx={{ color: theme.palette.success.main, mr: 0.5 }} />
                      ) : cat.percentChange > 0 ? (
                        <TrendingUpIcon fontSize="small" sx={{ color: theme.palette.error.main, mr: 0.5 }} />
                      ) : null}
                      <Typography
                        variant="body2"
                        sx={{
                          color:
                            cat.percentChange < 0
                              ? theme.palette.success.main
                              : cat.percentChange > 0
                              ? theme.palette.error.main
                              : theme.palette.text.secondary,
                        }}
                      >
                        {safeFormatPercentage(cat.percentChange)}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              {/* Totals Row */}
              <TableRow sx={{ backgroundColor: theme.palette.grey[50] }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                  {safeFormatCurrency(costData.totalPreviousCost)}
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                  {safeFormatCurrency(costData.totalCurrentCost)}
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                  {safeFormatCurrency(costData.totalSavings)}
                </TableCell>
                <TableCell align="right">
                  <Box display="flex" justifyContent="flex-end" alignItems="center">
                    {savingsPercentage > 0 ? (
                      <TrendingDownIcon fontSize="small" sx={{ color: theme.palette.success.main, mr: 0.5 }} />
                    ) : (
                      <TrendingUpIcon fontSize="small" sx={{ color: theme.palette.error.main, mr: 0.5 }} />
                    )}
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 'bold', color: savingsPercentage > 0 ? theme.palette.success.main : theme.palette.error.main }}
                    >
                      {safeFormatPercentage(savingsPercentage)}
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </StyledTableContainer>

        {/* Projected Savings */}
        <Typography variant="subtitle1" gutterBottom>
          Projected Annual Savings
        </Typography>
        <Box p={2} bgcolor={theme.palette.grey[50]} borderRadius={1} mb={2}>
          <Grid container spacing={3}>
            {['conservative', 'expected', 'optimistic'].map((key) => {
              const val = projections[key] ?? 0;
              return (
                <Grid item xs={12} md={4} key={key}>
                  <Box textAlign="center">
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      {key.charAt(0).toUpperCase() + key.slice(1)} Estimate
                    </Typography>
                    <Typography variant="h4" color={theme.palette.success.main} fontWeight="bold">
                      {safeFormatCurrency(val)}
                    </Typography>
                    {key === 'expected' && (
                      <Typography variant="caption" color="textSecondary">
                        Based on current trends
                      </Typography>
                    )}
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Box>

        {/* Insights */}
        <Box p={2} bgcolor={theme.palette.info.light + '20'} borderRadius={1}>
          <Typography variant="subtitle2" gutterBottom>
            Cost Insights
          </Typography>
          <Typography variant="body2">{costData.insights ?? '-'}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CostSavingsAnalysisCard;
