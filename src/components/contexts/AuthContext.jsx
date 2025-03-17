import { createContext, useContext, useState, useEffect } from 'react';
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
  const [userRole, setUserRole] = useState(null); // Add user role state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  // New state for profile photo URL from Firestore
  const [profilePhotoUrl, setProfilePhotoUrl] = useState('');
  
  // Effect to handle auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          // Fetch user role from Firestore
          const userDocRef = doc(db, "lista-de-usuarios", user.email);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            // Set the user role from Firestore (default to 'usuario' if not present)
            setUserRole(userData.userType || 'usuario');
            // Set the profile photo URL from Firestore
            setProfilePhotoUrl(userData['Foto de Perfil'] || '');
          } else {
            // Default role if document doesn't exist
            setUserRole('usuario');
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          // Default role if there's an error
          setUserRole('usuario');
        }
      } else {
        // Clear role when user is not authenticated
        setUserRole(null);
        setProfilePhotoUrl('');
      }
      
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

  // New function to update profile photo URL
  const updateProfilePhoto = (photoUrl) => {
    setProfilePhotoUrl(photoUrl);
  };

  // Context value object
  const value = {
    currentUser,
    userRole,
    profilePhotoUrl, // Add profile photo URL to context
    updateProfilePhoto, // Add function to update profile photo
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
      {!loading ? children : <LoadingScreen appName="ÁvilaVenturas" />}
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