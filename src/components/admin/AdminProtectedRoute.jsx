import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '../../services/api';

export default function AdminProtectedRoute({ children }) {
  const location = useLocation();
  const authenticated = authService.isAuthenticated();
  const role = authService.getUserRole();

  if (!authenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role !== 'ADMIN') {
    return <Navigate to="/login" state={{ from: location, error: 'Only administrators can access the admin control tower.' }} replace />;
  }

  return children;
}
