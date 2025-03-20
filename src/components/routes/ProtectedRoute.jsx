import React, { useEffect } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * ProtectedRoute component that ensures routes are only accessible to authenticated users
 * 
 * @param {Object} props Component props
 * @param {string} [props.redirectPath='/signUpPage'] Path to redirect to if not authenticated
 * @param {function} [props.onRedirect] Optional callback function that runs on redirect
 * @returns {React.ReactNode} The protected component or redirect
 */
const ProtectedRoute = ({ redirectPath = '/signUpPage', onRedirect }) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  // Strict authentication check - only rely on Firebase auth, not persisted data
  const isAuthenticated = !!currentUser && currentUser.email;

  useEffect(() => {
    // Log authentication status for debugging
    if (!isAuthenticated) {
      console.log('Access to protected route denied - redirecting from:', location.pathname);
      
      // Clear any persisted auth data when redirecting due to auth failure
      try {
        localStorage.removeItem('tempUserEmail');
        localStorage.removeItem('tempUserRole');
        localStorage.removeItem('lastValidUserEmail');
        localStorage.removeItem('lastValidUserRole');
      } catch (e) {
        console.error("Failed to clear localStorage during redirect:", e);
      }
      
      // Execute onRedirect callback if provided
      if (onRedirect) {
        onRedirect();
      }
    }
  }, [isAuthenticated, location.pathname, onRedirect]);

  // Render the protected component or redirect
  if (!isAuthenticated) {
    // Redirect to the signup page, preserving the attempted location for potential "redirect back" functionality
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // If authenticated, render the outlet (child routes)
  return <Outlet />;
};

export default ProtectedRoute;