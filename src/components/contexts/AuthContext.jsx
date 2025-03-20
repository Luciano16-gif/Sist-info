import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { auth } from '../../firebase-config';
import { useNavigate, useLocation } from 'react-router-dom';
import * as authService from '../services/authService';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase-config';
import LoadingScreen from '../loading/LoadingScreen';

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
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [firestoreUserData, setFirestoreUserData] = useState(null);
  
  // Add a new state for the last valid user
  const [lastValidUser, setLastValidUser] = useState(null);
  const userStateRef = useRef({ user: null, role: null });

  // This is to ensure users return to the landing page after a logout
  const navigate = useNavigate();
  
  // Function to fetch user data from Firestore
  const fetchUserData = async (user) => {
    if (!user) return null;
    
    try {
      const userDocRef = doc(db, "lista-de-usuarios", user.email);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserRole(userData.userType || 'usuario');
        setFirestoreUserData(userData);
        
        // Create an enhanced user object that merges Firebase Auth user with Firestore data
        const enhancedUser = {
          ...user,
          // Override displayName with the name from Firestore if available
          displayName: userData.name && userData.lastName 
            ? `${userData.name} ${userData.lastName}`.trim()
            : user.displayName,
          // Override photoURL with the one from Firestore if available
          photoURL: userData['Foto de Perfil'] || user.photoURL || '',
          // Add additional Firestore fields
          firestoreData: userData
        };
        
        setCurrentUser(enhancedUser);
        
        // Store valid user data in localStorage and state
        try {
          localStorage.setItem('lastValidUserEmail', user.email);
          localStorage.setItem('lastValidUserRole', userData.userType || 'usuario');
        } catch (e) {
          console.error("Failed to store user in localStorage:", e);
        }
        
        // Update last valid user state
        setLastValidUser(enhancedUser);
        
        // Store in ref for immediate access
        userStateRef.current = { 
          user: enhancedUser, 
          role: userData.userType || 'usuario' 
        };
        
        return userData;
      } else {
        setUserRole('usuario');
        
        // Update last valid user state with basic info
        const basicUser = { ...user, role: 'usuario' };
        setLastValidUser(basicUser);
        
        // Store valid user email in localStorage
        try {
          localStorage.setItem('lastValidUserEmail', user.email);
          localStorage.setItem('lastValidUserRole', 'usuario');
        } catch (e) {
          console.error("Failed to store user in localStorage:", e);
        }
        
        // Store in ref for immediate access
        userStateRef.current = { user, role: 'usuario' };
        
        return null;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUserRole('usuario');
      return null;
    }
  };
  
  // Add this effect to maintain a record of the last valid user
  useEffect(() => {
    if (currentUser && currentUser.email) {
      // Store the current valid user
      setLastValidUser(currentUser);
      
      // Also store in localStorage for recovery if needed
      try {
        localStorage.setItem('lastValidUserEmail', currentUser.email);
        localStorage.setItem('lastValidUserRole', userRole || 'usuario');
      } catch (e) {
        console.error("Failed to store user in localStorage:", e);
      }
      
      // Update ref for immediate access
      userStateRef.current = { user: currentUser, role: userRole };
    }
  }, [currentUser, userRole]);
  
  // Effect to handle auth state changes now with mobile resilience in mind
  useEffect(() => {
    let authCheckTimeout = null;
    
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      
      if (user) {
        // Clear any pending timeouts
        if (authCheckTimeout) {
          clearTimeout(authCheckTimeout);
          authCheckTimeout = null;
        }
        
        await fetchUserData(user);
        setLoading(false);
      } else {
        
        // Simply clear everything on logout without prompts
        setCurrentUser(null);
        setUserRole(null);
        setFirestoreUserData(null);
        setLastValidUser(null);
        userStateRef.current = { user: null, role: null };
        
        // Clear local storage
        try {
          localStorage.removeItem('lastValidUserEmail');
          localStorage.removeItem('lastValidUserRole');
          localStorage.removeItem('tempUserEmail');
          localStorage.removeItem('tempUserRole');
        } catch (e) {
          console.error("Failed to clear localStorage:", e);
        }
        
        setLoading(false);
      }
    });

    // Cleanup on unmount
    return () => {
      unsubscribe();
      if (authCheckTimeout) {
        clearTimeout(authCheckTimeout);
      }
    };
  }, []);

  // Function to get the last valid user (for recovery)
  const getLastValidUser = () => {
    // First try from ref for most up-to-date data
    if (userStateRef.current && userStateRef.current.user) {
      return {
        ...userStateRef.current.user,
        role: userStateRef.current.role
      };
    }
    
    // Then try from state
    if (lastValidUser) {
      return lastValidUser;
    }
    
    // Finally try from localStorage
    try {
      const email = localStorage.getItem('lastValidUserEmail');
      const role = localStorage.getItem('lastValidUserRole');
      
      if (email) {
        return { email, role };
      }
    } catch (e) {
      console.error("Failed to get user from localStorage:", e);
    }
    
    return null;
  };

  // Function to update the user profile data
  const updateUserProfile = async (updatedData = {}) => {
    if (!currentUser) return;
    
    try {
      // Merge the new data with existing Firestore data
      const updatedFirestoreData = {
        ...firestoreUserData,
        ...updatedData
      };
      
      // Update the Firestore user data state
      setFirestoreUserData(updatedFirestoreData);
      
      // Create an enhanced user object with the updated data
      const enhancedUser = {
        ...currentUser,
        // Update displayName if name or lastName changed
        displayName: updatedData.name || updatedData.lastName
          ? `${updatedData.name || firestoreUserData.name || ''} ${updatedData.lastName || firestoreUserData.lastName || ''}`.trim()
          : currentUser.displayName,
        // Update photoURL if it changed
        photoURL: updatedData['Foto de Perfil'] || currentUser.photoURL || '',
        // Update the Firestore data
        firestoreData: updatedFirestoreData
      };
      
      // Update the current user
      setCurrentUser(enhancedUser);
      
      // Also update lastValidUser
      setLastValidUser(enhancedUser);
      
      // And the ref
      userStateRef.current = { 
        user: enhancedUser, 
        role: userRole 
      };
      
      // Update localStorage
      try {
        if (enhancedUser.email) {
          localStorage.setItem('lastValidUserEmail', enhancedUser.email);
        }
      } catch (e) {
        console.error("Failed to update user in localStorage:", e);
      }
    } catch (error) {
      console.error("Error updating user profile:", error);
      setError("Error updating user profile. Please try again.");
    }
  };

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
      
      // For Google auth, we need to ensure the Firestore data is fetched
      // before returning, as the redirect might happen immediately after
      if (result) {
        await fetchUserData(result);
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
      
      // Clear all localStorage authentication data
      try {
        // Clear all possible auth-related items
        const authItems = [
          'lastValidUserEmail',
          'lastValidUserRole',
          'tempUserEmail',
          'tempUserRole',
        ];
        
        authItems.forEach(item => {
          localStorage.removeItem(item);
        });
      } catch (e) {
        console.error("Error clearing localStorage:", e);
      }
      
      // Reset all authentication state variables
      setLastValidUser(null);
      setCurrentUser(null);
      setUserRole(null);
      setFirestoreUserData(null);
      userStateRef.current = { user: null, role: null };
      
      // Call Firebase auth logout
      const result = await authService.logOut();
      
      // Check if there was an error with Firebase logout
      if (result && result.error) {
        setError(result.message);
        if (onError) onError({ message: result.message });
        return false;
      }
      
      // Navigate to landing page after successful logout
      navigate('/');
      
      return true;
    } catch (error) {
      console.error("Error during logout:", error);
      setError(error.message || 'Ocurrió un error al cerrar sesión.');
      if (onError) onError(error);
      return false;
    }
  };

  // Context value object
  const value = {
    currentUser,
    userRole,
    error,
    login,
    signup,
    loginWithGoogle,
    logout,
    loading,
    isAuthenticating,
    setError,
    updateUserProfile,
    firestoreUserData,
    lastValidUser,
    getLastValidUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : <LoadingScreen appName="ÁvilaVenturas" />}
    </AuthContext.Provider>
  );
};

// Custom redirect hook with improved logic to prevent unwanted redirects
export const useAuthRedirect = (redirectPath = '/') => {
  const { currentUser, isAuthenticating, error, getLastValidUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Try to get user from multiple sources
    const effectiveUser = currentUser || getLastValidUser();
    
    // Only redirect if:
    // 1. We have a current user
    // 2. We're not in the middle of an authentication process
    // 3. There are no authentication errors
    // 4. We're not already on the redirectPath
    if (effectiveUser && 
        !isAuthenticating && 
        !error && 
        location.pathname !== redirectPath) {
      navigate(redirectPath);
    }
  }, [currentUser, navigate, redirectPath, isAuthenticating, error, location]);

  return currentUser || getLastValidUser();
};