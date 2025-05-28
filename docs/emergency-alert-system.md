# Emergency Alert Escalation System Documentation

## Overview

The Emergency Alert Escalation System is a critical component of the Ojala Healthcare Platform that provides real-time monitoring, classification, and notification of patient vital sign anomalies. The system automatically categorizes alerts based on severity thresholds, escalates emergency situations to medical staff, and provides a real-time interface for acknowledging and managing alerts.

## Architecture

The Emergency Alert Escalation System consists of the following components:

1. **Nurse Assistant Service**: Processes telemetry data, classifies alerts by severity, and escalates emergency alerts
2. **Ojala.Api AlertsController**: Receives escalated alerts, persists them to the database, and publishes to Redis
3. **Alerts Streamer Microservice**: Subscribes to Redis channels and broadcasts alerts via WebSockets
4. **Dashboard UI Components**: Displays alerts in real-time and provides acknowledgment functionality
5. **Redis**: Serves as the pub/sub messaging system for real-time communication

### Component Diagram

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Device Gateway │────▶│ Nurse Assistant │────▶│    Ojala.Api    │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                         │
                                                         ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  RN Dashboard   │◀────│ Alerts Streamer │◀────│      Redis      │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                               ▲
                               │
                        ┌──────┴──────┐
                        │ MD Dashboard │
                        └─────────────┘
```

## Data Flow

1. **Telemetry Processing**:
   - Device Gateway receives telemetry data from patient devices
   - Data is forwarded to the Nurse Assistant service for processing

2. **Alert Classification**:
   - Nurse Assistant service classifies alerts based on severity thresholds
   - Info and Warning alerts follow the normal reminder flow
   - Emergency alerts are escalated to the API

3. **Alert Escalation**:
   - Nurse Assistant calls POST /alerts/escalate on the API Gateway
   - API authenticates the request and persists the alert to the database
   - API notifies on-call MDs via email/SMS
   - API publishes the alert to Redis 'emergency-alerts' channel

4. **Real-time Notification**:
   - Alerts Streamer subscribes to Redis channels
   - When a new alert is published, it's broadcast to connected clients via WebSockets
   - Dashboard UIs receive the alert and update in real-time

5. **Alert Acknowledgment**:
   - MD/RN acknowledges an alert via the dashboard UI
   - API updates the alert status in the database
   - API publishes acknowledgment to Redis 'alert-acknowledgments' channel
   - Alerts Streamer broadcasts the acknowledgment to all connected clients
   - Dashboard UIs update to reflect the acknowledgment

## Component Details

### 1. Alert Severity Classification

The system classifies alerts into three severity levels based on the following thresholds:

| Metric | Info | Warning | Emergency |
|--------|------|---------|-----------|
| Heart Rate | 100–110 bpm | 110–120 bpm | > 120 bpm |
| SpO₂ | 90–94 % | 85–90 % | < 85 % |
| BP Systolic | 130–139 mmHg | 140–159 mmHg | ≥ 160 mmHg |
| BP Diastolic | 80–89 mmHg | 90–99 mmHg | ≥ 100 mmHg |

Additionally, any arrhythmia or device-reported "panic" event is automatically classified as an Emergency.

### 2. Nurse Assistant Service

The Nurse Assistant service has been enhanced to:
- Evaluate incoming telemetry data against severity thresholds
- Classify alerts as Info, Warning, or Emergency
- Escalate Emergency alerts to the API Gateway
- Continue normal processing for Info and Warning alerts

Key files:
- `/src/backend/nurse-assistant/alertSeverity.js`: Contains severity classification logic
- `/src/backend/nurse-assistant/alertsRouter.js`: Handles alert processing and escalation
- `/src/backend/nurse-assistant/server.js`: Integrates the alerts router

### 3. Alerts Controller

The Alerts Controller in Ojala.Api handles:
- Receiving escalated alerts from the Nurse Assistant service
- Authenticating requests via JWT
- Persisting alerts to the database
- Notifying on-call MDs
- Publishing alerts to Redis for real-time streaming
- Processing alert acknowledgments

Key files:
- `/src/backend/Ojala.Api/Controllers/AlertsController.cs`: Main controller implementation
- `/src/backend/Ojala.Data/Models/EscalatedAlert.cs`: Alert data model
- `/src/backend/Ojala.Data/OjalaDbContext.cs`: Database context with EscalatedAlerts DbSet

### 4. Alerts Streamer Microservice

The Alerts Streamer microservice:
- Subscribes to Redis channels for emergency alerts and acknowledgments
- Exposes a WebSocket endpoint at `/ws/alerts`
- Authenticates clients via JWT tokens
- Restricts access to users with doctor or nurse roles
- Broadcasts alerts and acknowledgments to connected clients

Key files:
- `/src/backend/Ojala.AlertsStreamer/server.js`: Main server implementation
- `/src/backend/Ojala.AlertsStreamer/package.json`: Dependencies
- `/src/backend/Ojala.AlertsStreamer/Dockerfile`: Container configuration

### 5. Dashboard UI Components

The Dashboard UI components:
- Display a persistent notification banner with emergency alert count
- Show detailed alert information in an expandable panel
- Allow acknowledging alerts with a single click
- Connect to the WebSocket endpoint for real-time updates
- Toggle between showing active alerts only or all alerts

Key files:
- `/src/frontend/rn-dashboard/src/components/EscalatedAlertsPanel.js`: RN Dashboard component
- `/src/frontend/md-dashboard/src/components/EscalatedAlertsPanel.js`: MD Dashboard component

## Configuration

### Redis Configuration

Redis is configured in the docker-compose.yml file:

```yaml
services:
  # Redis for pub/sub messaging
  redis:
    image: redis:7.0-alpine
    container_name: ojala-redis
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 3
```

### Environment Variables

The following environment variables should be configured:

#### Alerts Streamer Service:
- `PORT`: Port to run the service on (default: 80)
- `JWT_SECRET`: Secret key for JWT validation (default: "ojala-jwt-secret")
- `REDIS_CONNECTION`: Redis connection string (default: "redis:6379")

#### Nurse Assistant Service:
- `API_GATEWAY_URL`: URL of the API Gateway for alert escalation

#### Frontend Applications:
- `REACT_APP_API_URL`: URL of the API Gateway
- `REACT_APP_ALERTS_STREAMER_URL`: URL of the Alerts Streamer service

## Testing

### Unit Tests

Unit tests are available for all components:
- `/src/backend/nurse-assistant/tests/alertSeverity.test.js`: Tests for alert classification
- `/src/backend/Ojala.Api/Tests/AlertsControllerTests.cs`: Tests for the alerts controller
- `/src/backend/Ojala.AlertsStreamer/tests/server.test.js`: Tests for the alerts streamer
- `/src/frontend/rn-dashboard/src/tests/EscalatedAlertsPanel.test.js`: Tests for the UI component

### Integration Testing

An integration test script is provided to test the complete system:
- `/scripts/test-emergency-alert-system.sh`: Tests the end-to-end alert flow

To run the integration test:
```bash
cd /home/ubuntu/OjalaHealthcarePlatform
./scripts/test-emergency-alert-system.sh
```

## Deployment

1. Ensure Redis is added to your docker-compose.yml file
2. Build and deploy the Alerts Streamer service:
   ```bash
   cd /src/backend/Ojala.AlertsStreamer
   docker build -t ojala-alerts-streamer .
   ```
3. Update your deployment scripts to include the new service
4. Configure environment variables as described above
5. Deploy the updated services

## Troubleshooting

### Common Issues

1. **WebSocket Connection Failures**:
   - Verify JWT token is valid and includes doctor or nurse roles
   - Check that the Alerts Streamer service is running
   - Ensure Redis is running and accessible

2. **Missing Alerts**:
   - Verify the Nurse Assistant service is correctly classifying alerts
   - Check Redis connections in both the API and Alerts Streamer
   - Verify database connectivity in the API

3. **Alert Acknowledgment Issues**:
   - Check API logs for errors when processing acknowledgments
   - Verify Redis is publishing acknowledgments correctly
   - Ensure WebSocket connections are active

### Logging

Logs are available in the following locations:
- Nurse Assistant: Standard container logs
- Ojala.Api: Application logs via configured logger
- Alerts Streamer: Combined logs in `combined.log` and error logs in `error.log`
- Frontend: Browser console logs

## Security Considerations

1. **Authentication**: All endpoints are secured with JWT authentication
2. **Authorization**: WebSocket connections are restricted to users with doctor or nurse roles
3. **Data Validation**: All inputs are validated before processing
4. **Secure Communication**: Use HTTPS in production environments

## Future Enhancements

Potential future enhancements to consider:
1. Advanced alert filtering by patient, unit, or severity
2. Historical alert analytics and trend analysis
3. Integration with mobile push notifications
4. Customizable alert thresholds by patient or condition
5. AI-powered predictive alerting based on trend analysis
