/**
 * Alert Severity Classification Module
 * 
 * This module defines the AlertSeverity enum and threshold rules for classifying
 * telemetry data into different severity levels based on specified thresholds.
 */

// AlertSeverity enum
const AlertSeverity = {
  INFO: 'Info',
  WARNING: 'Warning',
  EMERGENCY: 'Emergency'
};

// Threshold rules for different metrics
const thresholdRules = {
  heartRate: {
    info: { min: 100, max: 110 },
    warning: { min: 110, max: 120 },
    emergency: { min: 120, max: Infinity }
  },
  oxygenSaturation: {
    info: { min: 90, max: 94 },
    warning: { min: 85, max: 90 },
    emergency: { min: 0, max: 85 }
  },
  bloodPressureSystolic: {
    info: { min: 130, max: 139 },
    warning: { min: 140, max: 159 },
    emergency: { min: 160, max: Infinity }
  },
  bloodPressureDiastolic: {
    info: { min: 80, max: 89 },
    warning: { min: 90, max: 99 },
    emergency: { min: 100, max: Infinity }
  }
};

/**
 * Classify a telemetry reading into a severity level
 * @param {string} metric - The metric name (e.g., 'heartRate', 'oxygenSaturation')
 * @param {number} value - The metric value
 * @param {Object} additionalData - Additional data for special cases (e.g., arrhythmia, panic events)
 * @returns {string} - The severity level (Info, Warning, Emergency)
 */
function classifySeverity(metric, value, additionalData = {}) {
  // Check for special cases that are always emergency
  if (additionalData.arrhythmia || additionalData.panicEvent) {
    return AlertSeverity.EMERGENCY;
  }

  // Get the threshold rule for the metric
  const rule = thresholdRules[metric];
  if (!rule) {
    return null; // No rule for this metric
  }

  // Check emergency threshold
  if (rule.emergency && (value >= rule.emergency.min && value < rule.emergency.max)) {
    return AlertSeverity.EMERGENCY;
  }

  // Check warning threshold
  if (rule.warning && (value >= rule.warning.min && value < rule.warning.max)) {
    return AlertSeverity.WARNING;
  }

  // Check info threshold
  if (rule.info && (value >= rule.info.min && value < rule.info.max)) {
    return AlertSeverity.INFO;
  }

  // If no thresholds are matched, return null
  return null;
}

/**
 * Generate a descriptive message for an alert based on severity and metric data
 * @param {string} severity - The severity level (Info, Warning, Emergency)
 * @param {string} metric - The metric name
 * @param {number} value - The metric value
 * @param {string} patientId - The patient ID
 * @returns {string} - A descriptive message
 */
function generateAlertMessage(severity, metric, value, patientId) {
  const metricDisplay = {
    heartRate: 'Heart Rate',
    oxygenSaturation: 'Oxygen Saturation',
    bloodPressureSystolic: 'Blood Pressure (Systolic)',
    bloodPressureDiastolic: 'Blood Pressure (Diastolic)'
  };

  const units = {
    heartRate: 'bpm',
    oxygenSaturation: '%',
    bloodPressureSystolic: 'mmHg',
    bloodPressureDiastolic: 'mmHg'
  };

  const severityPrefix = {
    [AlertSeverity.INFO]: 'ATTENTION',
    [AlertSeverity.WARNING]: 'WARNING',
    [AlertSeverity.EMERGENCY]: 'EMERGENCY'
  };

  return `${severityPrefix[severity]}: Patient ${patientId} has ${metricDisplay[metric] || metric} of ${value} ${units[metric] || ''} requiring ${severity.toLowerCase()} attention`;
}

module.exports = {
  AlertSeverity,
  thresholdRules,
  classifySeverity,
  generateAlertMessage
};
