import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // While we're checking authentication, render nothing (or a spinner)
  if (isLoading) return null;

  // If authenticated, render children; otherwise redirect to /login
  return isAuthenticated
    ? children
    : <Navigate to="/login" replace state={{ from: location }} />;
}

export default ProtectedRoute;
