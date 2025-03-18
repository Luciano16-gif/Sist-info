import React, { useEffect } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * AdminProtectedRoute component that ensures routes are only accessible to admin users
 * 
 * @param {Object} props Component props
 * @param {string} [props.redirectPath='/signUpPage'] Path to redirect to if not admin
 * @param {function} [props.onRedirect] Optional callback function that runs on redirect
 * @returns {React.ReactNode} The protected component or redirect
 */
const AdminProtectedRoute = ({ redirectPath = '/signUpPage', onRedirect }) => {
  const { currentUser, userRole } = useAuth();
  const location = useLocation();

  // Strict authentication check - verify user is authenticated and has admin role
  const isAdmin = !!currentUser && currentUser.email && userRole === 'admin';

  useEffect(() => {
    // Log access attempt for debugging
    if (!isAdmin) {
      console.log('Access to admin route denied - redirecting from:', location.pathname);
      console.log('User role:', userRole);
      
      // Clear any persisted auth data when redirecting due to auth failure
      if (!currentUser) {
        try {
          localStorage.removeItem('tempUserEmail');
          localStorage.removeItem('tempUserRole');
          localStorage.removeItem('lastValidUserEmail');
          localStorage.removeItem('lastValidUserRole');
        } catch (e) {
          console.error("Failed to clear localStorage during redirect:", e);
        }
      }
      
      // Execute onRedirect callback if provided
      if (onRedirect) {
        onRedirect();
      }
    }
  }, [isAdmin, location.pathname, userRole, onRedirect, currentUser]);

  // Render the protected component or redirect
  if (!isAdmin) {
    // If user is authenticated but not admin, redirect to home
    // Otherwise, redirect to signup
    const redirectTo = currentUser ? '/' : redirectPath;
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If authenticated as admin, render the outlet (child routes)
  return <Outlet />;
};

export default AdminProtectedRoute;