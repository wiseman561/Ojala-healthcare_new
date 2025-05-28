import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Card, Icon, Badge } from '../common';
import { colors, typography } from '../../theme';

/**
 * AlertHistoryCard Component
 * 
 * Displays a list of recent health alerts for the patient with
 * severity indicators and action status.
 * 
 * @param {Object} props
 * @param {Array} props.alerts - Array of alert objects
 * @param {Function} props.onAlertPress - Function to call when an alert is pressed
 * @param {Function} props.onViewAllPress - Function to call when "View All" is pressed
 */
const AlertHistoryCard = ({ 
  alerts = [], 
  onAlertPress,
  onViewAllPress
}) => {
  
  // Helper function to get severity color
  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'critical':
        return colors.severity.critical;
      case 'urgent':
        return colors.severity.urgent;
      case 'warning':
        return colors.severity.warning;
      case 'info':
      default:
        return colors.severity.info;
    }
  };
  
  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };
  
  // Render individual alert item
  const renderAlertItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.alertItem}
      onPress={() => onAlertPress(item)}
      activeOpacity={0.7}
    >
      <View style={[styles.severityIndicator, { backgroundColor: getSeverityColor(item.severity) }]} />
      
      <View style={styles.alertContent}>
        <View style={styles.alertHeader}>
          <Text style={styles.alertTitle} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.alertTime}>{formatDate(item.timestamp)}</Text>
        </View>
        
        <Text style={styles.alertDescription} numberOfLines={2}>
          {item.description}
        </Text>
        
        <View style={styles.alertFooter}>
          {item.status === 'new' && (
            <Badge 
              text="New" 
              backgroundColor={colors.badge.new}
              textColor={colors.white}
            />
          )}
          
          {item.status === 'in_progress' && (
            <Badge 
              text="In Progress" 
              backgroundColor={colors.badge.inProgress}
              textColor={colors.white}
            />
          )}
          
          {item.status === 'resolved' && (
            <Badge 
              text="Resolved" 
              backgroundColor={colors.badge.resolved}
              textColor={colors.white}
            />
          )}
          
          {item.actionRequired && (
            <Badge 
              text="Action Required" 
              backgroundColor={colors.badge.actionRequired}
              textColor={colors.white}
              icon="alert-circle"
            />
          )}
        </View>
      </View>
      
      <Icon name="chevron-right" size={16} color={colors.text.secondary} />
    </TouchableOpacity>
  );
  
  // Empty state when no alerts
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="check-circle" size={48} color={colors.success} />
      <Text style={styles.emptyStateTitle}>All Clear</Text>
      <Text style={styles.emptyStateText}>
        You don't have any recent alerts. Keep up the good work!
      </Text>
    </View>
  );

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Alert History</Text>
        <TouchableOpacity onPress={onViewAllPress}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={alerts.slice(0, 5)} // Show only the 5 most recent alerts
        renderItem={renderAlertItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContent}
        scrollEnabled={false} // Disable scrolling within the card
      />
      
      {alerts.length > 0 && (
        <TouchableOpacity 
          style={styles.footer}
          onPress={onViewAllPress}
        >
          <Text style={styles.footerText}>View all alerts</Text>
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
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  severityIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
    marginRight: 8,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  alertTitle: {
    ...typography.subtitle,
    color: colors.text.primary,
    flex: 1,
  },
  alertTime: {
    ...typography.caption,
    color: colors.text.secondary,
    marginLeft: 8,
  },
  alertDescription: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  alertFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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

export default AlertHistoryCard;
