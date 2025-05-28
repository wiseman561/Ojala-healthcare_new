import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Button,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
  Divider,
  Badge,
  Avatar
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  VideoCall as VideoCallIcon,
  CalendarToday as CalendarTodayIcon,
  AccessTime as AccessTimeIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';
import { theme } from '../../theme';

/**
 * TelehealthSchedulingPanel Component
 * 
 * Provides an interface for RNs to schedule and manage
 * telehealth appointments with patients.
 * 
 * @param {Object} props
 * @param {Array} props.appointments - Array of appointment objects
 * @param {Function} props.onScheduleAppointment - Function to call when scheduling a new appointment
 * @param {Function} props.onJoinAppointment - Function to call when joining an appointment
 * @param {Function} props.onViewAppointment - Function to call when viewing appointment details
 * @param {Function} props.onCancelAppointment - Function to call when canceling an appointment
 * @param {Function} props.onMoreOptions - Function to call when clicking more options
 */
const TelehealthSchedulingPanel = ({ 
  appointments = [], 
  onScheduleAppointment,
  onJoinAppointment,
  onViewAppointment,
  onCancelAppointment,
  onMoreOptions
}) => {
  const [activeTab, setActiveTab] = useState(0);
  
  // Filter appointments based on active tab
  const getFilteredAppointments = () => {
    const now = new Date();
    
    switch(activeTab) {
      case 0: // Today
        return appointments.filter(appointment => {
          const appointmentDate = new Date(appointment.startTime);
          return appointmentDate.toDateString() === now.toDateString();
        });
      case 1: // Upcoming
        return appointments.filter(appointment => {
          const appointmentDate = new Date(appointment.startTime);
          return appointmentDate > now && appointmentDate.toDateString() !== now.toDateString();
        });
      case 2: // Past
        return appointments.filter(appointment => {
          const appointmentDate = new Date(appointment.startTime);
          return appointmentDate < now && appointment.status !== 'cancelled';
        });
      case 3: // Cancelled
        return appointments.filter(appointment => 
          appointment.status === 'cancelled'
        );
      default:
        return appointments;
    }
  };
  
  const filteredAppointments = getFilteredAppointments();
  
  // Helper function to format date and time
  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Helper function to format date
  const formatDate = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Helper function to check if appointment can be joined
  const canJoinAppointment = (appointment) => {
    if (appointment.status !== 'confirmed') return false;
    
    const now = new Date();
    const appointmentTime = new Date(appointment.startTime);
    const diffMs = appointmentTime - now;
    const diffMins = Math.floor(diffMs / 60000);
    
    // Can join 5 minutes before scheduled time
    return diffMins <= 5 && diffMins > -30; // Can join up to 30 minutes after start time
  };
  
  // Helper function to get status color
  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed':
        return theme.palette.success.main;
      case 'pending':
        return theme.palette.warning.main;
      case 'cancelled':
        return theme.palette.error.main;
      case 'completed':
        return theme.palette.info.main;
      default:
        return theme.palette.grey[500];
    }
  };
  
  // Helper function to get status text
  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };
  
  // Group appointments by date
  const groupAppointmentsByDate = (appointments) => {
    const groups = {};
    
    appointments.forEach(appointment => {
      const date = new Date(appointment.startTime).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(appointment);
    });
    
    return Object.entries(groups).map(([date, appointments]) => ({
      date,
      formattedDate: formatDate(date),
      appointments: appointments.sort((a, b) => 
        new Date(a.startTime) - new Date(b.startTime)
      )
    }));
  };
  
  const groupedAppointments = groupAppointmentsByDate(filteredAppointments);

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box 
        sx={{ 
          p: 2, 
          borderBottom: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Telehealth Appointments</Typography>
          
          <Button
            variant="contained"
            color="primary"
            startIcon={<CalendarTodayIcon />}
            onClick={onScheduleAppointment}
          >
            Schedule New
          </Button>
        </Box>
        
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab 
            label={
              <Badge 
                color="error" 
                badgeContent={appointments.filter(a => {
                  const appointmentDate = new Date(a.startTime);
                  return appointmentDate.toDateString() === new Date().toDateString();
                }).length}
                showZero={false}
              >
                Today
              </Badge>
            } 
          />
          <Tab 
            label={
              <Badge 
                color="primary" 
                badgeContent={appointments.filter(a => {
                  const appointmentDate = new Date(a.startTime);
                  return appointmentDate > new Date() && 
                    appointmentDate.toDateString() !== new Date().toDateString();
                }).length}
                showZero={false}
              >
                Upcoming
              </Badge>
            } 
          />
          <Tab label="Past" />
          <Tab label="Cancelled" />
        </Tabs>
      </Box>
      
      {/* Appointments List */}
      <Box 
        sx={{ 
          flex: 1, 
          overflowY: 'auto',
          p: 2,
          backgroundColor: theme.palette.grey[50]
        }}
      >
        {groupedAppointments.length > 0 ? (
          groupedAppointments.map((group, groupIndex) => (
            <Box key={groupIndex} mb={3}>
              <DateHeader date={group.formattedDate} />
              
              {group.appointments.map((appointment, appointmentIndex) => (
                <AppointmentCard 
                  key={appointmentIndex}
                  appointment={appointment}
                  canJoin={canJoinAppointment(appointment)}
                  onJoin={() => onJoinAppointment(appointment.id)}
                  onView={() => onViewAppointment(appointment.id)}
                  onCancel={() => onCancelAppointment(appointment.id)}
                  onMoreOptions={(e) => onMoreOptions(appointment.id, e.currentTarget)}
                />
              ))}
            </Box>
          ))
        ) : (
          <Box 
            display="flex" 
            flexDirection="column" 
            alignItems="center" 
            justifyContent="center"
            height="100%"
            p={3}
          >
            <CalendarTodayIcon sx={{ fontSize: 48, color: theme.palette.grey[400], mb: 2 }} />
            <Typography variant="h6" color="textSecondary" gutterBottom>
              No {activeTab === 0 ? 'Today\'s' : 
                   activeTab === 1 ? 'Upcoming' : 
                   activeTab === 2 ? 'Past' : 'Cancelled'} Appointments
            </Typography>
            <Typography variant="body2" color="textSecondary" align="center">
              {activeTab <= 1 ? 
                'Schedule a telehealth appointment with a patient.' : 
                'Previous appointments will appear here.'}
            </Typography>
            
            {activeTab <= 1 && (
              <Button
                variant="outlined"
                color="primary"
                startIcon={<CalendarTodayIcon />}
                onClick={onScheduleAppointment}
                sx={{ mt: 2 }}
              >
                Schedule Appointment
              </Button>
            )}
          </Box>
        )}
      </Box>
    </Card>
  );
};

// Helper Components
const DateHeader = ({ date }) => (
  <Box display="flex" alignItems="center" mb={2}>
    <Divider sx={{ flex: 1, mr: 2 }} />
    <Typography variant="subtitle2" color="textSecondary">
      {date}
    </Typography>
    <Divider sx={{ flex: 1, ml: 2 }} />
  </Box>
);

const AppointmentCard = ({ 
  appointment, 
  canJoin, 
  onJoin, 
  onView, 
  onCancel, 
  onMoreOptions 
}) => {
  const startTime = formatDateTime(appointment.startTime);
  const endTime = formatDateTime(appointment.endTime);
  
  return (
    <Card 
      variant="outlined" 
      sx={{ 
        mb: 2,
        borderLeft: `4px solid ${getStatusColor(appointment.status)}`,
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
        }
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={7}>
            <Box display="flex" alignItems="center">
              <Avatar 
                src={appointment.patient?.profileImage} 
                alt={appointment.patient ? `${appointment.patient.firstName} ${appointment.patient.lastName}` : 'Patient'}
                sx={{ width: 48, height: 48, mr: 2 }}
              >
                {appointment.patient && appointment.patient.firstName[0] + appointment.patient.lastName[0]}
              </Avatar>
              
              <Box>
                <Typography variant="subtitle1">
                  {appointment.patient ? `${appointment.patient.firstName} ${appointment.patient.lastName}` : 'Unknown Patient'}
                </Typography>
                
                <Typography variant="body2" color="textSecondary">
                  {appointment.patient ? `ID: ${appointment.patient.patientId}` : ''}
                  {appointment.reason && ` • ${appointment.reason}`}
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={5}>
            <Box display="flex" flexDirection="column" alignItems="flex-end">
              <Box display="flex" alignItems="center" mb={1}>
                <AccessTimeIcon fontSize="small" sx={{ color: theme.palette.text.secondary, mr: 1 }} />
                <Typography variant="body2">
                  {startTime} - {endTime}
                </Typography>
              </Box>
              
              <Chip 
                label={getStatusText(appointment.status)}
                size="small"
                sx={{ 
                  backgroundColor: getStatusColor(appointment.status) + '20',
                  color: getStatusColor(appointment.status),
                  fontWeight: 'medium'
                }}
              />
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box>
                <Chip 
                  label={appointment.appointmentType}
                  size="small"
                  variant="outlined"
                  sx={{ mr: 1 }}
                />
                
                {appointment.urgency === 'urgent' && (
                  <Chip 
                    label="Urgent"
                    size="small"
                    color="error"
                    variant="outlined"
                  />
                )}
              </Box>
              
              <Box>
                {canJoin && (
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<VideoCallIcon />}
                    size="small"
                    onClick={onJoin}
                    sx={{ mr: 1 }}
                  >
                    Join Now
                  </Button>
                )}
                
                <Button
                  variant="outlined"
                  size="small"
                  onClick={onView}
                  sx={{ mr: 1 }}
                >
                  View
                </Button>
                
                {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
                  <Tooltip title="Cancel Appointment">
                    <IconButton size="small" onClick={onCancel} sx={{ mr: 1 }}>
                      <CancelIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
                
                <Tooltip title="More Options">
                  <IconButton size="small" onClick={onMoreOptions}>
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

// Helper Functions
const formatDateTime = (dateTimeString) => {
  const date = new Date(dateTimeString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const Chip = styled('div')(({ theme, size, color, variant, label, backgroundColor }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: size === 'small' ? 24 : 32,
  borderRadius: 16,
  padding: size === 'small' ? '0 8px' : '0 12px',
  fontSize: size === 'small' ? '0.75rem' : '0.875rem',
  backgroundColor: backgroundColor || (
    variant === 'outlined' 
      ? 'transparent' 
      : color 
        ? theme.palette[color].main 
        : theme.palette.grey[300]
  ),
  color: variant === 'outlined' 
    ? (color ? theme.palette[color].main : theme.palette.text.primary)
    : (color ? theme.palette[color].contrastText : theme.palette.text.primary),
  border: variant === 'outlined' 
    ? `1px solid ${color ? theme.palette[color].main : theme.palette.grey[300]}`
    : 'none',
  whiteSpace: 'nowrap',
}));

export default TelehealthSchedulingPanel;
