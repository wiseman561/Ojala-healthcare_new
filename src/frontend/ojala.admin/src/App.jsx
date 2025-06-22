import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { ROLES } from './contexts/AuthContext';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Patients from './pages/Patients';
import Alerts from './pages/Alerts';
import Logs from './pages/Logs';
import Settings from './pages/Settings';
import Unauthorized from './pages/Unauthorized';
import Login from './pages/Login';
import MaintenanceMode from './components/MaintenanceMode';
import { Toaster } from 'react-hot-toast';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <Router>
        <div className="h-screen flex overflow-hidden bg-gray-100 dark:bg-gray-900">
          <Sidebar />
          <div className="flex-1 overflow-auto focus:outline-none">
            <main className="flex-1 relative z-0 overflow-y-auto py-6">
              <Routes>
                {/* Public routes */}
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="/login" element={<Login />} />
                <Route path="/maintenance" element={<MaintenanceMode />} />

                {/* Protected routes */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.PROVIDER, ROLES.NURSE, ROLES.STAFF]}>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                      <Users />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/patients"
                  element={
                    <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.PROVIDER, ROLES.NURSE]}>
                      <Patients />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/alerts"
                  element={
                    <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.PROVIDER, ROLES.NURSE]}>
                      <Alerts />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/logs"
                  element={
                    <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                      <Logs />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/settings"
                  element={
                    <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                      <Settings />
                    </ProtectedRoute>
                  }
                />

                {/* Redirect root to dashboard */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.PROVIDER, ROLES.NURSE, ROLES.STAFF]}>
                      <Navigate to="/admin/dashboard" replace />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
