import React from 'react';
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const RequireAuth = ({ allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // Optional: Show a loading spinner while checking auth state
    return <div>Loading...</div>;
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Check if user has the required role (if roles are specified)
  const userRoles = Array.isArray(user?.roles) ? user.roles : [user?.roles].filter(Boolean);
  const hasRequiredRole = allowedRoles ? allowedRoles.some(role => userRoles.includes(role)) : true;

  if (!hasRequiredRole) {
    // Redirect to an unauthorized page or back to login/home
    // For simplicity, redirecting to login here, but a dedicated /unauthorized page is better
    console.warn(`User with roles [${userRoles.join(', ')}] attempted to access route requiring roles [${allowedRoles.join(', ')}]`);
    return <Navigate to="/" state={{ from: location }} replace />;
    // Or: return <Navigate to="/unauthorized" replace />;
  }

  // If authenticated and authorized, render the child routes/component
  return <Outlet />;
};

export default RequireAuth;

