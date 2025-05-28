import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Card, Icon, Checkbox } from '../common';
import { colors, typography } from '../../theme';

/**
 * MedicationRemindersCard Component
 * 
 * Displays a list of medication reminders for the patient with
 * timing information and completion status.
 * 
 * @param {Object} props
 * @param {Array} props.medications - Array of medication objects
 * @param {Function} props.onMedicationPress - Function to call when a medication is pressed
 * @param {Function} props.onMedicationToggle - Function to call when a medication is toggled
 * @param {Function} props.onViewAllPress - Function to call when "View All" is pressed
 */
const MedicationRemindersCard = ({ 
  medications = [], 
  onMedicationPress,
  onMedicationToggle,
  onViewAllPress
}) => {
  
  // Helper function to format time
  const formatTime = (timeString) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Helper function to determine if medication is due soon
  const isDueSoon = (timeString) => {
    const now = new Date();
    const dueTime = new Date(timeString);
    const diffMs = dueTime - now;
    const diffMins = Math.floor(diffMs / 60000);
    
    return diffMins > 0 && diffMins <= 60; // Due within the next hour
  };
  
  // Helper function to determine if medication is overdue
  const isOverdue = (timeString) => {
    const now = new Date();
    const dueTime = new Date(timeString);
    
    return now > dueTime;
  };
  
  // Render individual medication item
  const renderMedicationItem = ({ item }) => (
    <View style={styles.medicationItem}>
      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => onMedicationToggle(item.id, !item.taken)}
      >
        <Checkbox
          checked={item.taken}
          onChange={() => onMedicationToggle(item.id, !item.taken)}
        />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.medicationContent}
        onPress={() => onMedicationPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.medicationHeader}>
          <Text style={styles.medicationName} numberOfLines={1}>{item.name}</Text>
          
          {item.taken ? (
            <Text style={styles.takenText}>Taken</Text>
          ) : isOverdue(item.scheduledTime) ? (
            <Text style={styles.overdueText}>Overdue</Text>
          ) : isDueSoon(item.scheduledTime) ? (
            <Text style={styles.dueSoonText}>Due Soon</Text>
          ) : (
            <Text style={styles.scheduledText}>{formatTime(item.scheduledTime)}</Text>
          )}
        </View>
        
        <View style={styles.medicationDetails}>
          <Text style={styles.dosageText}>
            {item.dosage} • {item.instructions}
          </Text>
          
          {item.withFood && (
            <View style={styles.withFoodContainer}>
              <Icon name="utensils" size={12} color={colors.icon.food} />
              <Text style={styles.withFoodText}>Take with food</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.infoButton}
        onPress={() => onMedicationPress(item)}
      >
        <Icon name="info" size={16} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
  
  // Empty state when no medications
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="pill" size={48} color={colors.icon.medication} />
      <Text style={styles.emptyStateTitle}>No Medications</Text>
      <Text style={styles.emptyStateText}>
        You don't have any medication reminders scheduled for today.
      </Text>
    </View>
  );

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Medication Reminders</Text>
        <TouchableOpacity onPress={onViewAllPress}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={medications.slice(0, 3)} // Show only the 3 most recent medications
        renderItem={renderMedicationItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContent}
        scrollEnabled={false} // Disable scrolling within the card
      />
      
      {medications.length > 3 && (
        <TouchableOpacity 
          style={styles.footer}
          onPress={onViewAllPress}
        >
          <Text style={styles.footerText}>
            View all medications ({medications.length})
          </Text>
          <Icon name="arrow-right" size={16} color={colors.primary} />
        </TouchableOpacity>
      )}
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
  viewAllText: {
    ...typography.button,
    color: colors.primary,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  medicationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  checkboxContainer: {
    marginRight: 12,
  },
  medicationContent: {
    flex: 1,
    marginRight: 8,
  },
  medicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  medicationName: {
    ...typography.subtitle,
    color: colors.text.primary,
    flex: 1,
  },
  takenText: {
    ...typography.caption,
    color: colors.success,
    fontWeight: 'bold',
  },
  overdueText: {
    ...typography.caption,
    color: colors.danger,
    fontWeight: 'bold',
  },
  dueSoonText: {
    ...typography.caption,
    color: colors.warning,
    fontWeight: 'bold',
  },
  scheduledText: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  medicationDetails: {
    flexDirection: 'column',
  },
  dosageText: {
    ...typography.body,
    color: colors.text.secondary,
  },
  withFoodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  withFoodText: {
    ...typography.caption,
    color: colors.text.secondary,
    marginLeft: 4,
  },
  infoButton: {
    padding: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
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
    ...typography.button,
    color: colors.primary,
    marginRight: 8,
  },
});

export default MedicationRemindersCard;
