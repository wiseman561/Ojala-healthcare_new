import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  Divider, 
  Box,
  Button,
  Grid,
  Typography,
  IconButton,
  Tooltip
} from '@mui/material';
import AddUserIcon from '@mui/icons-material/PersonAdd';
import SettingsIcon from '@mui/icons-material/Settings';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import BusinessIcon from '@mui/icons-material/Business';
import SecurityIcon from '@mui/icons-material/Security';
import SyncIcon from '@mui/icons-material/Sync';
import BackupIcon from '@mui/icons-material/Backup';
import ReportIcon from '@mui/icons-material/Assessment';
import NotificationsIcon from '@mui/icons-material/Notifications';
import HelpIcon from '@mui/icons-material/Help';

/**
 * Quick Actions Card Component
 * 
 * Provides quick access to common administrative actions
 * from the dashboard.
 */
const QuickActionsCard = () => {
  // Define quick actions
  const quickActions = [
    {
      id: 'add-user',
      title: 'Add User',
      icon: <AddUserIcon />,
      color: '#2196F3',
      path: '/admin/users/new'
    },
    {
      id: 'system-settings',
      title: 'System Settings',
      icon: <SettingsIcon />,
      color: '#9C27B0',
      path: '/admin/settings'
    },
    {
      id: 'health-scores',
      title: 'Health Scores',
      icon: <HealthAndSafetyIcon />,
      color: '#4CAF50',
      path: '/admin/health-scores'
    },
    {
      id: 'organizations',
      title: 'Organizations',
      icon: <BusinessIcon />,
      color: '#FF9800',
      path: '/admin/organizations'
    },
    {
      id: 'security',
      title: 'Security',
      icon: <SecurityIcon />,
      color: '#F44336',
      path: '/admin/security'
    },
    {
      id: 'integrations',
      title: 'Integrations',
      icon: <SyncIcon />,
      color: '#00BCD4',
      path: '/admin/integrations'
    },
    {
      id: 'backups',
      title: 'Backups',
      icon: <BackupIcon />,
      color: '#795548',
      path: '/admin/backups'
    },
    {
      id: 'reports',
      title: 'Reports',
      icon: <ReportIcon />,
      color: '#607D8B',
      path: '/admin/reports'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: <NotificationsIcon />,
      color: '#FF5722',
      path: '/admin/notifications'
    }
  ];

  // Handle action click
  const handleActionClick = (path) => {
    // In a real implementation, this would use React Router navigation
    console.log(`Navigating to: ${path}`);
  };

  return (
    <Card>
      <CardHeader 
        title="Quick Actions" 
        action={
          <Tooltip title="Help">
            <IconButton size="small">
              <HelpIcon />
            </IconButton>
          </Tooltip>
        }
      />
      <Divider />
      <CardContent>
        <Grid container spacing={2}>
          {quickActions.map((action) => (
            <Grid item xs={4} key={action.id}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => handleActionClick(action.path)}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 2,
                  height: '100%',
                  borderColor: 'rgba(0, 0, 0, 0.12)',
                  '&:hover': {
                    borderColor: action.color,
                    backgroundColor: `${action.color}10`
                  }
                }}
              >
                <Box 
                  sx={{ 
                    color: action.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 1
                  }}
                >
                  {action.icon}
                </Box>
                <Typography variant="caption" color="textSecondary">
                  {action.title}
                </Typography>
              </Button>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default QuickActionsCard;
