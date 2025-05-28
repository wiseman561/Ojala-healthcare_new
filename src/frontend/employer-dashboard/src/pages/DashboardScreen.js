import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl, SafeAreaView } from 'react-native';
import { Header, StatusBar } from '../../components/common';
import HealthScoreCard from '../../components/health-score/HealthScoreCard';
import VitalsSummaryCard from '../../components/vitals/VitalsSummaryCard';
import AlertHistoryCard from '../../components/alerts/AlertHistoryCard';
import MedicationRemindersCard from '../../components/medications/MedicationRemindersCard';
import SecureChatCard from '../../components/messaging/SecureChatCard';
import TelehealthCard from '../../components/telehealth/TelehealthCard';
import { colors } from '../../theme';

/**
 * DashboardScreen Component
 * 
 * Main dashboard screen for the patient app that displays all key
 * health information and access to primary features.
 */
const DashboardScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [healthData, setHealthData] = useState({
    healthScore: {
      score: 85,
      riskLevel: 'low',
      trend: 3,
      explanation: 'Your health score is excellent. Your consistent sleep schedule and regular physical activity are contributing positively to your overall health.'
    },
    vitals: {
      heartRate: { current: 72, unit: 'bpm', trend: -2, isNormal: true },
      sleep: { current: 7.5, unit: 'hours', trend: 5, isNormal: true },
      glucose: { current: 105, unit: 'mg/dL', trend: 0, isNormal: true },
      bloodPressure: { 
        systolic: 120, 
        diastolic: 80, 
        unit: 'mmHg', 
        trend: -3, 
        isNormal: true 
      }
    },
    alerts: [
      {
        id: 'alert1',
        title: 'Elevated Heart Rate',
        description: 'Your heart rate was above your normal range during your workout yesterday.',
        severity: 'info',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        status: 'new',
        actionRequired: false
      },
      {
        id: 'alert2',
        title: 'Medication Reminder',
        description: 'You missed your evening dose of Lisinopril yesterday.',
        severity: 'warning',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        status: 'in_progress',
        actionRequired: true
      }
    ],
    medications: [
      {
        id: 'med1',
        name: 'Lisinopril',
        dosage: '10mg',
        instructions: 'Once daily',
        scheduledTime: new Date(Date.now() + 3600000).toISOString(),
        taken: false,
        withFood: true
      },
      {
        id: 'med2',
        name: 'Metformin',
        dosage: '500mg',
        instructions: 'Twice daily',
        scheduledTime: new Date(Date.now() - 1800000).toISOString(),
        taken: false,
        withFood: true
      },
      {
        id: 'med3',
        name: 'Vitamin D',
        dosage: '2000 IU',
        instructions: 'Once daily',
        scheduledTime: new Date(Date.now() - 3600000).toISOString(),
        taken: true,
        withFood: false
      }
    ],
    messages: [
      {
        id: 'msg1',
        content: 'Hi John, I noticed your blood pressure readings have been consistent this week. Great job keeping up with your medication!',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        isFromPatient: false
      },
      {
        id: 'msg2',
        content: 'Thank you! I've been taking my medication regularly and also started walking every evening.',
        timestamp: new Date(Date.now() - 82800000).toISOString(),
        isFromPatient: true
      }
    ],
    nurse: {
      id: 'nurse1',
      name: 'Sarah Johnson, RN',
      avatar: '',
      title: 'Primary Care Nurse',
      isOnline: true
    },
    nextAppointment: {
      id: 'appt1',
      providerName: 'Dr. Michael Chen',
      scheduledTime: new Date(Date.now() + 172800000).toISOString(),
      status: 'confirmed',
      type: 'telehealth'
    }
  });

  // Simulate data refresh
  const onRefresh = () => {
    setRefreshing(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Update with "new" data (in a real app, this would fetch from API)
      setHealthData({
        ...healthData,
        healthScore: {
          ...healthData.healthScore,
          score: Math.min(100, healthData.healthScore.score + 1),
          trend: healthData.healthScore.trend + 1
        }
      });
      setRefreshing(false);
    }, 1500);
  };

  // Navigation handlers
  const handleHealthScorePress = () => {
    navigation.navigate('HealthScoreDetails');
  };

  const handleVitalPress = (vitalType) => {
    navigation.navigate('VitalDetails', { vitalType });
  };

  const handleAlertPress = (alert) => {
    navigation.navigate('AlertDetails', { alertId: alert.id });
  };

  const handleViewAllAlerts = () => {
    navigation.navigate('Alerts');
  };

  const handleMedicationPress = (medication) => {
    navigation.navigate('MedicationDetails', { medicationId: medication.id });
  };

  const handleMedicationToggle = (medicationId, taken) => {
    // Update local state (in a real app, this would also update the API)
    setHealthData({
      ...healthData,
      medications: healthData.medications.map(med => 
        med.id === medicationId ? { ...med, taken } : med
      )
    });
  };

  const handleViewAllMedications = () => {
    navigation.navigate('Medications');
  };

  const handleSendMessage = (message) => {
    // Add message to local state (in a real app, this would also send to API)
    const newMessage = {
      id: `msg${healthData.messages.length + 1}`,
      content: message,
      timestamp: new Date().toISOString(),
      isFromPatient: true
    };
    
    setHealthData({
      ...healthData,
      messages: [...healthData.messages, newMessage]
    });
  };

  const handleViewAllMessages = () => {
    navigation.navigate('Messages');
  };

  const handleScheduleAppointment = () => {
    navigation.navigate('ScheduleAppointment');
  };

  const handleAppointmentPress = (appointment) => {
    navigation.navigate('AppointmentDetails', { appointmentId: appointment.id });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar />
      <Header title="Dashboard" />
      
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <HealthScoreCard
          score={healthData.healthScore.score}
          riskLevel={healthData.healthScore.riskLevel}
          trend={healthData.healthScore.trend}
          explanation={healthData.healthScore.explanation}
          onPress={handleHealthScorePress}
        />
        
        <VitalsSummaryCard
          vitals={healthData.vitals}
          onVitalPress={handleVitalPress}
        />
        
        <AlertHistoryCard
          alerts={healthData.alerts}
          onAlertPress={handleAlertPress}
          onViewAllPress={handleViewAllAlerts}
        />
        
        <MedicationRemindersCard
          medications={healthData.medications}
          onMedicationPress={handleMedicationPress}
          onMedicationToggle={handleMedicationToggle}
          onViewAllPress={handleViewAllMedications}
        />
        
        <SecureChatCard
          messages={healthData.messages}
          nurse={healthData.nurse}
          onSendMessage={handleSendMessage}
          onViewAllPress={handleViewAllMessages}
        />
        
        <TelehealthCard
          nextAppointment={healthData.nextAppointment}
          onSchedulePress={handleScheduleAppointment}
          onAppointmentPress={handleAppointmentPress}
        />
        
        {/* Additional cards can be added here */}
      </ScrollView>
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
  content: {
    paddingVertical: 16,
    paddingBottom: 32, // Extra padding at bottom for better scrolling
  },
});

export default DashboardScreen;
