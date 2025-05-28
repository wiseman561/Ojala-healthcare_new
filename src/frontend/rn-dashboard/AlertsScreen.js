import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { Header, StatusBar, SearchBar, FilterChip } from '../../components/common';
import { colors, typography } from '../../theme';

/**
 * AlertsScreen Component
 * 
 * Displays a comprehensive list of all health alerts with
 * filtering and search capabilities.
 */
const AlertsScreen = ({ navigation }) => {
  // Mock alerts data (in a real app, this would come from API/Redux)
  const [alerts, setAlerts] = useState([
    {
      id: 'alert1',
      title: 'Elevated Heart Rate',
      description: 'Your heart rate was above your normal range during your workout yesterday.',
      severity: 'info',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      status: 'new',
      actionRequired: false,
      vitalType: 'heart_rate'
    },
    {
      id: 'alert2',
      title: 'Medication Reminder',
      description: 'You missed your evening dose of Lisinopril yesterday.',
      severity: 'warning',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      status: 'in_progress',
      actionRequired: true,
      vitalType: 'medication'
    },
    {
      id: 'alert3',
      title: 'Low Blood Glucose',
      description: 'Your blood glucose reading was below your target range this morning.',
      severity: 'urgent',
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      status: 'resolved',
      actionRequired: false,
      vitalType: 'glucose'
    },
    {
      id: 'alert4',
      title: 'Sleep Pattern Change',
      description: 'Your sleep duration has decreased by more than 1 hour over the past week.',
      severity: 'warning',
      timestamp: new Date(Date.now() - 259200000).toISOString(),
      status: 'resolved',
      actionRequired: false,
      vitalType: 'sleep'
    },
    {
      id: 'alert5',
      title: 'High Blood Pressure',
      description: 'Your blood pressure readings have been consistently elevated for the past 3 days.',
      severity: 'critical',
      timestamp: new Date(Date.now() - 345600000).toISOString(),
      status: 'resolved',
      actionRequired: false,
      vitalType: 'blood_pressure'
    }
  ]);
  
  // State for search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedVitalType, setSelectedVitalType] = useState(null);
  
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
  
  // Filter alerts based on search and filters
  const filteredAlerts = alerts.filter(alert => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!alert.title.toLowerCase().includes(query) && 
          !alert.description.toLowerCase().includes(query)) {
        return false;
      }
    }
    
    // Severity filter
    if (selectedSeverity && alert.severity !== selectedSeverity) {
      return false;
    }
    
    // Status filter
    if (selectedStatus && alert.status !== selectedStatus) {
      return false;
    }
    
    // Vital type filter
    if (selectedVitalType && alert.vitalType !== selectedVitalType) {
      return false;
    }
    
    return true;
  });
  
  // Handle alert press
  const handleAlertPress = (alert) => {
    navigation.navigate('AlertDetails', { alertId: alert.id });
  };
  
  // Render individual alert item
  const renderAlertItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.alertItem}
      onPress={() => handleAlertPress(item)}
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
            <View style={[styles.badge, { backgroundColor: colors.badge.new }]}>
              <Text style={styles.badgeText}>New</Text>
            </View>
          )}
          
          {item.status === 'in_progress' && (
            <View style={[styles.badge, { backgroundColor: colors.badge.inProgress }]}>
              <Text style={styles.badgeText}>In Progress</Text>
            </View>
          )}
          
          {item.status === 'resolved' && (
            <View style={[styles.badge, { backgroundColor: colors.badge.resolved }]}>
              <Text style={styles.badgeText}>Resolved</Text>
            </View>
          )}
          
          {item.actionRequired && (
            <View style={[styles.badge, { backgroundColor: colors.badge.actionRequired }]}>
              <Text style={styles.badgeText}>Action Required</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
  
  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="alert-circle" size={48} color={colors.text.disabled} />
      <Text style={styles.emptyStateTitle}>No Alerts Found</Text>
      <Text style={styles.emptyStateText}>
        No alerts match your current filters. Try adjusting your search or filters.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar />
      <Header title="Alerts" showBackButton onBackPress={() => navigation.goBack()} />
      
      <View style={styles.container}>
        <SearchBar
          placeholder="Search alerts..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={() => setSearchQuery('')}
        />
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
          <FilterChip
            label="All Severities"
            selected={selectedSeverity === null}
            onPress={() => setSelectedSeverity(null)}
          />
          <FilterChip
            label="Critical"
            selected={selectedSeverity === 'critical'}
            onPress={() => setSelectedSeverity('critical')}
            color={colors.severity.critical}
          />
          <FilterChip
            label="Urgent"
            selected={selectedSeverity === 'urgent'}
            onPress={() => setSelectedSeverity('urgent')}
            color={colors.severity.urgent}
          />
          <FilterChip
            label="Warning"
            selected={selectedSeverity === 'warning'}
            onPress={() => setSelectedSeverity('warning')}
            color={colors.severity.warning}
          />
          <FilterChip
            label="Info"
            selected={selectedSeverity === 'info'}
            onPress={() => setSelectedSeverity('info')}
            color={colors.severity.info}
          />
        </ScrollView>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
          <FilterChip
            label="All Statuses"
            selected={selectedStatus === null}
            onPress={() => setSelectedStatus(null)}
          />
          <FilterChip
            label="New"
            selected={selectedStatus === 'new'}
            onPress={() => setSelectedStatus('new')}
          />
          <FilterChip
            label="In Progress"
            selected={selectedStatus === 'in_progress'}
            onPress={() => setSelectedStatus('in_progress')}
          />
          <FilterChip
            label="Resolved"
            selected={selectedStatus === 'resolved'}
            onPress={() => setSelectedStatus('resolved')}
          />
        </ScrollView>
        
        <FlatList
          data={filteredAlerts}
          renderItem={renderAlertItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmptyState}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  container: {
    flex: 1,
  },
  filtersContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  listContent: {
    padding: 16,
    paddingBottom: 32, // Extra padding at bottom for better scrolling
  },
  alertItem: {
    flexDirection: 'row',
    backgroundColor: colors.background.card,
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  severityIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  alertContent: {
    flex: 1,
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
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  badgeText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
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
});

export default AlertsScreen;
