# OjalaHealthcarePlatform Scaffolding Documentation

## Overview

This document provides a comprehensive overview of the canonical scaffolding layout created for the OjalaHealthcarePlatform. The scaffolding follows modern best practices for healthcare SaaS applications with a clear separation of concerns and a modular architecture.

## Directory Structure

```
OjalaHealthcarePlatform/
├── .github/workflows/          # CI/CD pipeline definitions
├── src/                        # Source code
│   ├── backend/                # Backend services
│   │   ├── Ojala.Api/          # Main API service
│   │   ├── Ojala.ApiGateway/   # API Gateway using Ocelot
│   │   ├── Ojala.Services/     # Shared services and business logic
│   │   └── Ojala.Identity/     # Identity and authentication service
│   ├── frontend/               # Frontend applications
│   │   ├── Ojala.Web/          # Main web application (React)
│   │   └── Ojala.PatientPortal/# Patient-facing portal (React)
│   └── shared/                 # Shared libraries and utilities
│       ├── Ojala.Common/       # Common utilities and helpers
│       └── Ojala.Contracts/    # Shared DTOs and contracts
├── tests/                      # Test projects
│   ├── Ojala.Tests.Unit/       # Unit tests
│   ├── Ojala.Tests.Integration/# Integration tests
│   └── Ojala.Tests.E2E/        # End-to-end tests with Cypress
├── docs/                       # Documentation
│   ├── architecture/           # Architecture diagrams and descriptions
│   ├── api/                    # API documentation
│   └── guides/                 # User and developer guides
├── infra/                      # Infrastructure as code
│   ├── terraform/              # Terraform configurations
│   ├── kubernetes/             # Kubernetes manifests
│   └── monitoring/             # Monitoring and observability
├── scripts/                    # Utility scripts
│   ├── setup/                  # Setup scripts
│   └── deployment/             # Deployment scripts
├── OjalaHealthcarePlatform.sln # Solution file
└── README.md                   # Project overview
```

## Project Files

### Solution File
- **OjalaHealthcarePlatform.sln**: Main solution file that includes all projects with proper references and organization.

### Backend Projects
1. **Ojala.Api.csproj**
   - Main API service with RESTful endpoints
   - References: Ojala.Common, Ojala.Contracts, Ojala.Services
   - Key packages: ASP.NET Core MVC, Entity Framework Core, Swagger

2. **Ojala.ApiGateway.csproj**
   - API Gateway using Ocelot for routing and request aggregation
   - References: Ojala.Common
   - Key packages: Ocelot, Polly for resilience patterns

3. **Ojala.Services.csproj**
   - Core business logic and service implementations
   - References: Ojala.Common, Ojala.Contracts
   - Key packages: Microsoft Extensions, Newtonsoft.Json, LaunchDarkly

4. **Ojala.Identity.csproj**
   - Authentication and authorization service
   - References: Ojala.Common, Ojala.Contracts
   - Key packages: ASP.NET Core Identity, JWT Bearer, Entity Framework Core

### Shared Projects
1. **Ojala.Common.csproj**
   - Common utilities and helpers
   - Key packages: Microsoft Extensions for logging and configuration

2. **Ojala.Contracts.csproj**
   - Shared DTOs and API contracts
   - Key packages: Newtonsoft.Json

### Test Projects
1. **Ojala.Tests.Unit.csproj**
   - Unit tests for individual components
   - References: Ojala.Api, Ojala.Services, Ojala.Common, Ojala.Contracts
   - Key packages: xUnit, Moq, FluentAssertions

2. **Ojala.Tests.Integration.csproj**
   - Integration tests for component interactions
   - References: Ojala.Api, Ojala.ApiGateway, Ojala.Identity
   - Key packages: xUnit, ASP.NET Core Mvc Testing, Testcontainers

### Frontend Applications
1. **Ojala.Web/package.json**
   - Main web application for healthcare providers
   - Key packages: React 18, Material UI, React Router, Axios, Recharts
   - Testing: Jest, React Testing Library, Axe for accessibility

2. **Ojala.PatientPortal/package.json**
   - Patient-facing portal
   - Key packages: React 18, Material UI, React Router, Axios, Recharts
   - Testing: Jest, React Testing Library, Axe for accessibility

## Development Workflow

1. **Backend Development**
   - Use Visual Studio or VS Code to open the OjalaHealthcarePlatform.sln
   - Run individual projects or the entire solution
   - Follow the dependency chain: Contracts → Common → Services → Api/Identity/ApiGateway

2. **Frontend Development**
   - Navigate to the respective frontend project directory
   - Run `npm install` to install dependencies
   - Use `npm start` for development server
   - Use `npm test` for running tests
   - Use `npm run build` for production builds

3. **Testing**
   - Unit tests: Test individual components in isolation
   - Integration tests: Test component interactions
   - E2E tests: Test complete user flows with Cypress

## Deployment

The scaffolding includes infrastructure as code for deploying to various environments:

1. **Local Development**
   - Docker Compose for local development environment

2. **Cloud Deployment**
   - Terraform for provisioning cloud infrastructure
   - Kubernetes manifests for container orchestration

3. **Monitoring**
   - Prometheus for metrics collection
   - Grafana for dashboards and visualization

## Next Steps

1. Implement core domain models and database context
2. Set up authentication and authorization flows
3. Implement API endpoints for healthcare functionality
4. Develop frontend components and pages
5. Configure CI/CD pipelines for automated testing and deployment
