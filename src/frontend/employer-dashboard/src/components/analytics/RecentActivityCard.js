import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  Divider, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  ListItemAvatar,
  Avatar,
  Typography,
  Box,
  IconButton,
  Tooltip,
  LinearProgress,
  Chip
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import PersonIcon from '@mui/icons-material/Person';
import SecurityIcon from '@mui/icons-material/Security';
import SettingsIcon from '@mui/icons-material/Settings';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import WarningIcon from '@mui/icons-material/Warning';
import SystemUpdateIcon from '@mui/icons-material/SystemUpdate';

/**
 * Recent Activity Card Component
 * 
 * Displays a list of recent system activities with user information,
 * activity type, and timestamp.
 * 
 * @param {Object} props - Component props
 * @param {Array} props.activities - List of activity objects
 * @param {boolean} props.loading - Loading state
 */
const RecentActivityCard = ({ activities = [], loading = false }) => {
  // Get icon based on activity type
  const getActivityIcon = (type) => {
    const iconMap = {
      'login': <LoginIcon sx={{ color: 'primary.main' }} />,
      'logout': <LogoutIcon sx={{ color: 'primary.light' }} />,
      'create': <AddIcon sx={{ color: 'success.main' }} />,
      'update': <EditIcon sx={{ color: 'info.main' }} />,
      'delete': <DeleteIcon sx={{ color: 'error.main' }} />,
      'security': <SecurityIcon sx={{ color: 'warning.main' }} />,
      'settings': <SettingsIcon sx={{ color: 'secondary.main' }} />,
      'health': <HealthAndSafetyIcon sx={{ color: 'success.main' }} />,
      'system': <SystemUpdateIcon sx={{ color: 'info.main' }} />,
      'warning': <WarningIcon sx={{ color: 'warning.main' }} />
    };

    return iconMap[type] || <PersonIcon sx={{ color: 'primary.main' }} />;
  };

  // Get avatar based on user role
  const getUserAvatar = (user) => {
    if (!user) return null;

    const roleColorMap = {
      'admin': '#9C27B0', // purple
      'provider': '#2196F3', // blue
      'nurse': '#4CAF50', // green
      'patient': '#FF9800', // orange
      'employer': '#795548', // brown
      'support': '#607D8B' // blue-grey
    };

    const bgColor = roleColorMap[user.role] || '#9E9E9E'; // default grey
    
    if (user.avatar) {
      return <Avatar src={user.avatar} alt={user.name} />;
    } else {
      return (
        <Avatar sx={{ bgcolor: bgColor }}>
          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </Avatar>
      );
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) {
      return 'just now';
    } else if (diffMin < 60) {
      return `${diffMin} minute${diffMin !== 1 ? 's' : ''} ago`;
    } else if (diffHour < 24) {
      return `${diffHour} hour${diffHour !== 1 ? 's' : ''} ago`;
    } else if (diffDay < 7) {
      return `${diffDay} day${diffDay !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Get activity description
  const getActivityDescription = (activity) => {
    const { type, user, details } = activity;
    
    const typeDescriptionMap = {
      'login': 'logged in',
      'logout': 'logged out',
      'create': `created ${details?.resourceType || 'a resource'}`,
      'update': `updated ${details?.resourceType || 'a resource'}`,
      'delete': `deleted ${details?.resourceType || 'a resource'}`,
      'security': 'performed a security action',
      'settings': 'changed settings',
      'health': 'updated health information',
      'system': 'performed a system action',
      'warning': 'triggered a warning'
    };

    const action = typeDescriptionMap[type] || 'performed an action';
    
    return (
      <Typography variant="body2">
        <Typography component="span" fontWeight="bold">
          {user?.name || 'Unknown user'}
        </Typography>
        {' '}
        {action}
        {details?.resourceName && (
          <>
            {': '}
            <Typography component="span" fontStyle="italic">
              {details.resourceName}
            </Typography>
          </>
        )}
      </Typography>
    );
  };

  // Get activity details
  const getActivityDetails = (activity) => {
    const { details, ipAddress } = activity;
    
    return (
      <Box>
        {details?.message && (
          <Typography variant="body2" color="text.secondary">
            {details.message}
          </Typography>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
          {activity.user?.role && (
            <Chip 
              size="small" 
              label={activity.user.role.charAt(0).toUpperCase() + activity.user.role.slice(1)} 
              variant="outlined"
              sx={{ height: 20, fontSize: '0.7rem' }}
            />
          )}
          {ipAddress && (
            <Typography variant="caption" color="text.secondary">
              IP: {ipAddress}
            </Typography>
          )}
        </Box>
      </Box>
    );
  };

  return (
    <Card>
      <CardHeader 
        title="Recent Activity" 
        action={
          <Tooltip title="Refresh Activity">
            <IconButton size="small">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        }
      />
      <Divider />
      <CardContent sx={{ p: 0 }}>
        {loading ? (
          <LinearProgress />
        ) : (
          <>
            {activities.length > 0 ? (
              <List disablePadding>
                {activities.map((activity) => (
                  <React.Fragment key={activity.id}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        {getUserAvatar(activity.user)}
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {getActivityIcon(activity.type)}
                            {getActivityDescription(activity)}
                          </Box>
                        }
                        secondary={
                          <Box sx={{ display: 'flex', flexDirection: 'column', mt: 0.5 }}>
                            {getActivityDetails(activity)}
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                              {formatDate(activity.timestamp)}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  No recent activity
                </Typography>
              </Box>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivityCard;
