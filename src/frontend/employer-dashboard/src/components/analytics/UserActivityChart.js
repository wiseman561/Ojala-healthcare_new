import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  Divider, 
  Box,
  Typography,
  LinearProgress,
  useTheme
} from '@mui/material';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

/**
 * User Activity Chart Component
 * 
 * Displays a line chart showing user activity over time,
 * segmented by user type.
 * 
 * @param {Object} props - Component props
 * @param {Array} props.data - User activity data
 * @param {boolean} props.loading - Loading state
 */
const UserActivityChart = ({ data = [], loading = false }) => {
  const theme = useTheme();

  // Default data if none provided
  const defaultData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Patients',
        data: [65, 78, 52, 91, 83, 56, 80],
        borderColor: theme.palette.primary.main,
        backgroundColor: `${theme.palette.primary.main}20`,
        fill: true,
        tension: 0.4
      },
      {
        label: 'Providers',
        data: [28, 35, 40, 27, 32, 15, 25],
        borderColor: theme.palette.success.main,
        backgroundColor: `${theme.palette.success.main}20`,
        fill: true,
        tension: 0.4
      },
      {
        label: 'Employers',
        data: [12, 19, 15, 17, 20, 8, 10],
        borderColor: theme.palette.warning.main,
        backgroundColor: `${theme.palette.warning.main}20`,
        fill: true,
        tension: 0.4
      }
    ]
  };

  // Use provided data or default
  const chartData = data.length > 0 ? { 
    labels: data.map(item => item.date),
    datasets: data.map(item => item.datasets)
  } : defaultData;

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 10,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        grid: {
          color: theme.palette.divider
        },
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  // Calculate total active users
  const calculateTotalUsers = () => {
    if (chartData.datasets && chartData.datasets.length > 0) {
      // Sum the last data point from each dataset
      return chartData.datasets.reduce((total, dataset) => {
        const lastValue = dataset.data[dataset.data.length - 1] || 0;
        return total + lastValue;
      }, 0);
    } else if (defaultData.datasets && defaultData.datasets.length > 0) {
      // Use default data
      return defaultData.datasets.reduce((total, dataset) => {
        const lastValue = dataset.data[dataset.data.length - 1] || 0;
        return total + lastValue;
      }, 0);
    }
    return 0;
  };

  // Calculate week-over-week change
  const calculateWeeklyChange = () => {
    if (chartData.datasets && chartData.datasets.length > 0) {
      // Calculate total for current week and previous week
      const totalCurrentWeek = chartData.datasets.reduce((total, dataset) => {
        const lastValue = dataset.data[dataset.data.length - 1] || 0;
        return total + lastValue;
      }, 0);
      
      const totalPreviousWeek = chartData.datasets.reduce((total, dataset) => {
        const previousValue = dataset.data[0] || 0;
        return total + previousValue;
      }, 0);
      
      if (totalPreviousWeek === 0) return 0;
      
      return ((totalCurrentWeek - totalPreviousWeek) / totalPreviousWeek) * 100;
    } else if (defaultData.datasets && defaultData.datasets.length > 0) {
      // Use default data
      const totalCurrentWeek = defaultData.datasets.reduce((total, dataset) => {
        const lastValue = dataset.data[dataset.data.length - 1] || 0;
        return total + lastValue;
      }, 0);
      
      const totalPreviousWeek = defaultData.datasets.reduce((total, dataset) => {
        const previousValue = dataset.data[0] || 0;
        return total + previousValue;
      }, 0);
      
      if (totalPreviousWeek === 0) return 0;
      
      return ((totalCurrentWeek - totalPreviousWeek) / totalPreviousWeek) * 100;
    }
    return 0;
  };

  const totalUsers = calculateTotalUsers();
  const weeklyChange = calculateWeeklyChange();

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ height: '100%', p: 0 }}>
        {loading ? (
          <Box sx={{ p: 3 }}>
            <LinearProgress />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
              Loading user activity data...
            </Typography>
          </Box>
        ) : (
          <Box sx={{ height: '100%', position: 'relative' }}>
            <Box sx={{ position: 'absolute', top: 10, right: 16, zIndex: 1 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <Typography variant="caption" color="text.secondary">
                  Active Users
                </Typography>
                <Typography variant="h6">
                  {totalUsers.toLocaleString()}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', mt: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Weekly Change
                </Typography>
                <Typography variant="h6" color={weeklyChange >= 0 ? 'success.main' : 'error.main'}>
                  {weeklyChange >= 0 ? '+' : ''}{weeklyChange.toFixed(1)}%
                </Typography>
              </Box>
            </Box>
            <Box sx={{ p: 3, height: '100%' }}>
              <Line data={chartData} options={chartOptions} />
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default UserActivityChart;
