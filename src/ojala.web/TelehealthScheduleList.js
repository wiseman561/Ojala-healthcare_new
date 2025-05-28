import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Tabs, 
  Tab, 
  Divider,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Avatar,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
  Grid
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import VideocamIcon from '@mui/icons-material/Videocam';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import axios from 'axios';
import { format, isToday, isTomorrow, addDays, isAfter, isBefore, subMinutes } from 'date-fns';

const TelehealthScheduleList = ({ onStartSession }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [openRescheduleModal, setOpenRescheduleModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [newDateTime, setNewDateTime] = useState(new Date());
  const [rescheduleLoading, setRescheduleLoading] = useState(false);
  const [rescheduleError, setRescheduleError] = useState('');

  useEffect(() => {
    fetchSessions();
    
    // Set up polling to refresh sessions every minute
    const intervalId = setInterval(fetchSessions, 60000);
    
    return () => clearInterval(intervalId);
  }, []);

  const fetchSessions = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/telehealth/sessions?role=provider`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      setSessions(response.data);
    } catch (error) {
      console.error('Error fetching telehealth sessions:', error);
      setError('Failed to load telehealth sessions. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenReschedule = (session) => {
    setSelectedSession(session);
    setNewDateTime(new Date(session.scheduledAt));
    setOpenRescheduleModal(true);
    setRescheduleError('');
  };

  const handleCloseRescheduleModal = () => {
    setOpenRescheduleModal(false);
    setSelectedSession(null);
    setRescheduleError('');
  };

  const handleReschedule = async () => {
    if (!selectedSession || !newDateTime) {
      setRescheduleError('Please select a valid date and time.');
      return;
    }

    setRescheduleLoading(true);
    setRescheduleError('');
    
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/telehealth/schedule`,
        {
          appointmentId: selectedSession.id,
          scheduledAt: newDateTime.toISOString()
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      // Close modal and refresh sessions
      handleCloseRescheduleModal();
      fetchSessions();
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      setRescheduleError(error.response?.data?.message || 'Failed to reschedule appointment. Please try again later.');
    } finally {
      setRescheduleLoading(false);
    }
  };

  const canStartSession = (session) => {
    if (session.status !== 'Scheduled') return false;
    
    const now = new Date();
    const scheduledAt = new Date(session.scheduledAt);
    const fiveMinutesBefore = subMinutes(scheduledAt, 5);
    
    return isAfter(now, fiveMinutesBefore);
  };

  // Group sessions by date category
  const groupSessions = () => {
    const today = new Date();
    const tomorrow = addDays(today, 1);
    
    const groups = {
      today: [],
      tomorrow: [],
      upcoming: [],
      past: []
    };
    
    sessions.forEach(session => {
      const sessionDate = new Date(session.scheduledAt);
      
      if (isToday(sessionDate)) {
        groups.today.push(session);
      } else if (isTomorrow(sessionDate)) {
        groups.tomorrow.push(session);
      } else if (isAfter(sessionDate, tomorrow)) {
        groups.upcoming.push(session);
      } else {
        groups.past.push(session);
      }
    });
    
    // Sort sessions by time
    Object.keys(groups).forEach(key => {
      groups[key].sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt));
    });
    
    return groups;
  };

  const sessionGroups = groupSessions();
  
  // Determine which group to show based on tab value
  const getSessionsToShow = () => {
    switch (tabValue) {
      case 0:
        return sessionGroups.today;
      case 1:
        return sessionGroups.tomorrow;
      case 2:
        return sessionGroups.upcoming;
      case 3:
        return sessionGroups.past;
      default:
        return [];
    }
  };

  const formatSessionTime = (dateString) => {
    const date = new Date(dateString);
    return format(date, 'h:mm a');
  };

  const formatSessionDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, 'EEEE, MMMM d, yyyy');
  };

  return (
    <Box>
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab 
            label={`Today (${sessionGroups.today.length})`} 
            icon={<CalendarTodayIcon />} 
            iconPosition="start"
          />
          <Tab 
            label={`Tomorrow (${sessionGroups.tomorrow.length})`} 
            icon={<CalendarTodayIcon />} 
            iconPosition="start"
          />
          <Tab 
            label={`Upcoming (${sessionGroups.upcoming.length})`} 
            icon={<EventIcon />} 
            iconPosition="start"
          />
          <Tab 
            label={`Past (${sessionGroups.past.length})`} 
            icon={<EventIcon />} 
            iconPosition="start"
          />
        </Tabs>
      </Paper>

      {error && (
        <Box sx={{ mb: 3 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : getSessionsToShow().length === 0 ? (
        <Box sx={{ textAlign: 'center', p: 4 }}>
          <Typography variant="body1">
            No sessions found for this time period.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {getSessionsToShow().map((session) => (
            <Grid item xs={12} md={6} key={session.id}>
              <Card>
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <PersonIcon />
                    </Avatar>
                  }
                  title={session.patientName}
                  subheader={formatSessionTime(session.scheduledAt)}
                  action={
                    <Chip 
                      label={session.status} 
                      color={
                        session.status === 'Completed' ? 'default' :
                        session.status === 'Scheduled' ? 'primary' :
                        session.status === 'Cancelled' ? 'error' : 'warning'
                      }
                    />
                  }
                />
                <CardContent>
                  <List dense>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'background.paper' }}>
                          <EventIcon color="primary" fontSize="small" />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText 
                        primary="Scheduled For" 
                        secondary={formatSessionDate(session.scheduledAt)} 
                      />
                    </ListItem>
                    {session.reason && (
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'background.paper' }}>
                            <EventIcon color="primary" fontSize="small" />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText 
                          primary="Reason" 
                          secondary={session.reason} 
                        />
                      </ListItem>
                    )}
                  </List>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                  {session.status === 'Scheduled' && (
                    <>
                      <Button
                        variant="outlined"
                        startIcon={<EditIcon />}
                        onClick={() => handleOpenReschedule(session)}
                        size="small"
                      >
                        Reschedule
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<VideocamIcon />}
                        onClick={() => onStartSession(session.id)}
                        disabled={!canStartSession(session)}
                        size="small"
                        sx={{ ml: 1 }}
                      >
                        Start Session
                      </Button>
                    </>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Reschedule Modal */}
      <Dialog open={openRescheduleModal} onClose={handleCloseRescheduleModal} maxWidth="sm" fullWidth>
        <DialogTitle>Reschedule Appointment</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {rescheduleError && (
              <Typography color="error" sx={{ mb: 2 }}>
                {rescheduleError}
              </Typography>
            )}

            {selectedSession && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1">
                  Patient: {selectedSession.patientName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Currently scheduled for: {formatSessionDate(selectedSession.scheduledAt)} at {formatSessionTime(selectedSession.scheduledAt)}
                </Typography>
              </Box>
            )}

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="New Appointment Date & Time"
                value={newDateTime}
                onChange={(newValue) => setNewDateTime(newValue)}
                renderInput={(params) => <TextField {...params} fullWidth sx={{ mb: 3 }} />}
                minDateTime={new Date()}
              />
            </LocalizationProvider>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRescheduleModal}>Cancel</Button>
          <Button 
            onClick={handleReschedule} 
            variant="contained" 
            disabled={rescheduleLoading}
          >
            {rescheduleLoading ? 'Submitting...' : 'Reschedule'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TelehealthScheduleList;
