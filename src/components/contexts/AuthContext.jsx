// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../../firebase-config';
import { useNavigate } from 'react-router-dom';
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

  // Define authentication methods
  const login = async (email, password, onError) => {
    try {
      setError(null);
      // For testing - using dummy implementation until authService is ready
      const userCredential = await auth.signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      handleAuthError(error, onError);
      return null;
    }
  };

  const signup = async (userData, onError) => {
    try {
      setError(null);
      // Dummy implementation
      const userCredential = await auth.createUserWithEmailAndPassword(
        auth, 
        userData.email, 
        userData.password
      );
      return userCredential.user;
    } catch (error) {
      handleAuthError(error, onError);
      return null;
    }
  };

  const loginWithGoogle = async (isSignUp = false, onError) => {
    try {
      setError(null);
      // Dummy implementation
      return null;
    } catch (error) {
      handleAuthError(error, onError);
      return null;
    }
  };

  const logout = async (onError) => {
    try {
      setError(null);
      await auth.signOut();
    } catch (error) {
      handleAuthError(error, onError);
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
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
};

// Custom redirect hook
export const useAuthRedirect = (redirectPath = '/') => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate(redirectPath);
    }
  }, [currentUser, navigate, redirectPath]);

  return currentUser;
};