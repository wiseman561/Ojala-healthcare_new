import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { Box, Container } from '@mui/material';
import theme from '../theme';
import HealthScoreOverviewCard from '../components/analytics/HealthScoreOverviewCard';
import CostSavingsAnalysisCard from '../components/cost/CostSavingsAnalysisCard';
import ProgramEffectivenessCard from '../components/program/ProgramEffectivenessCard';

function EmployerDashboardScreen() {
  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={3}>
          <HealthScoreOverviewCard />
          <CostSavingsAnalysisCard />
          <ProgramEffectivenessCard />
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default EmployerDashboardScreen;
