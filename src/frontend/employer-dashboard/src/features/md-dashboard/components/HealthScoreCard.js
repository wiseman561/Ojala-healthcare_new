import React from 'react';
import { Box, Typography } from '@mui/material';

const HealthScoreCard = ({ patientId }) => {
  // Mock data - replace with real data in production
  const healthScore = 85;
  const vitals = {
    bloodPressure: '120/80',
    heartRate: '72',
    temperature: '98.6',
    oxygenSaturation: '98%'
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          Health Score
        </Typography>
        <Typography variant="h4" color="primary">
          {healthScore}
        </Typography>
      </Box>
      <Box>
        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          Latest Vitals
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
          {Object.entries(vitals).map(([key, value]) => (
            <Box key={key}>
              <Typography variant="body2" color="textSecondary">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </Typography>
              <Typography variant="body1">
                {value}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default HealthScoreCard; 