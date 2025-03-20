import React, { useEffect } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * GuideProtectedRoute component that ensures routes are only accessible to guides and admins
 * 
 * @param {Object} props Component props
 * @param {string} [props.redirectPath='/signUpPage'] Path to redirect to if not guide/admin
 * @param {function} [props.onRedirect] Optional callback function that runs on redirect
 * @returns {React.ReactNode} The protected component or redirect
 */
const GuideProtectedRoute = ({ redirectPath = '/signUpPage', onRedirect }) => {
  const { currentUser, userRole } = useAuth();
  const location = useLocation();

  // Check if user is guide or admin
  const hasAccess = !!currentUser && currentUser.email && (userRole === 'guia' || userRole === 'admin');

  useEffect(() => {
    // Log access attempt for debugging
    if (!hasAccess) {
      console.log('Access to guide route denied - redirecting from:', location.pathname);
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
  }, [hasAccess, location.pathname, userRole, onRedirect, currentUser]);

  // Render the protected component or redirect
  if (!hasAccess) {
    // If user is authenticated but not guide/admin, redirect to home
    // Otherwise, redirect to signup
    const redirectTo = currentUser ? '/' : redirectPath;
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If authenticated with correct role, render the outlet
  return <Outlet />;
};

export default GuideProtectedRoute;