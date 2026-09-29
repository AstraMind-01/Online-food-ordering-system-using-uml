import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '../../services/api';

export default function RestaurantProtectedRoute({ children }) {
  const location = useLocation();
  const authenticated = authService.isAuthenticated();
  const role = authService.getUserRole();

  if (!authenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role !== 'RESTAURANT' && role !== 'ADMIN') {
    // If logged in as another role (e.g. customer), redirect to home or login
    return <Navigate to="/login" state={{ from: location, error: 'Only restaurant staff can access the owner panel.' }} replace />;
  }

  return children;
}
