# OjalaHealthcarePlatform API Documentation

This document provides comprehensive documentation for the OjalaHealthcarePlatform API, including endpoints, authentication, request/response formats, and integration examples.

## Table of Contents

1. [API Overview](#api-overview)
2. [Authentication](#authentication)
3. [API Gateway](#api-gateway)
4. [Core API Endpoints](#core-api-endpoints)
5. [AI Integration API](#ai-integration-api)
6. [Feature Flag API](#feature-flag-api)
7. [Error Handling](#error-handling)
8. [Rate Limiting](#rate-limiting)
9. [Versioning](#versioning)
10. [Integration Examples](#integration-examples)

## API Overview

The OjalaHealthcarePlatform API is a RESTful API that provides access to healthcare data and services. The API is organized into the following categories:

- **Authentication**: Endpoints for user authentication and token management
- **Patient Management**: Endpoints for managing patient data and care plans
- **Clinical Data**: Endpoints for accessing and updating clinical information
- **AI Services**: Endpoints for health scoring, risk assessment, and predictions
- **Administrative**: Endpoints for system configuration and management

All API requests use HTTPS and return responses in JSON format.

## Authentication

### Authentication Methods

The API supports the following authentication methods:

- **JWT Bearer Tokens**: Standard authentication for most API calls
- **Legacy Token Bridge**: Authentication for legacy system integration
- **API Keys**: For service-to-service communication

### Obtaining a Token

**Request:**
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "username": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires": "2025-05-24T23:01:36Z",
  "userId": "user-123",
  "roles": ["RN", "Admin"]
}
```

### Using a Token

Include the token in the Authorization header for all authenticated requests:

```http
GET /api/v1/patients
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Legacy Token Validation

**Request:**
```http
POST /api/v1/authbridge/validate-legacy-token
Content-Type: application/json

{
  "legacyToken": "legacy-token-123"
}
```

**Response:**
```json
{
  "isValid": true,
  "userId": "user-123",
  "claims": {
    "role": "RN",
    "org": "Hospital A"
  }
}
```

## API Gateway

The API Gateway serves as the entry point for all API requests, providing routing, authentication, and request transformation.

### Gateway Routes

| Route Pattern | Target Service | Description |
|---------------|---------------|-------------|
| `/api/v1/auth/*` | Authentication Service | User authentication and token management |
| `/api/v1/patients/*` | Patient Service | Patient data and management |
| `/api/v1/clinical/*` | Clinical Service | Clinical data and care plans |
| `/api/v1/ai/*` | AI Engine | Health scoring and risk assessment |
| `/api/v1/admin/*` | Admin Service | System administration and configuration |
| `/legacy-api/*` | Legacy API | Proxied requests to legacy systems |

## Core API Endpoints

### Patient Management

#### Get Patient List

**Request:**
```http
GET /api/v1/patients
Authorization: Bearer {token}
```

**Response:**
```json
{
  "data": [
    {
      "id": "patient-001",
      "firstName": "John",
      "lastName": "Doe",
      "dateOfBirth": "1980-01-01",
      "gender": "Male",
      "healthScore": 85,
      "riskLevel": "Low"
    },
    {
      "id": "patient-002",
      "firstName": "Jane",
      "lastName": "Smith",
      "dateOfBirth": "1975-05-15",
      "gender": "Female",
      "healthScore": 72,
      "riskLevel": "Medium"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "totalItems": 42,
    "totalPages": 5
  }
}
```

#### Get Patient Details

**Request:**
```http
GET /api/v1/patients/{patientId}
Authorization: Bearer {token}
```

**Response:**
```json
{
  "id": "patient-001",
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1980-01-01",
  "gender": "Male",
  "contact": {
    "email": "john.doe@example.com",
    "phone": "555-123-4567",
    "address": {
      "street": "123 Main St",
      "city": "Anytown",
      "state": "CA",
      "zipCode": "12345"
    }
  },
  "healthScore": 85,
  "riskLevel": "Low",
  "careTeam": [
    {
      "id": "provider-001",
      "name": "Dr. Sarah Johnson",
      "role": "Primary Physician"
    },
    {
      "id": "provider-002",
      "name": "Michael Brown",
      "role": "Registered Nurse"
    }
  ]
}
```

### Care Plan Management

#### Get Care Plan

**Request:**
```http
GET /api/v1/clinical/care-plans/{patientId}
Authorization: Bearer {token}
```

**Response:**
```json
{
  "id": "care-plan-001",
  "patientId": "patient-001",
  "title": "Diabetes Management Plan",
  "description": "Comprehensive plan for managing Type 2 Diabetes",
  "startDate": "2025-05-01",
  "endDate": "2025-11-01",
  "status": "Active",
  "goals": [
    {
      "id": "goal-001",
      "description": "Reduce HbA1c to below 7.0%",
      "targetDate": "2025-08-01",
      "status": "In Progress"
    },
    {
      "id": "goal-002",
      "description": "Maintain blood pressure below 130/80",
      "targetDate": "2025-07-01",
      "status": "In Progress"
    }
  ],
  "tasks": [
    {
      "id": "task-001",
      "title": "Weekly blood glucose monitoring",
      "description": "Check and record blood glucose levels 3 times per week",
      "assignee": "RN",
      "frequency": "Weekly",
      "status": "Active"
    },
    {
      "id": "task-002",
      "title": "Monthly HbA1c test",
      "description": "Perform HbA1c test and record results",
      "assignee": "MD",
      "frequency": "Monthly",
      "status": "Pending"
    }
  ]
}
```

#### Create Care Plan

**Request:**
```http
POST /api/v1/clinical/care-plans
Authorization: Bearer {token}
Content-Type: application/json

{
  "patientId": "patient-001",
  "title": "Diabetes Management Plan",
  "description": "Comprehensive plan for managing Type 2 Diabetes",
  "startDate": "2025-05-01",
  "endDate": "2025-11-01",
  "goals": [
    {
      "description": "Reduce HbA1c to below 7.0%",
      "targetDate": "2025-08-01"
    },
    {
      "description": "Maintain blood pressure below 130/80",
      "targetDate": "2025-07-01"
    }
  ],
  "tasks": [
    {
      "title": "Weekly blood glucose monitoring",
      "description": "Check and record blood glucose levels 3 times per week",
      "assignee": "RN",
      "frequency": "Weekly"
    },
    {
      "title": "Monthly HbA1c test",
      "description": "Perform HbA1c test and record results",
      "assignee": "MD",
      "frequency": "Monthly"
    }
  ]
}
```

**Response:**
```json
{
  "id": "care-plan-001",
  "patientId": "patient-001",
  "title": "Diabetes Management Plan",
  "status": "Active",
  "message": "Care plan created successfully"
}
```

## AI Integration API

### Health Score

#### Get Health Score

**Request:**
```http
GET /api/v1/ai/healthscore/{patientId}
Authorization: Bearer {token}
```

**Response:**
```json
{
  "patientId": "patient-001",
  "score": 85.5,
  "scoreDate": "2025-04-24T12:00:00Z",
  "factors": [
    "Blood pressure within target range",
    "Regular medication adherence",
    "Consistent exercise routine"
  ],
  "trend": "Improving",
  "recommendedActions": [
    "Continue current medication regimen",
    "Increase water intake",
    "Schedule follow-up appointment in 3 months"
  ]
}
```

### Risk Assessment

#### Get Risk Assessment

**Request:**
```http
GET /api/v1/ai/risk/{patientId}
Authorization: Bearer {token}
```

**Response:**
```json
{
  "patientId": "patient-001",
  "overallRisk": "Low",
  "riskCategories": {
    "Cardiovascular": "Low",
    "Diabetes": "Medium",
    "Respiratory": "Low",
    "Mental Health": "Low"
  },
  "assessmentDate": "2025-04-24T12:00:00Z",
  "nextAssessmentDue": "2025-07-24T12:00:00Z",
  "preventiveActions": [
    "Annual physical examination",
    "Regular blood glucose monitoring",
    "Maintain healthy diet and exercise"
  ]
}
```

### Forecasting

#### Get Forecast

**Request:**
```http
GET /api/v1/ai/forecast/{patientId}?metricType=bloodPressure&daysAhead=30
Authorization: Bearer {token}
```

**Response:**
```json
{
  "patientId": "patient-001",
  "metricType": "bloodPressure",
  "forecastDate": "2025-04-24T12:00:00Z",
  "forecastValues": {
    "2025-05-01": 120.5,
    "2025-05-08": 118.2,
    "2025-05-15": 119.0,
    "2025-05-22": 117.5
  },
  "confidence": 0.85,
  "alerts": [
    "Potential slight elevation on 2025-05-15"
  ]
}
```

## Feature Flag API

### Get Feature Flags

**Request:**
```http
GET /api/v1/features
Authorization: Bearer {token}
```

**Response:**
```json
{
  "UseNewHealthScoreModel": true,
  "UseNewRiskModel": false,
  "EnableTelehealth": true,
  "EnablePatientMessaging": true,
  "ShowEmployerAnalytics": true
}
```

### Toggle Feature Flag

**Request:**
```http
POST /api/v1/features/toggle
Authorization: Bearer {token}
Content-Type: application/json

{
  "featureName": "UseNewHealthScoreModel",
  "enabled": false
}
```

**Response:**
```json
{
  "featureName": "UseNewHealthScoreModel",
  "enabled": false,
  "updatedAt": "2025-04-24T23:01:36Z",
  "updatedBy": "user-123"
}
```

### Enable Feature for User

**Request:**
```http
POST /api/v1/features/enable-for-user
Authorization: Bearer {token}
Content-Type: application/json

{
  "featureName": "UseNewRiskModel",
  "userId": "user-123"
}
```

**Response:**
```json
{
  "featureName": "UseNewRiskModel",
  "userId": "user-123",
  "enabled": true,
  "updatedAt": "2025-04-24T23:01:36Z"
}
```

## Error Handling

All API errors follow a consistent format:

```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "The requested resource was not found",
    "details": "Patient with ID patient-999 does not exist",
    "requestId": "req-abc-123",
    "timestamp": "2025-04-24T23:01:36Z"
  }
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Authentication required or token invalid |
| `FORBIDDEN` | 403 | Insufficient permissions for the operation |
| `RESOURCE_NOT_FOUND` | 404 | The requested resource does not exist |
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `INTERNAL_ERROR` | 500 | An unexpected error occurred |
| `SERVICE_UNAVAILABLE` | 503 | The service is temporarily unavailable |

## Rate Limiting

API requests are subject to rate limiting to ensure fair usage and system stability.

### Rate Limit Headers

Rate limit information is included in response headers:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1619308896
```

### Rate Limit Exceeded

When rate limits are exceeded, the API returns a 429 Too Many Requests response:

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded",
    "details": "Maximum of 100 requests per minute allowed",
    "requestId": "req-abc-123",
    "timestamp": "2025-04-24T23:01:36Z"
  }
}
```

## Versioning

The API uses versioning to ensure backward compatibility as new features are added.

### Version in URL Path

```
https://api.ojala-healthcare.com/api/v1/patients
```

### Version in Accept Header

```
Accept: application/json; version=1
```

## Integration Examples

### Authentication Flow

```javascript
// Example: Authenticate and get a token
async function authenticate(username, password) {
  const response = await fetch('https://api.ojala-healthcare.com/api/v1/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  });
  
  if (!response.ok) {
    throw new Error(`Authentication failed: ${response.status}`);
  }
  
  const data = await response.json();
  return data.token;
}

// Example: Use the token to get patient data
async function getPatientData(token, patientId) {
  const response = await fetch(`https://api.ojala-healthcare.com/api/v1/patients/${patientId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    throw new Error(`Failed to get patient data: ${response.status}`);
  }
  
  return await response.json();
}
```

### Feature Flag Integration

```javascript
// Example: Check if a feature is enabled
async function isFeatureEnabled(token, featureName) {
  const response = await fetch('https://api.ojala-healthcare.com/api/v1/features', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    throw new Error(`Failed to get feature flags: ${response.status}`);
  }
  
  const features = await response.json();
  return features[featureName] === true;
}

// Example: Use feature flag to determine which implementation to use
async function getHealthScore(token, patientId) {
  const useNewModel = await isFeatureEnabled(token, 'UseNewHealthScoreModel');
  
  const url = useNewModel 
    ? `https://api.ojala-healthcare.com/api/v1/ai/healthscore/${patientId}?model=new`
    : `https://api.ojala-healthcare.com/api/v1/ai/healthscore/${patientId}`;
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    throw new Error(`Failed to get health score: ${response.status}`);
  }
  
  return await response.json();
}
```
