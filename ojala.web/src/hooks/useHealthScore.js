import { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * Custom hook for fetching health score data for a patient
 * @param {string} patientId - The ID of the patient
 * @returns {Object} Object containing health score data, loading state, and error state
 */
const useHealthScore = (patientId) => {
  const [healthScore, setHealthScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Don't fetch if no patient ID is provided
    if (!patientId) {
      setLoading(false);
      return;
    }

    const fetchHealthScore = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get(`/api/new/healthscore/${patientId}`);
        setHealthScore(response.data);
      } catch (err) {
        console.error('Error fetching health score:', err);
        setError(err.response?.data?.error || 'Failed to fetch health score');
      } finally {
        setLoading(false);
      }
    };

    fetchHealthScore();
  }, [patientId]);

  return { healthScore, loading, error };
};

export default useHealthScore;
