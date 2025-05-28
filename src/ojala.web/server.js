// Alerts Streamer Service - Main Server
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const redis = require('redis');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const winston = require('winston');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'alerts-streamer' },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Configuration
const PORT = process.env.PORT || 80;
const JWT_SECRET = process.env.JWT_SECRET || 'ojala-jwt-secret';
const REDIS_CONNECTION = process.env.REDIS_CONNECTION || 'redis:6379';

// Initialize Redis client
const redisClient = redis.createClient({
  url: `redis://${REDIS_CONNECTION}`
});

redisClient.on('error', (err) => {
  logger.error('Redis Client Error', { error: err.message });
});

// Connect to Redis
(async () => {
  await redisClient.connect();
  logger.info('Connected to Redis');
  
  // Subscribe to emergency alerts channel
  const subscriber = redisClient.duplicate();
  await subscriber.connect();
  
  await subscriber.subscribe('emergency-alerts', (message) => {
    try {
      const alert = JSON.parse(message);
      logger.info('Received emergency alert', { alertId: alert.id });
      
      // Broadcast to all connected clients in the emergency-alerts room
      io.to('emergency-alerts').emit('emergency-alert', alert);
    } catch (error) {
      logger.error('Error processing alert message', { error: error.message });
    }
  });
  
  // Subscribe to alert acknowledgments channel
  await subscriber.subscribe('alert-acknowledgments', (message) => {
    try {
      const ack = JSON.parse(message);
      logger.info('Received alert acknowledgment', { alertId: ack.id });
      
      // Broadcast to all connected clients in the emergency-alerts room
      io.to('emergency-alerts').emit('alert-acknowledged', ack);
    } catch (error) {
      logger.error('Error processing acknowledgment message', { error: error.message });
    }
  });
})();

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'alerts-streamer',
    timestamp: new Date().toISOString()
  });
});

// Default route
app.get('/', (req, res) => {
  res.status(200).json({
    service: 'Alerts Streamer Service',
    version: '1.0.0',
    endpoints: [
      '/health',
      '/ws/alerts'
    ]
  });
});

// Socket.IO authentication middleware
io.use((socket, next) => {
  try {
    // Get token from query parameter or Authorization header
    const token = socket.handshake.query.token || 
                  socket.handshake.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return next(new Error('Authentication token is required'));
    }
    
    // Verify JWT token
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return next(new Error('Invalid authentication token'));
      }
      
      // Check if user has required role (doctor or nurse)
      const roles = decoded.roles || [];
      if (!roles.includes('doctor') && !roles.includes('nurse')) {
        return next(new Error('Insufficient permissions'));
      }
      
      // Attach user info to socket
      socket.user = decoded;
      next();
    });
  } catch (error) {
    logger.error('Socket authentication error', { error: error.message });
    next(new Error('Authentication error'));
  }
});

// Socket.IO connection handler
io.on('connection', (socket) => {
  logger.info('Client connected', { 
    userId: socket.user.id,
    username: socket.user.name,
    roles: socket.user.roles
  });
  
  // Join the emergency-alerts room
  socket.join('emergency-alerts');
  
  // Handle disconnect
  socket.on('disconnect', () => {
    logger.info('Client disconnected', { userId: socket.user.id });
  });
});

// Start server
server.listen(PORT, '0.0.0.0', () => {
  logger.info(`Alerts Streamer Service running on port ${PORT}`);
});

module.exports = { app, server, io };
