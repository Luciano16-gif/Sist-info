import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../../firebase-config';
import { useNavigate, useLocation } from 'react-router-dom';
import * as authService from '../services/authService';

// Create the AuthContext
const AuthContext = createContext(null);

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Cleanup on unmount
    return () => unsubscribe();
  }, []);

  // Error handling helper
  const handleAuthError = (error, callback) => {
    setError(error.message);
    setTimeout(() => setError(null), 5000); // Auto-clear error after 5 seconds
    if (callback) callback(error);
  };

  // Define authentication methods using authService
  const login = async (email, password, onError) => {
    try {
      setError(null);
      setIsAuthenticating(true);
      return await authService.emailSignIn(email, password);
    } catch (error) {
      handleAuthError(error, onError);
      return null;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const signup = async (userData, onError) => {
    try {
      setError(null);
      setIsAuthenticating(true);
      return await authService.emailSignUp(userData);
    } catch (error) {
      handleAuthError(error, onError);
      return null;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const loginWithGoogle = async (isSignUp = false, onError) => {
    try {
      setError(null);
      setIsAuthenticating(true);
      return await authService.googleAuth(isSignUp);
    } catch (error) {
      handleAuthError(error, onError);
      return null;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const logout = async (onError) => {
    try {
      setError(null);
      await authService.logOut();
      return true;
    } catch (error) {
      handleAuthError(error, onError);
      return false;
    }
  };

  // Context value object
  const value = {
    currentUser,
    error,
    login,
    signup,
    loginWithGoogle,
    logout,
    loading,
    isAuthenticating,
    setError
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
};

// Custom redirect hook with improved logic to prevent unwanted redirects
export const useAuthRedirect = (redirectPath = '/') => {
  const { currentUser, isAuthenticating, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only redirect if:
    // 1. We have a current user
    // 2. We're not in the middle of an authentication process
    // 3. There are no authentication errors
    // 4. We're not already on the redirectPath
    if (currentUser && 
        !isAuthenticating && 
        !error && 
        location.pathname !== redirectPath) {
      navigate(redirectPath);
    }
  }, [currentUser, navigate, redirectPath, isAuthenticating, error, location]);

  return currentUser;
};