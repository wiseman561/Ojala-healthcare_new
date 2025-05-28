import React from 'react';
import { Paper, Box, Chip, Typography } from '@mui/material';

const ConditionFilterBar = ({ onFilterChange }) => {
  const conditions = [
    'Hypertension',
    'Diabetes',
    'Heart Disease',
    'COPD',
    'Asthma',
    'Obesity'
  ];

  const handleConditionClick = (condition) => {
    // Toggle condition selection logic here
    onFilterChange([condition]);
  };

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
      <Typography variant="subtitle1" gutterBottom>
        Filter by Condition
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {conditions.map((condition) => (
          <Chip
            key={condition}
            label={condition}
            onClick={() => handleConditionClick(condition)}
            clickable
          />
        ))}
      </Box>
    </Paper>
  );
};

export default ConditionFilterBar; 