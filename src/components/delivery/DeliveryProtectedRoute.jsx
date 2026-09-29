import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '../../services/api';

export default function DeliveryProtectedRoute({ children }) {
  const location = useLocation();
  const authenticated = authService.isAuthenticated();
  const role = authService.getUserRole();

  if (!authenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role !== 'DELIVERY_PARTNER' && role !== 'ADMIN') {
    return (
      <Navigate
        to="/login"
        state={{ from: location, error: 'Only delivery partners can access the courier panel.' }}
        replace
      />
    );
  }

  return children;
}
