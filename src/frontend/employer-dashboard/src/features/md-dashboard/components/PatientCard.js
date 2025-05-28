import React from 'react';
import { Box, Typography, Grid, Chip } from '@mui/material';

const PatientCard = ({ patient }) => {
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" color="textSecondary">
            Patient ID
          </Typography>
          <Typography variant="body1" gutterBottom>
            {patient.id}
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" color="textSecondary">
            Name
          </Typography>
          <Typography variant="body1" gutterBottom>
            {patient.name}
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" color="textSecondary">
            Primary Condition
          </Typography>
          <Chip label={patient.condition} color="primary" size="small" />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" color="textSecondary">
            Priority
          </Typography>
          <Chip
            label={patient.priority}
            color={patient.priority === 'High' ? 'error' : 'warning'}
            size="small"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default PatientCard; 