import React from 'react';
import { Box, Typography, Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from '@mui/material';
import { Warning as WarningIcon, Error as ErrorIcon, Info as InfoIcon } from '@mui/icons-material';

const AlertCard = ({ patientId, mdFiltered }) => {
  // Mock data - replace with real data in production
  const alerts = [
    {
      id: 1,
      type: 'warning',
      message: 'Blood pressure above threshold',
      timestamp: '2024-03-20 14:30',
      severity: 'warning'
    },
    {
      id: 2,
      type: 'error',
      message: 'Critical heart rate detected',
      timestamp: '2024-03-20 13:15',
      severity: 'error'
    },
    {
      id: 3,
      type: 'info',
      message: 'Medication reminder',
      timestamp: '2024-03-20 12:00',
      severity: 'info'
    }
  ];

  const getIcon = (severity) => {
    switch (severity) {
      case 'error':
        return <ErrorIcon color="error" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      default:
        return <InfoIcon color="info" />;
    }
  };

  return (
    <Box>
      <Timeline>
        {alerts.map((alert) => (
          <TimelineItem key={alert.id}>
            <TimelineSeparator>
              <TimelineDot color={alert.severity}>
                {getIcon(alert.severity)}
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Typography variant="subtitle2">
                {alert.message}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {alert.timestamp}
              </Typography>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </Box>
  );
};

export default AlertCard; 