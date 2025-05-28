import React, { useState } from 'react';
import { Card, CardHeader, CardContent, Typography, Box, Tooltip, IconButton, Button, Grid, Badge } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

/**
 * RealTimeAlertsCard component for displaying real-time alerts and notifications
 */
const RealTimeAlertsCard = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [alerts, setAlerts] = useState(generateMockAlerts());
  
  // Filter alerts by severity
  const criticalAlerts = alerts.filter(alert => alert.severity === 'critical');
  const highAlerts = alerts.filter(alert => alert.severity === 'high');
  const mediumAlerts = alerts.filter(alert => alert.severity === 'medium');
  const lowAlerts = alerts.filter(alert => alert.severity === 'low');
  
  // Handle mark as read
  const handleMarkAsRead = (alertId) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, read: true } : alert
    ));
  };
  
  // Handle mark all as read
  const handleMarkAllAsRead = () => {
    setAlerts(alerts.map(alert => ({ ...alert, read: true })));
  };
  
  // Get severity icon
  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical':
        return <ErrorIcon sx={{ color: '#d32f2f' }} />;
      case 'high':
        return <WarningIcon sx={{ color: '#f57c00' }} />;
      case 'medium':
        return <InfoIcon sx={{ color: '#0288d1' }} />;
      case 'low':
        return <CheckCircleIcon sx={{ color: '#388e3c' }} />;
      default:
        return <InfoIcon />;
    }
  };
  
  // Get severity color
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return '#d32f2f';
      case 'high':
        return '#f57c00';
      case 'medium':
        return '#0288d1';
      case 'low':
        return '#388e3c';
      default:
        return '#757575';
    }
  };

  return (
    <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h6" component="div">
              Real-Time Alerts
            </Typography>
            <Badge 
              badgeContent={alerts.filter(a => !a.read).length} 
              color="error"
              sx={{ ml: 1 }}
            >
              <NotificationsActiveIcon />
            </Badge>
          </Box>
        }
        action={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button 
              variant="text" 
              size="small" 
              onClick={handleMarkAllAsRead}
              disabled={alerts.every(a => a.read)}
              sx={{ mr: 1 }}
            >
              Mark All Read
            </Button>
            <Tooltip 
              title={
                <React.Fragment>
                  <Typography variant="body2">The Real-Time Alerts dashboard displays critical notifications that require attention.</Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>Alerts are categorized by severity: Critical, High, Medium, and Low.</Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>Click on an alert to view details and mark it as read.</Typography>
                </React.Fragment>
              }
              arrow
              open={showTooltip}
              onClose={() => setShowTooltip(false)}
              disableFocusListener
              disableHoverListener
              disableTouchListener
            >
              <IconButton 
                aria-label="alerts info"
                onClick={() => setShowTooltip(!showTooltip)}
              >
                <HelpOutlineIcon />
              </IconButton>
            </Tooltip>
          </Box>
        }
      />
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6} sm={3}>
            <Card 
              elevation={1} 
              sx={{ 
                bgcolor: '#ffebee', 
                p: 1.5, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                borderLeft: '4px solid #d32f2f'
              }}
            >
              <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color: '#d32f2f' }}>
                {criticalAlerts.length}
              </Typography>
              <Typography variant="body2" sx={{ color: '#d32f2f' }}>
                Critical
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card 
              elevation={1} 
              sx={{ 
                bgcolor: '#fff3e0', 
                p: 1.5, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                borderLeft: '4px solid #f57c00'
              }}
            >
              <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color: '#f57c00' }}>
                {highAlerts.length}
              </Typography>
              <Typography variant="body2" sx={{ color: '#f57c00' }}>
                High
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card 
              elevation={1} 
              sx={{ 
                bgcolor: '#e1f5fe', 
                p: 1.5, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                borderLeft: '4px solid #0288d1'
              }}
            >
              <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color: '#0288d1' }}>
                {mediumAlerts.length}
              </Typography>
              <Typography variant="body2" sx={{ color: '#0288d1' }}>
                Medium
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card 
              elevation={1} 
              sx={{ 
                bgcolor: '#e8f5e9', 
                p: 1.5, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                borderLeft: '4px solid #388e3c'
              }}
            >
              <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color: '#388e3c' }}>
                {lowAlerts.length}
              </Typography>
              <Typography variant="body2" sx={{ color: '#388e3c' }}>
                Low
              </Typography>
            </Card>
          </Grid>
        </Grid>
        
        <Box sx={{ flexGrow: 1, overflowY: 'auto', maxHeight: 400 }}>
          {alerts.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
              <Typography variant="body1" color="text.secondary">
                No alerts to display
              </Typography>
            </Box>
          ) : (
            alerts.map((alert) => (
              <Card 
                key={alert.id} 
                elevation={1} 
                sx={{ 
                  mb: 2, 
                  p: 2,
                  opacity: alert.read ? 0.7 : 1,
                  borderLeft: `4px solid ${getSeverityColor(alert.severity)}`,
                  bgcolor: alert.read ? '#f5f5f5' : 'white'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <Box sx={{ mr: 2, mt: 0.5 }}>
                    {getSeverityIcon(alert.severity)}
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {alert.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatTimestamp(alert.timestamp)}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {alert.message}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="caption" sx={{ 
                          display: 'inline-block',
                          bgcolor: `${getSeverityColor(alert.severity)}20`,
                          color: getSeverityColor(alert.severity),
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          mr: 1
                        }}>
                          {alert.severity.toUpperCase()}
                        </Typography>
                        <Typography variant="caption" sx={{ 
                          display: 'inline-block',
                          bgcolor: '#f5f5f5',
                          px: 1,
                          py: 0.5,
                          borderRadius: 1
                        }}>
                          {alert.category}
                        </Typography>
                      </Box>
                      <Button 
                        variant="text" 
                        size="small" 
                        onClick={() => handleMarkAsRead(alert.id)}
                        disabled={alert.read}
                      >
                        {alert.read ? 'Read' : 'Mark as Read'}
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Card>
            ))
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

/**
 * Generate mock alerts
 * @returns {Array} Array of mock alerts
 */
function generateMockAlerts() {
  return [
    {
      id: 1,
      title: 'Patient Health Score Critical Decline',
      message: 'Patient John Smith (ID: 12345) has experienced a 15-point drop in health score over the past 24 hours. Current score: 45 (High Risk).',
      severity: 'critical',
      category: 'Health Score',
      timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(), // 25 minutes ago
      read: false
    },
    {
      id: 2,
      title: 'Medication Adherence Alert',
      message: 'Patient Maria Garcia (ID: 23456) has missed 3 consecutive doses of Lisinopril. Last dose taken: 04/20/2025.',
      severity: 'high',
      category: 'Medication',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      read: false
    },
    {
      id: 3,
      title: 'Abnormal Vital Signs Detected',
      message: 'Patient Robert Johnson (ID: 34567) has reported blood pressure of 165/95 mmHg, which is 20% above their baseline.',
      severity: 'high',
      category: 'Vitals',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
      read: true
    },
    {
      id: 4,
      title: 'New Lab Results Available',
      message: 'Lab results for Patient Sarah Williams (ID: 45678) have been uploaded. HbA1c: 8.2% (above target range).',
      severity: 'medium',
      category: 'Labs',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
      read: false
    },
    {
      id: 5,
      title: 'Appointment Reminder',
      message: 'You have 3 upcoming telehealth appointments scheduled for tomorrow (04/23/2025).',
      severity: 'low',
      category: 'Appointments',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
      read: true
    },
    {
      id: 6,
      title: 'System Update Scheduled',
      message: 'A system maintenance update is scheduled for 04/25/2025 at 02:00 AM EDT. Expected downtime: 30 minutes.',
      severity: 'medium',
      category: 'System',
      timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(), // 18 hours ago
      read: false
    },
    {
      id: 7,
      title: 'Care Plan Updated',
      message: 'Dr. Thompson has updated the care plan for Patient Michael Brown (ID: 56789). Review required.',
      severity: 'medium',
      category: 'Care Plan',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 24 hours ago
      read: true
    },
    {
      id: 8,
      title: 'Device Battery Low',
      message: 'Patient David Miller (ID: 67890) has a blood glucose monitor with battery level at 15%. Replacement recommended.',
      severity: 'low',
      category: 'Device',
      timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(), // 36 hours ago
      read: false
    }
  ];
}

/**
 * Format timestamp for display
 * @param {string} timestamp ISO timestamp
 * @returns {string} Formatted time string
 */
function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  
  if (diffMin < 1) {
    return 'Just now';
  } else if (diffMin < 60) {
    return `${diffMin} minute${diffMin === 1 ? '' : 's'} ago`;
  } else if (diffHour < 24) {
    return `${diffHour} hour${diffHour === 1 ? '' : 's'} ago`;
  } else {
    return `${diffDay} day${diffDay === 1 ? '' : 's'} ago`;
  }
}

export default RealTimeAlertsCard;
