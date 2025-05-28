import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PatientCard from '../components/PatientCard';
import AlertCard from '../components/AlertCard';
import HealthScoreCard from '../components/HealthScoreCard';
import QuickNotesBox from '../components/QuickNotesBox';
import ConditionFilterBar from '../components/ConditionFilterBar';

// Types for our dashboard data
interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  healthScore: number;
  riskLevel: string;
  conditions: string[];
  lastContact: string;
}

interface Alert {
  id: string;
  patientId: string;
  patientName: string;
  alertType: 'critical' | 'warning' | 'info';
  message: string;
  timestamp: string;
  isRead: boolean;
}

interface HealthScore {
  patientId: string;
  score: number;
  trend: 'up' | 'down' | 'stable';
  factors: string[];
}

interface DashboardData {
  patients: Patient[];
  alerts: Alert[];
  healthScores: HealthScore[];
}

const RNDashboardSample: React.FC = () => {
  // State for dashboard data
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [quickNote, setQuickNote] = useState<string>('');

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await axios.get<DashboardData>('/api/rn/dashboard');
        setDashboardData(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Handle condition filter changes
  const handleConditionFilterChange = (conditions: string[]) => {
    setSelectedConditions(conditions);
  };

  // Handle quick note submission
  const handleQuickNoteSubmit = async (note: string) => {
    try {
      await axios.post('/api/rn/notes', { content: note });
      setQuickNote('');
      // Optionally refresh data or show success message
    } catch (err) {
      console.error('Error saving note:', err);
      // Show error message
    }
  };

  // Filter patients based on selected conditions
  const filteredPatients = dashboardData?.patients.filter(patient => 
    selectedConditions.length === 0 || 
    patient.conditions.some(condition => selectedConditions.includes(condition))
  );

  // Get all unique conditions for the filter bar
  const allConditions = dashboardData?.patients.reduce((conditions, patient) => {
    patient.conditions.forEach(condition => {
      if (!conditions.includes(condition)) {
        conditions.push(condition);
      }
    });
    return conditions;
  }, [] as string[]) || [];

  // Render loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  // Render dashboard
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">RN Dashboard</h1>
      
      {/* Condition Filter Bar */}
      <div className="mb-6">
        <ConditionFilterBar 
          conditions={allConditions}
          selectedConditions={selectedConditions}
          onChange={handleConditionFilterChange}
        />
      </div>
      
      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-700">Patient Alerts</h2>
          
          {/* Alerts Section */}
          <div className="space-y-4">
            {dashboardData?.alerts.map(alert => (
              <AlertCard 
                key={alert.id}
                alert={alert}
                onMarkAsRead={() => {/* Handle mark as read */}}
              />
            ))}
            
            {dashboardData?.alerts.length === 0 && (
              <p className="text-gray-500 italic">No alerts at this time.</p>
            )}
          </div>
          
          {/* Quick Notes Box */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Quick Notes</h2>
            <QuickNotesBox 
              value={quickNote}
              onChange={setQuickNote}
              onSubmit={handleQuickNoteSubmit}
            />
          </div>
        </div>
        
        {/* Right Column */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-700">Patients</h2>
          
          {/* Patients Section */}
          <div className="space-y-4">
            {filteredPatients?.map(patient => (
              <div key={patient.id} className="space-y-2">
                <PatientCard 
                  patient={patient}
                  onClick={() => {/* Handle patient click */}}
                />
                
                <HealthScoreCard 
                  healthScore={dashboardData?.healthScores.find(hs => hs.patientId === patient.id)}
                />
              </div>
            ))}
            
            {filteredPatients?.length === 0 && (
              <p className="text-gray-500 italic">No patients match the selected filters.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RNDashboardSample;
