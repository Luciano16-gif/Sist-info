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

  // Define authentication methods using authService
  const login = async (email, password, onError) => {
    try {
      setError(null);
      setIsAuthenticating(true);
      
      const result = await authService.emailSignIn(email, password);
      
      // Check if there was an error
      if (result && result.error) {
        setError(result.message);
        if (onError) onError({ message: result.message });
        return null;
      }
      
      return result; // This will be the user object on success
    } catch (error) {
      // This should rarely happen now, but just in case
      setError(error.message || 'Ocurrió un error durante la autenticación.');
      if (onError) onError(error);
      return null;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const signup = async (userData, onError) => {
    try {
      setError(null);
      setIsAuthenticating(true);
      
      const result = await authService.emailSignUp(userData);
      
      // Check if there was an error
      if (result && result.error) {
        setError(result.message);
        if (onError) onError({ message: result.message });
        return null;
      }
      
      return result; // This will be the user object on success
    } catch (error) {
      // This should rarely happen now, but just in case
      setError(error.message || 'Ocurrió un error durante la autenticación.');
      if (onError) onError(error);
      return null;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const loginWithGoogle = async (isSignUp = false, onError) => {
    try {
      setError(null);
      setIsAuthenticating(true);
      
      const result = await authService.googleAuth(isSignUp);
      
      // Check if there was an error
      if (result && result.error) {
        setError(result.message);
        if (onError) onError({ message: result.message });
        return null;
      }
      
      return result; // This will be the user object on success
    } catch (error) {
      // This should rarely happen now, but just in case
      setError(error.message || 'Ocurrió un error durante la autenticación.');
      if (onError) onError(error);
      return null;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const logout = async (onError) => {
    try {
      setError(null);
      const result = await authService.logOut();
      
      // Check if there was an error
      if (result && result.error) {
        setError(result.message);
        if (onError) onError({ message: result.message });
        return false;
      }
      
      return true;
    } catch (error) {
      // This should rarely happen now, but just in case
      setError(error.message || 'Ocurrió un error al cerrar sesión.');
      if (onError) onError(error);
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