# Ojalá Healthcare Platform - MD Dashboard (MVP - Phase 1B)

This document provides an overview of the Minimum Viable Product (MVP) for the MD Dashboard, implemented as part of Phase 1B.

## Overview

The MD Dashboard provides physicians with a centralized interface to manage patients, view analytics, handle prescriptions, and monitor real-time alerts.

## Features Implemented (MVP)

*   **Dashboard Overview (`/`):**
    *   Displays key metrics (Active Patients, Pending Approvals, Upcoming Appointments) fetched from `/dashboard/summary`.
    *   Integrates the `EscalatedAlertsPanel` for real-time emergency alerts.
    *   Includes placeholders for other sections like Recent Activity.
*   **Patient Management (`/patients`):**
    *   Displays a table of patients fetched from `/patients`.
    *   Includes loading states (skeletons) and error handling.
    *   Provides placeholder actions (View Details, Edit, Delete) via a dropdown menu.
    *   Includes a placeholder "Add New Patient" button (form not implemented in MVP).
*   **Analytics (`/analytics`):**
    *   Displays charts for Patient Age Distribution, Monthly Appointments, and Common Condition Distribution using Recharts.
    *   Fetches data from `/analytics/demographics`, `/analytics/appointments`, and `/analytics/conditions`.
    *   Includes loading states (skeletons) and error handling.
*   **Prescription Management (`/prescriptions`):**
    *   Displays a table of prescriptions fetched from `/prescriptions`.
    *   Includes a dialog form to add new prescriptions (posts to `/prescriptions`).
    *   Includes loading states (skeletons) and error handling for both fetching and submitting.
    *   Uses badges to indicate prescription status.
*   **Real-time Alerts (`EscalatedAlertsPanel`):**
    *   Connects to a WebSocket endpoint (default: `http://localhost:5004/ws/alerts`) for real-time emergency alerts.
    *   Fetches initial alert states from `/alerts/active` and `/alerts`.
    *   Allows acknowledging active alerts (posts to `/alerts/{id}/acknowledge`).
    *   Uses authentication token for API calls and WebSocket connection.
*   **Layout & Navigation:**
    *   Basic sidebar navigation structure (`MainLayout.tsx`).
    *   Routing implemented using `react-router-dom`.
*   **Styling:**
    *   Uses Tailwind CSS with configuration aligned to the platform's shared theme.
    *   Leverages shadcn/ui components for UI elements (Table, Card, Button, Dialog, etc.).
*   **Authentication:**
    *   Basic `useAuth` hook using `localStorage` for token management (MVP implementation).
    *   `fetchWithAuth` utility for making authenticated API calls.

## Technology Stack

*   React
*   TypeScript
*   Vite
*   Tailwind CSS
*   shadcn/ui
*   Recharts
*   React Router DOM
*   Socket.IO Client
*   date-fns
*   Lucide React (Icons)

## Setup and Build Instructions

### Prerequisites
- Docker and Docker Compose installed
- Node.js 18+ (for local development)
- .NET SDK 8.0 (for local development)

### Environment Setup
1. Copy the example environment file:
   ```bash
   cp .env.example .env
