import React from 'react';
import useHealthScore from '../hooks/useHealthScore';

/**
 * Component for displaying a patient's risk score
 * @param {Object} props - Component props
 * @param {string} props.patientId - The ID of the patient
 * @param {string} props.className - Additional CSS classes
 */
const RiskScoreCard = ({ patientId, className = '' }) => {
  const { healthScore, loading, error } = useHealthScore(patientId);

  // Helper function to determine risk level color
  const getRiskColor = (score) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    if (score >= 40) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  // Helper function to determine risk level text
  const getRiskLevel = (score) => {
    if (score >= 80) return 'Low';
    if (score >= 60) return 'Moderate';
    if (score >= 40) return 'High';
    return 'Critical';
  };

  // Helper function to get trend icon
  const getTrendIcon = (trend) => {
    if (trend === 'up') {
      return (
        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      );
    }
    if (trend === 'down') {
      return (
        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      );
    }
    return (
      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
      </svg>
    );
  };

  // Render loading state
  if (loading) {
    return (
      <div className={`rounded-lg shadow-md p-4 bg-white ${className}`}>
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className={`rounded-lg shadow-md p-4 bg-red-50 ${className}`}>
        <h3 className="text-lg font-semibold text-red-800">Risk Score Unavailable</h3>
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  // Render when no data is available
  if (!healthScore) {
    return (
      <div className={`rounded-lg shadow-md p-4 bg-gray-50 ${className}`}>
        <h3 className="text-lg font-semibold text-gray-800">Risk Score</h3>
        <p className="text-sm text-gray-600">No data available</p>
      </div>
    );
  }

  // Render the risk score card
  return (
    <div className={`rounded-lg shadow-md p-4 bg-white ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-gray-800">Risk Score</h3>
        <span className="text-sm text-gray-500">
          {new Date(healthScore.scoreDate).toLocaleDateString()}
        </span>
      </div>
      
      <div className="flex items-center mb-4">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mr-4 text-2xl font-bold border-4 border-gray-200">
          {Math.round(healthScore.score)}
        </div>
        <div>
          <div className="flex items-center">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(healthScore.score)}`}>
              {getRiskLevel(healthScore.score)} Risk
            </span>
            <span className="ml-2 flex items-center text-sm text-gray-600">
              {getTrendIcon(healthScore.trend)}
              <span className="ml-1">{healthScore.trend === 'up' ? 'Improving' : healthScore.trend === 'down' ? 'Declining' : 'Stable'}</span>
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {healthScore.factors && healthScore.factors.length > 0 
              ? healthScore.factors[0] 
              : 'No contributing factors available'}
          </p>
        </div>
      </div>
      
      {healthScore.recommendedActions && healthScore.recommendedActions.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Recommended Actions</h4>
          <ul className="text-sm text-gray-600 space-y-1 pl-5 list-disc">
            {healthScore.recommendedActions.slice(0, 2).map((action, index) => (
              <li key={index}>{action}</li>
            ))}
            {healthScore.recommendedActions.length > 2 && (
              <li className="text-blue-600 cursor-pointer">
                +{healthScore.recommendedActions.length - 2} more actions
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RiskScoreCard;
