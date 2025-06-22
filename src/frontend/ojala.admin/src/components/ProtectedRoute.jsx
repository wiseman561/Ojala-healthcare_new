import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useMaintenanceMode } from '../hooks/useMaintenanceMode';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { hasRole, loading: authLoading } = useAuth();
  const { canAccess, isMaintenanceMode } = useMaintenanceMode();

  if (authLoading) {
    return <div>Loading...</div>;
  }

  // Check maintenance mode first
  if (!canAccess) {
    return <Navigate to="/maintenance" replace />;
  }

  // Then check role-based access
  if (!hasRole(allowedRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
