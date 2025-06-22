import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getSettings, saveSettings } from '../utils/settingsStorage';

export function useMaintenanceMode() {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkMaintenanceMode = async () => {
      try {
        const settings = getSettings('PLATFORM');
        const maintenanceMode = settings?.maintenanceMode || false;
        setIsMaintenanceMode(maintenanceMode);

        // If maintenance mode is active and user is not admin, redirect to maintenance page
        if (maintenanceMode && user?.role !== 'admin') {
          navigate('/maintenance');
        }
      } catch (error) {
        console.error('Error checking maintenance mode:', error);
      }
    };

    checkMaintenanceMode();
  }, [user, navigate]);

  const toggleMaintenanceMode = async (enabled) => {
    try {
      const currentSettings = getSettings('PLATFORM');
      const updatedSettings = {
        ...currentSettings,
        maintenanceMode: enabled
      };

      const success = saveSettings('PLATFORM', updatedSettings);
      if (success) {
        setIsMaintenanceMode(enabled);

        // If enabling maintenance mode and user is not admin, redirect to maintenance page
        if (enabled && user?.role !== 'admin') {
          navigate('/maintenance');
        }
      } else {
        throw new Error('Failed to save maintenance mode settings');
      }
    } catch (error) {
      console.error('Error toggling maintenance mode:', error);
      throw error;
    }
  };

  return {
    isMaintenanceMode,
    toggleMaintenanceMode,
    canAccess: user?.role === 'admin' || !isMaintenanceMode
  };
}
