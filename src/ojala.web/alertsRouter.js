// Alerts Router for Nurse Assistant Service
const express = require('express');
const router = express.Router();
const axios = require('axios');
const redis = require('redis');
const { promisify } = require('util');
const { authenticateToken, checkRole } = require('../frontend/employer-dashboard/src/auth');
const { createLogger } = require('../../monitoring/logger');
const { AlertSeverity, classifySeverity, generateAlertMessage } = require('./alertSeverity');

// Initialize logger
const logger = createLogger('nurse-assistant-alerts', {
  enableConsole: true,
  enableFile: true,
  enableCloudWatch: process.env.NODE_ENV === 'production'
});

// Initialize Redis client
const redisClient = redis.createClient({
  url: `redis://${process.env.REDIS_CONNECTION || 'redis:6379'}`
});

redisClient.on('error', (err) => {
  logger.error('Redis Client Error', { error: err.message });
});

redisClient.on('connect', () => {
  logger.info('Connected to Redis');
});

// Promisify Redis commands
const redisPublish = promisify(redisClient.publish).bind(redisClient);

// API Gateway URL for escalation
const API_GATEWAY_URL = process.env.API_GATEWAY_URL || 'http://apigateway:80';
const ESCALATION_ENDPOINT = '/alerts/escalate';

/**
 * @swagger
 * /api/alerts:
 *   post:
 *     summary: Process telemetry alerts
 *     description: Processes telemetry alerts, classifies severity, and escalates emergency alerts
 *     tags: [Alerts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - patientId
 *               - deviceId
 *               - metric
 *               - value
 *               - timestamp
 *             properties:
 *               patientId:
 *                 type: string
 *                 description: Patient ID
 *               deviceId:
 *                 type: string
 *                 description: Device ID
 *               metric:
 *                 type: string
 *                 description: Metric name (e.g., heartRate, oxygenSaturation)
 *               value:
 *                 type: number
 *                 description: Metric value
 *               timestamp:
 *                 type: string
 *                 description: ISO timestamp of the reading
 *               additionalData:
 *                 type: object
 *                 description: Additional data for special cases
 *     responses:
 *       200:
 *         description: Alert processed successfully
 *       400:
 *         description: Invalid request parameters
 *       500:
 *         description: Server error
 */
router.post('/', async (req, res) => {
  try {
    const { patientId, deviceId, metric, value, timestamp, additionalData } = req.body;
    
    // Validate required fields
    if (!patientId || !deviceId || !metric || value === undefined || !timestamp) {
      return res.status(400).json({
        error: 'Missing required parameters',
        message: 'patientId, deviceId, metric, value, and timestamp are required'
      });
    }
    
    // Classify severity based on metric and value
    const severity = classifySeverity(metric, value, additionalData);
    
    if (!severity) {
      logger.info('Alert does not meet any severity threshold', { 
        patientId, deviceId, metric, value 
      });
      return res.status(200).json({ 
        status: 'processed',
        message: 'Alert does not meet any severity threshold'
      });
    }
    
    // Generate alert message
    const message = generateAlertMessage(severity, metric, value, patientId);
    
    // Create alert object
    const alert = {
      patientId,
      deviceId,
      metric,
      value,
      timestamp,
      severity,
      message
    };
    
    logger.info(`Processing ${severity} alert`, { alert });
    
    // For Emergency alerts, escalate to MD
    if (severity === AlertSeverity.EMERGENCY) {
      try {
        // Call the escalation endpoint
        const escalationResponse = await axios.post(`${API_GATEWAY_URL}${ESCALATION_ENDPOINT}`, alert);
        
        logger.info('Alert escalated successfully', { 
          patientId, 
          deviceId, 
          metric, 
          value,
          escalationId: escalationResponse.data.id
        });
        
        // Return success response with escalation info
        return res.status(200).json({
          status: 'escalated',
          severity,
          message,
          escalationId: escalationResponse.data.id
        });
      } catch (escalationError) {
        logger.error('Error escalating alert', {
          error: escalationError.message,
          patientId,
          deviceId,
          metric,
          value
        });
        
        // Still process the alert normally if escalation fails
        logger.info('Processing alert normally after escalation failure');
      }
    }
    
    // Process alert normally (for Info, Warning, or failed Emergency escalation)
    // In a real implementation, this would store the alert and notify appropriate staff
    
    // Return success response
    return res.status(200).json({
      status: 'processed',
      severity,
      message
    });
  } catch (error) {
    logger.error('Error processing alert', {
      error: error.message,
      stack: error.stack
    });
    
    return res.status(500).json({
      error: 'Failed to process alert',
      message: error.message
    });
  }
});

module.exports = router;
