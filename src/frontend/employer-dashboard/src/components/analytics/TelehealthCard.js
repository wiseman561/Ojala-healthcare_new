import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Icon } from '../common';
import { colors, typography } from '../../theme';

/**
 * TelehealthCard Component
 * 
 * Displays upcoming telehealth appointments and provides
 * quick access to schedule new appointments.
 * 
 * @param {Object} props
 * @param {Object} props.nextAppointment - Next scheduled appointment
 * @param {Function} props.onSchedulePress - Function to call when "Schedule" is pressed
 * @param {Function} props.onAppointmentPress - Function to call when appointment is pressed
 */
const TelehealthCard = ({ 
  nextAppointment = null, 
  onSchedulePress,
  onAppointmentPress
}) => {
  
  // Helper function to format date and time
  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    let dayText;
    if (date.toDateString() === today.toDateString()) {
      dayText = 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      dayText = 'Tomorrow';
    } else {
      dayText = date.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
    }
    
    const timeText = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    return `${dayText} at ${timeText}`;
  };
  
  // Helper function to calculate time until appointment
  const getTimeUntil = (dateTimeString) => {
    const now = new Date();
    const appointmentTime = new Date(dateTimeString);
    const diffMs = appointmentTime - now;
    
    if (diffMs < 0) return 'Ongoing';
    
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 60) {
      return `In ${diffMins} minute${diffMins !== 1 ? 's' : ''}`;
    } else if (diffHours < 24) {
      return `In ${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
    } else {
      return `In ${diffDays} day${diffDays !== 1 ? 's' : ''}`;
    }
  };
  
  // Render appointment details
  const renderAppointmentDetails = () => (
    <TouchableOpacity 
      style={styles.appointmentContainer}
      onPress={() => onAppointmentPress(nextAppointment)}
      activeOpacity={0.7}
    >
      <View style={styles.appointmentHeader}>
        <View style={styles.appointmentType}>
          <Icon name="video" size={16} color={colors.icon.telehealth} />
          <Text style={styles.appointmentTypeText}>Telehealth</Text>
        </View>
        
        <View style={[
          styles.statusBadge,
          { backgroundColor: getStatusColor(nextAppointment.status) }
        ]}>
          <Text style={styles.statusText}>{formatStatus(nextAppointment.status)}</Text>
        </View>
      </View>
      
      <Text style={styles.providerName}>{nextAppointment.providerName}</Text>
      <Text style={styles.appointmentTime}>
        {formatDateTime(nextAppointment.scheduledTime)}
      </Text>
      
      <View style={styles.timeUntilContainer}>
        <Icon name="clock" size={14} color={colors.primary} />
        <Text style={styles.timeUntilText}>
          {getTimeUntil(nextAppointment.scheduledTime)}
        </Text>
      </View>
      
      {isStartable(nextAppointment) && (
        <TouchableOpacity 
          style={styles.startButton}
          onPress={() => onAppointmentPress(nextAppointment)}
        >
          <Icon name="video" size={16} color={colors.white} />
          <Text style={styles.startButtonText}>Join Now</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
  
  // Helper function to determine if appointment can be started
  const isStartable = (appointment) => {
    if (!appointment) return false;
    
    const now = new Date();
    const appointmentTime = new Date(appointment.scheduledTime);
    const diffMs = appointmentTime - now;
    const diffMins = Math.floor(diffMs / 60000);
    
    // Can join 5 minutes before scheduled time
    return diffMins <= 5 && appointment.status === 'confirmed';
  };
  
  // Helper function to get status color
  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed':
        return colors.status.confirmed;
      case 'pending':
        return colors.status.pending;
      case 'cancelled':
        return colors.status.cancelled;
      case 'completed':
        return colors.status.completed;
      default:
        return colors.status.default;
    }
  };
  
  // Helper function to format status text
  const formatStatus = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };
  
  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="calendar" size={48} color={colors.icon.calendar} />
      <Text style={styles.emptyStateTitle}>No Upcoming Appointments</Text>
      <Text style={styles.emptyStateText}>
        Schedule a telehealth appointment with your care team.
      </Text>
      
      <TouchableOpacity 
        style={styles.scheduleButton}
        onPress={onSchedulePress}
      >
        <Icon name="plus" size={16} color={colors.white} />
        <Text style={styles.scheduleButtonText}>Schedule Appointment</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Telehealth</Text>
        <TouchableOpacity onPress={onSchedulePress}>
          <Text style={styles.scheduleText}>Schedule</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        {nextAppointment ? renderAppointmentDetails() : renderEmptyState()}
      </View>
      
      <View style={styles.footer}>
        <Icon name="shield" size={14} color={colors.text.secondary} />
        <Text style={styles.footerText}>
          Secure, HIPAA-compliant video consultations
        </Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    ...typography.h3,
    color: colors.text.primary,
  },
  scheduleText: {
    ...typography.button,
    color: colors.primary,
  },
  content: {
    padding: 16,
  },
  appointmentContainer: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 16,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  appointmentType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appointmentTypeText: {
    ...typography.caption,
    color: colors.text.secondary,
    marginLeft: 6,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    ...typography.tiny,
    fontWeight: 'bold',
    color: colors.white,
  },
  providerName: {
    ...typography.subtitle,
    color: colors.text.primary,
    marginBottom: 4,
  },
  appointmentTime: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  timeUntilContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeUntilText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 10,
    marginTop: 16,
  },
  startButtonText: {
    ...typography.button,
    color: colors.white,
    marginLeft: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  emptyStateTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  scheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  scheduleButtonText: {
    ...typography.button,
    color: colors.white,
    marginLeft: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: colors.background.secondary,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  footerText: {
    ...typography.caption,
    color: colors.text.secondary,
    marginLeft: 6,
  },
});

export default TelehealthCard;
