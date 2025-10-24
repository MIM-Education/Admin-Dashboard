// src/components/ProtectedRoute.jsx
import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useContext(AuthContext); // Assuming AuthContext might have a loading state if async login
  
  if (loading) {
      return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
              <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Checking authentication...</p>
              </div>
          </div>
      );
  }

  if (!user) {
    // User not authenticated, redirect to login page
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // User authenticated but not authorized for this role, redirect to a forbidden page or their allowed dashboard
    console.warn(`User ${user.name} with role ${user.role} tried to access a page for roles: ${allowedRoles.join(', ')}`);
    return <Navigate to="/" replace />; // Or to a specific "Access Denied" page
  }

  // User is authenticated and authorized, render the child routes/components
  return <Outlet />;
};

export default ProtectedRoute;
