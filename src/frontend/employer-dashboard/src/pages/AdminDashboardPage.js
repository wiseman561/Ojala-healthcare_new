import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  CardHeader,
  Divider,
  Button,
  IconButton,
  Tooltip,
  LinearProgress,
  Badge
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import SecurityIcon from '@mui/icons-material/Security';
import WarningIcon from '@mui/icons-material/Warning';

// Import components
import SystemStatusCard from '../../components/dashboard/SystemStatusCard';
import MetricsOverviewCard from '../../components/dashboard/MetricsOverviewCard';
import RecentActivityCard from '../../components/dashboard/RecentActivityCard';
import AlertsCard from '../../components/dashboard/AlertsCard';
import UserActivityChart from '../../components/dashboard/UserActivityChart';
import HealthScoreDistributionChart from '../../components/dashboard/HealthScoreDistributionChart';
import IntegrationStatusCard from '../../components/dashboard/IntegrationStatusCard';
import QuickActionsCard from '../../components/dashboard/QuickActionsCard';

// Import services
import { getDashboardMetrics } from '../../services/dashboard-service';
import { getSystemStatus } from '../../services/system-service';
import { getRecentActivity } from '../../services/audit-service';
import { getActiveAlerts } from '../../services/alert-service';

/**
 * Admin Dashboard Page
 * 
 * Main dashboard for the admin panel showing system status, key metrics,
 * recent activity, and alerts.
 */
const AdminDashboardPage = () => {
  // State for dashboard data
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState(null);
  const [systemStatus, setSystemStatus] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Load dashboard data
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Function to load all dashboard data
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load data in parallel
      const [metricsData, statusData, activityData, alertsData] = await Promise.all([
        getDashboardMetrics(),
        getSystemStatus(),
        getRecentActivity({ limit: 10 }),
        getActiveAlerts()
      ]);

      // Update state with loaded data
      setMetrics(metricsData);
      setSystemStatus(statusData);
      setRecentActivity(activityData);
      setAlerts(alertsData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Handle error state
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Handle manual refresh
  const handleRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  return (
    <Container maxWidth="xl">
      {/* Dashboard Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>
        <Box>
          <Tooltip title="Notifications">
            <IconButton>
              <Badge badgeContent={alerts?.length || 0} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          <Tooltip title="Refresh Dashboard">
            <IconButton onClick={handleRefresh} disabled={refreshing}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Dashboard Settings">
            <IconButton>
              <SettingsIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Loading indicator */}
      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {/* Key Metrics Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">Total Users</Typography>
                <Typography variant="h4">{metrics?.totalUsers || '0'}</Typography>
                <Typography variant="body2" color={metrics?.userGrowth >= 0 ? 'success.main' : 'error.main'}>
                  {metrics?.userGrowth >= 0 ? '+' : ''}{metrics?.userGrowth || 0}% from last month
                </Typography>
              </Box>
              <PeopleIcon sx={{ fontSize: 48, color: 'primary.main', opacity: 0.7 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">Organizations</Typography>
                <Typography variant="h4">{metrics?.totalOrganizations || '0'}</Typography>
                <Typography variant="body2" color={metrics?.organizationGrowth >= 0 ? 'success.main' : 'error.main'}>
                  {metrics?.organizationGrowth >= 0 ? '+' : ''}{metrics?.organizationGrowth || 0}% from last month
                </Typography>
              </Box>
              <BusinessIcon sx={{ fontSize: 48, color: 'secondary.main', opacity: 0.7 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">Avg. Health Score</Typography>
                <Typography variant="h4">{metrics?.averageHealthScore || '0'}</Typography>
                <Typography variant="body2" color={metrics?.healthScoreChange >= 0 ? 'success.main' : 'error.main'}>
                  {metrics?.healthScoreChange >= 0 ? '+' : ''}{metrics?.healthScoreChange || 0} points from last month
                </Typography>
              </Box>
              <HealthAndSafetyIcon sx={{ fontSize: 48, color: 'success.main', opacity: 0.7 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">Active Alerts</Typography>
                <Typography variant="h4">{alerts?.length || '0'}</Typography>
                <Typography variant="body2" color={metrics?.alertsChange <= 0 ? 'success.main' : 'error.main'}>
                  {metrics?.alertsChange <= 0 ? '' : '+'}{metrics?.alertsChange || 0} from last week
                </Typography>
              </Box>
              <WarningIcon sx={{ fontSize: 48, color: 'warning.main', opacity: 0.7 }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Dashboard Content */}
      <Grid container spacing={3}>
        {/* System Status */}
        <Grid item xs={12} lg={8}>
          <SystemStatusCard status={systemStatus} loading={loading} />
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} lg={4}>
          <QuickActionsCard />
        </Grid>

        {/* User Activity Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="User Activity" />
            <Divider />
            <CardContent sx={{ height: 300 }}>
              <UserActivityChart data={metrics?.userActivity || []} loading={loading} />
            </CardContent>
          </Card>
        </Grid>

        {/* Health Score Distribution */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Health Score Distribution" />
            <Divider />
            <CardContent sx={{ height: 300 }}>
              <HealthScoreDistributionChart data={metrics?.healthScoreDistribution || []} loading={loading} />
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <RecentActivityCard activities={recentActivity} loading={loading} />
        </Grid>

        {/* Active Alerts */}
        <Grid item xs={12} md={6}>
          <AlertsCard alerts={alerts} loading={loading} />
        </Grid>

        {/* Integration Status */}
        <Grid item xs={12}>
          <IntegrationStatusCard integrations={systemStatus?.integrations || []} loading={loading} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboardPage;
