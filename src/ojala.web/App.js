import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import RequireAuth from './components/RequireAuth';
import Login from './Login';

// Placeholder for the main employer dashboard component
const EmployerDashboardMain = () => <div>Employer Dashboard (Protected)</div>;

// Define roles (align with backend roles)
const ROLES = {
  Admin: 'Admin',
  Provider: 'Provider',
  Patient: 'Patient',
  Employer: 'Employer'
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public route */}
          <Route path="/" element={<Login />} />

          {/* Protected Employer Routes */}
          <Route element={<RequireAuth allowedRoles={[ROLES.Employer, ROLES.Admin]} />}>
            {/* Assuming the main employer view is at /dashboard or similar */}
            <Route path="/dashboard" element={<EmployerDashboardMain />} />
            {/* Add other employer-specific routes here */}
          </Route>

          {/* TODO: Add a 404 Not Found route */}
          {/* TODO: Add an Unauthorized route */}

        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;

